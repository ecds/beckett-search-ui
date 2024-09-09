import {
    EuiButton,
    EuiPage,
    EuiPageBody,
    EuiPageSection,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from "@elastic/eui";
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
                    <ContactForm />
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
