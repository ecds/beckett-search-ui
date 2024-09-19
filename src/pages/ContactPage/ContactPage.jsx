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
                            <article>{/* HTML content here */}</article>
                        </EuiText>
                    </EuiPageSection>
                    <ContactForm />
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
