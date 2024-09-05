import { useCallback, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
    EuiFormControlLayout,
    EuiFormLabel,
    EuiButton,
    EuiCallOut,
} from "@elastic/eui";
import "./Form.css";

/**
 * Contact form component.
 *
 * @summary Component that calls a PHP file to send email.
 * @returns HTML contact form.
 */
export function Form() {
    const nameRef = useRef();
    const emailRef = useRef();
    const messageRef = useRef();
    const formRef = useRef();
    const [token, setToken] = useState(undefined);
    const [success, setSuccess] = useState(false);

    /**
     * Send POST request to PHP file.
     *
     * @summary Sends a POST request to PHP mailer with parameters from the form. If the request is successful, the form is reset and a success message is displayed.
     * @returns {undefined} Noting is returned.
     */
    const sendMail = async () => {
        const response = await fetch("/mail.php", {
            method: "POST",
            body: `name=${encodeURI(nameRef.current.value)}&message=${encodeURI(
                messageRef.current.value,
            )}`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        });
        nameRef.current.value = "";
        messageRef.current.value = "";
        emailRef.current.value = "";
        if (response.status === 200) setSuccess(true);
        const responseBody = await response.text();
        console.log("🚀 ~ sendMail ~ response:", responseBody);
    };

    const handleVerify = useCallback((_token) => {
        setToken(_token);
    });

    if (success) {
        return (
            <EuiCallOut color="success" title="Response sent. Thank you!">
                <p>
                    <EuiButton
                        fill
                        onClick={() => {
                            setSuccess(false);
                            setToken(undefined);
                        }}
                        className="primary-button"
                    >
                        Reset Form
                    </EuiButton>
                </p>
            </EuiCallOut>
        );
    }

    return (
        <form ref={formRef} className="contact-form">
            <EuiFormControlLayout
                prepend={<EuiFormLabel htmlFor="name">Name</EuiFormLabel>}
            >
                <input
                    className="euiFieldText"
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    required
                />
            </EuiFormControlLayout>
            <EuiFormControlLayout
                prepend={<EuiFormLabel htmlFor="email">Email</EuiFormLabel>}
            >
                <input
                    className="euiFieldText"
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    required
                />
            </EuiFormControlLayout>

            <div>
                <textarea
                    ref={messageRef}
                    className="euiTextArea"
                    aria-label="Use aria labels when no actual label is in use"
                    rows="6"
                    placeholder="Message"
                />
            </div>
            <div>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_API_KEY}
                    onChange={handleVerify}
                    onExpired={() => setToken(undefined)}
                />
            </div>
            <div>
                <EuiButton
                    fill
                    isDisabled={token === undefined}
                    onClick={sendMail}
                    className={token === undefined ? "" : "primary-button"}
                >
                    Send
                </EuiButton>
            </div>
        </form>
    );
}
