import { EuiPage, EuiPageBody, EuiPageSection, EuiText } from "@elastic/eui";
import { ContactForm } from "../../components/ContactForm";
import "./ContactPage.css";

/**
 * Contact page component.
 *
 * @returns Contact page React component.
 */
export function ContactPage() {
    return (
        <main id="contact">
            <EuiPage paddingSize="none">
                <EuiPageBody>
                    <EuiPageSection>
                        <EuiText>
                            <article className="contact-message">
                                <h1>Contact Us</h1>
                                <p>
                                    If you have questions about Chercher or
                                    additions to the database, you can use this
                                    form to contact us directly.
                                </p>
                                <p>
                                    We would also like to hear about your
                                    experience:
                                    <ul>
                                        <li>What have you discovered?</li>
                                        <li>Has anything surprised you?</li>
                                        <li>
                                            How has Chercher advanced your work?
                                        </li>
                                        <li>
                                            If you have cited Chercher in your
                                            publications or projects, could you
                                            please provide details so we may
                                            share them with other users?
                                        </li>
                                    </ul>
                                </p>
                                <p>
                                    Your response will help us to improve
                                    Chercher and reach new users.
                                </p>
                            </article>
                        </EuiText>
                    </EuiPageSection>
                    <ContactForm />
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
