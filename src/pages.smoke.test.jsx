import { EuiProvider } from "@elastic/eui";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Root } from "./Root";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { LetterPage } from "./pages/LetterPage";
import { EntityPage } from "./pages/EntityPage";
import { TimeLinePage } from "./pages/TimelinePage";
import { FaqPage } from "./pages/FaqPage";
import { FilmInterviewsPages } from "./pages/FilmInterviewsPage";
import { AboutPages } from "./pages/AboutPages";
import { ContactPage } from "./pages/ContactPage";
import { LettersSearchPage } from "./pages/LettersSearchPage";
import { EntitiesSearchPage } from "./pages/EntitiesSearchPage";

const emptySearchResponse = () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
        Promise.resolve({
            hits: { total: { value: 0 }, hits: [] },
            aggregations: {},
        }),
});

/**
 * Renders a single route (plus the shared Root/ErrorPage shell) via a memory
 * router, mirroring main.jsx's route tree without pulling in the real one -
 * every real loader hits the live API, which these smoke tests replace with
 * static data.
 */
const renderRoute = (path, route) => {
    const router = createMemoryRouter(
        [
            {
                path: "/",
                element: <Root />,
                errorElement: <ErrorPage />,
                children: [route],
            },
        ],
        { initialEntries: [path] },
    );
    return render(
        <EuiProvider colorMode="light">
            <RouterProvider router={router} />
        </EuiProvider>,
    );
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("page smoke tests", () => {
    it("renders the home page", async () => {
        renderRoute("/", { index: true, element: <HomePage /> });
        expect(
            await screen.findByRole("heading", {
                name: /the letters of samuel beckett/i,
            }),
        ).toBeInTheDocument();
    });

    it("renders the letters search page", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(emptySearchResponse()));
        renderRoute("/letters", { path: "letters", element: <LettersSearchPage /> });
        await waitFor(() =>
            expect(
                screen.getByText(/did not return any results|loading/i),
            ).toBeInTheDocument(),
        );
    });

    it("renders the entities search page", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(emptySearchResponse()));
        renderRoute("/entities", {
            path: "entities",
            element: <EntitiesSearchPage />,
        });
        await waitFor(() =>
            expect(
                screen.getByText(/did not return any results|loading/i),
            ).toBeInTheDocument(),
        );
    });

    it("renders an individual letter page", async () => {
        renderRoute("/letters/1", {
            path: "letters/:letterId",
            element: <LetterPage />,
            loader: () => ({
                metadata: { date: "1929-03-22", recipient: "Test Recipient" },
                repositories: null,
                publication_information: null,
                previously_published: null,
                mentions: null,
            }),
        });
        expect(
            await screen.findByRole("heading", { name: /letter to test recipient/i }),
        ).toBeInTheDocument();
    });

    it("redirects a 404 letter loader response to the error page", async () => {
        renderRoute("/letters/missing", {
            path: "letters/:letterId",
            element: <LetterPage />,
            loader: () => ({ status: 404 }),
        });
        expect(
            await screen.findByRole("heading", { name: /not found|404/i }),
        ).toBeInTheDocument();
    });

    it("renders an individual entity page", async () => {
        renderRoute("/entities/1", {
            path: "entities/:entityId",
            element: <EntityPage />,
            loader: () => ({
                label: "Test Entity",
                e_type: "person",
                full_display: "<p>Full display</p>",
                letters: null,
            }),
        });
        expect(await screen.findByText("Test Entity")).toBeInTheDocument();
    });

    it("renders the timeline page", async () => {
        renderRoute("/timeline", { path: "timeline", element: <TimeLinePage /> });
        expect(
            await screen.findByRole("combobox", { name: /select year/i }),
        ).toBeInTheDocument();
    });

    it("renders the faq page", async () => {
        renderRoute("/faq", {
            path: "faq",
            element: <FaqPage />,
            loader: () => [{ position: 1, question: "A question?", answer: "An answer." }],
        });
        expect(
            await screen.findByRole("heading", { name: /frequently asked questions/i }),
        ).toBeInTheDocument();
        expect(screen.getByText("A question?")).toBeInTheDocument();
    });

    it("renders the film interviews page", async () => {
        renderRoute("/film-interviews", {
            path: "film-interviews",
            element: <FilmInterviewsPages />,
            loader: () => [],
        });
        expect(
            await screen.findByRole("heading", { name: /film interviews/i }),
        ).toBeInTheDocument();
    });

    it.each([
        ["/about", "about"],
        ["/about/project-history", "about/project-history"],
        ["/about/letters", "about/letters"],
        ["/about/entities", "about/entities"],
        ["/about/abbreviations", "about/abbreviations"],
    ])("renders the about page at %s", async (path, routePath) => {
        renderRoute(path, {
            path: routePath,
            element: <AboutPages />,
            loader: () => ({ body: "<p>About page content</p>" }),
        });
        expect(await screen.findByText("About page content")).toBeInTheDocument();
    });

    it("renders the contact page", async () => {
        renderRoute("/contact", { path: "contact", element: <ContactPage /> });
        expect(
            await screen.findByRole("heading", { name: /contact us/i }),
        ).toBeInTheDocument();
    });

    it("renders the error page for an unmatched route", async () => {
        renderRoute("/does-not-exist", { path: "letters", element: <LettersSearchPage /> });
        expect(
            await screen.findByRole("heading", { name: /404/i }),
        ).toBeInTheDocument();
    });
});
