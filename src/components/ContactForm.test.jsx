import { EuiProvider } from "@elastic/eui";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm";

// The real widget loads Google's script; this stub just exposes a button
// that reports a solved captcha through the same onChange prop.
vi.mock("react-google-recaptcha", () => ({
    default: function MockReCAPTCHA({ onChange }) {
        return (
            <button type="button" onClick={() => onChange("token")}>
                Solve captcha
            </button>
        );
    },
}));

const jsonResponse = (body) => ({
    status: 200,
    json: () => Promise.resolve(body),
});

const stubFetch = ({ mail }) => {
    const fetchMock = vi.fn((url) =>
        url === "/verifyCaptcha.php"
            ? Promise.resolve(jsonResponse({ success: true }))
            : Promise.resolve(mail),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

const mailCalls = (fetchMock) =>
    fetchMock.mock.calls.filter(([url]) => url === "/mail.php");

const renderForm = () =>
    render(
        <EuiProvider colorMode="light">
            <ContactForm />
        </EuiProvider>,
    );

const solveCaptcha = async (user) => {
    await user.click(screen.getByRole("button", { name: "Solve captcha" }));
    await waitFor(() =>
        expect(screen.getByRole("button", { name: /send/i })).toBeEnabled(),
    );
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("ContactForm", () => {
    it("renders a real <form> element", () => {
        stubFetch({ mail: { status: 200 } });
        const { container } = renderForm();
        expect(container.querySelector("form.contact-form")).not.toBeNull();
    });

    it("keeps Send disabled until the captcha is verified", async () => {
        stubFetch({ mail: { status: 200 } });
        const user = userEvent.setup();
        renderForm();

        expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
        await solveCaptcha(user);
    });

    it("posts the fields to /mail.php and shows the success message", async () => {
        const fetchMock = stubFetch({ mail: { status: 200 } });
        const user = userEvent.setup();
        renderForm();

        await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.type(
            screen.getByLabelText("Message to send."),
            "Lovely site",
        );
        await solveCaptcha(user);
        await user.click(screen.getByRole("button", { name: /send/i }));

        expect(await screen.findByText("Response sent. Thank you!")).toBeVisible();
        const calls = mailCalls(fetchMock);
        expect(calls).toHaveLength(1);
        const [, options] = calls[0];
        expect(options.method).toBe("POST");
        expect(options.body).toBe(
            "name=Ada%20Lovelace&email=ada@example.com&message=Lovely%20site",
        );
    });

    it("shows the server's error message when /mail.php rejects the request", async () => {
        stubFetch({
            mail: { status: 400, text: () => Promise.resolve("Email is invalid") },
        });
        const user = userEvent.setup();
        renderForm();

        await user.type(screen.getByLabelText("Name"), "Ada");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.type(screen.getByLabelText("Message to send."), "Hi");
        await solveCaptcha(user);
        await user.click(screen.getByRole("button", { name: /send/i }));

        expect(await screen.findByText("An Error Occurred")).toBeVisible();
        expect(screen.getByText("Email is invalid")).toBeVisible();
    });

    it("does not call /mail.php when required fields are empty", async () => {
        const fetchMock = stubFetch({ mail: { status: 200 } });
        const user = userEvent.setup();
        renderForm();

        await solveCaptcha(user);
        await user.click(screen.getByRole("button", { name: /send/i }));

        expect(mailCalls(fetchMock)).toHaveLength(0);
    });
});
