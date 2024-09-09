import { useCallback, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { EuiButton, EuiCallOut, EuiFormRow } from "@elastic/eui";
import "./ContactForm.css";

/**
 * Contact form component.
 *
 * @summary Component that calls a PHP file to send email.
 * @returns HTML contact form.
 */
export function ContactForm() {
    const nameRef = useRef();
    const emailRef = useRef();
    const messageRef = useRef();
    const formRef = useRef();
    const recaptchaRef = useRef(undefined);
    const [captchaSuccess, setCaptchaSuccess] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);
    const [error, setError] = useState(undefined);

    /**
     * Check if all fields have content.
     * @param {boolean | undefined} submitted Form onSubmit event.
     * @returns {boolean | undefined} True if all fields have content.
     */
    const allFilled = (submitted) => {
        if (!submitted) return undefined;
        const values = [
            nameRef.current.value.length,
            emailRef.current.value.length,
            messageRef.current.value.length,
        ];

        if (values.some((value) => value === 0)) {
            setError("All fields are required.");
            return false;
        }

        return true;
    };

    /**
     * Send POST request to PHP file.
     *
     * @summary Sends a POST request to PHP mailer with parameters from the form. If the request is successful, the form is reset and a success message is displayed.
     * @param {Event} event Form onSubmit event.
     * @returns {undefined} Noting is returned.
     */
    const sendMail = async (event) => {
        if (formRef.current.checkValidity()) event.preventDefault();
        if (!allFilled()) return;
        const response = await fetch("/mail.php", {
            method: "POST",
            body: `name=${encodeURI(nameRef.current.value)}&email=${encodeURI(
                emailRef.current.value,
            )}&message=${encodeURI(messageRef.current.value)}`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        });
        nameRef.current.value = "";
        messageRef.current.value = "";
        emailRef.current.value = "";
        if (response.status === 200) setSentSuccess(true);
        if (response.status !== 200) {
            const responseBody = await response.text();
            setError(responseBody);
        }
    };

    const handleVerify = useCallback((token) => {
        /**
         * Verify the token.
         *
         * @summary Verifies the token and sets captchaSuccess accordingly.
         * @param {string} captchaValue - Token from reCAPTCHA.
         * @returns {undefined} Nothing.
         */
        const verifyCaptcha = async (captchaValue) => {
            const response = fetch("/verifyCaptcha.php", {
                method: "POST",
                body: `captchaValue=${captchaValue}`,
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            });
            const data = await (await response).json();

            setCaptchaSuccess(data.success);
        };
        verifyCaptcha(token);
    });

    if (sentSuccess) {
        return (
            <EuiCallOut color="success" title="Response sent. Thank you!">
                <p>
                    <EuiButton
                        fill
                        onClick={() => {
                            setSentSuccess(false);
                            setCaptchaSuccess(false);
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
        <div>
            {error && (
                <EuiCallOut color="danger" title="An Error Occurred">
                    <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                            __html: error,
                        }}
                    />
                </EuiCallOut>
            )}
            <form ref={formRef} className="contact-form" onSubmit={sendMail}>
                <EuiFormRow label="Name">
                    <input
                        ref={nameRef}
                        className="euiFieldText"
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={allFilled}
                    />
                </EuiFormRow>
                <EuiFormRow label="Email">
                    <input
                        ref={emailRef}
                        className="euiFieldText"
                        type="email"
                        id="email"
                        name="email"
                        required
                    />
                </EuiFormRow>
                <EuiFormRow label="Message">
                    <textarea
                        ref={messageRef}
                        className="euiTextArea"
                        aria-label="Message to send."
                        rows="6"
                        required
                    />
                </EuiFormRow>
                <div>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_API_KEY}
                        onChange={handleVerify}
                        onExpired={() => setCaptchaSuccess(false)}
                    />
                </div>
                <div className="submit-button-container">
                    <EuiButton
                        type="submit"
                        fill
                        isDisabled={!captchaSuccess}
                        onClick={sendMail}
                        className={captchaSuccess ? "primary-button" : ""}
                    >
                        Send {captchaSuccess}
                    </EuiButton>
                </div>
            </form>
        </div>
    );
}
