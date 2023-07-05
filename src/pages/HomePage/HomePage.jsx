import {
    EuiButton,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import { useHref } from "react-router-dom";
import "./HomePage.css";
import bannerImg from "./home-banner.png";

/**
 * Home page component.
 *
 * @returns Home page React component.
 */
export function HomePage() {
    return (
        <main id="home">
            <EuiPage paddingSize="none">
                <EuiPageBody component="section">
                    <EuiPageHeader className="euiScreenReaderOnly">
                        <EuiPageHeaderSection>
                            <EuiTitle size="m">
                                <h1>The Letters of Samuel Beckett</h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageContent
                        paddingSize="none"
                        hasShadow={false}
                        className="home-container"
                    >
                        <EuiPageContentBody>
                            <img
                                alt="Samuel Beckett Letters banner"
                                src={bannerImg}
                            />
                            <div className="description">
                                <p>
                                    Welcome to the interactive index for The
                                    Letters of Samuel Beckett. Here you can find
                                    information on all Beckett <b>letters</b> held in
                                    public archives, such as their physical state and
                                    location. You can also research <b>entities</b>:
                                    people, places and things mentioned by Beckett in his letters.
                                </p>
                                <EuiButton fill href={useHref("/letters")}>
                                    Search Letters
                                </EuiButton>
                                <EuiButton fill href={useHref("/entities")}>
                                    Search Entities
                                </EuiButton>
                            </div>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
