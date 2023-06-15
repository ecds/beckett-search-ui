import React, { useState } from "react";
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiText,
    EuiPageSideBar,
    EuiSideNav,
    EuiHorizontalRule,
} from "@elastic/eui";
import { interviews } from "../../data/videoData";
import "./FilmInterviewsPage.css";

/**
 * Page for film interviews.
 *
 * @returns {React.Component} film interviews page component.
 */
export function FilmInterviewsPages() {
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);

    /**
     * Toggle side nav on mobile.
     */
    const toggleOpenOnMobile = () => {
        setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    /**
     * Handle navigating to year when button is clicked.
     *
   @param {string} id Element ID of year that was clicked.
     */
    const handleClick = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    };

    /* eslint-disable jsdoc/require-jsdoc */
    const sideNavItems = [
        {
            name: "Topics",
            id: "4fe3fe27-2400-50cd-80df-e270f49d9db5",
            items: interviews.map((items) => ({
                id: items.id,
                name: items.label,
                onClick: () => {
                    handleClick(items.id);
                },
            })),
        },
    ];
    /* eslint-enable jsdoc/require-jsdoc */

    return (
        <main id="film-interviews">
            <EuiPage paddingSize="none" className="film-interview-page">
                <EuiPageSideBar
                    sticky
                    paddingSize="m"
                    className="film-topic-nav"
                >
                    <EuiSideNav
                        items={sideNavItems}
                        mobileTitle="Film Topics"
                        toggleOpenOnMobile={() => toggleOpenOnMobile()}
                        isOpenOnMobile={isSideNavOpenOnMobile}
                    />
                </EuiPageSideBar>
                <EuiPageBody component="section">
                    <EuiPageContent>
                        <EuiText>
                            <header>
                                <h1>Film Interviews</h1>
                            </header>
                            <EuiPageContentBody>
                                <p>
                                    The film segments below are excerpts from
                                    interviews for the documentary <i>Waiting for Beckett</i> (1993, Global Village Communication,
                                    Inc.), co-produced and directed by the late
                                    John Reilly and Melissa Shaw Smith. They are
                                    used here with the kind permission of Estate
                                    of John Reilly and Global Village
                                    Communication, Inc.
                                </p>
                                <p>
                                    Interviews, transcriptions and other
                                    information about the making of this film
                                    have been deposited in the Rose Library,
                                    Emory University as MSS 1336; the digitized
                                    tapes can be consulted in the archive.
                                </p>
                                <p>
                                    <em>
                                        These film segments cannot be replicated
                                        or quoted without express permission.
                                    </em>
                                </p>
                                {interviews.map((interview) => (
                                    <section
                                        key={interview.id}
                                        id={interview.id}
                                    >
                                        <h2 className="film-topic-heading">
                                            {interview.label}
                                        </h2>
                                        {interview.videos.map((video) => (
                                            /* axelinter:disable:empty-heading */
                                            <section key={video.id}>
                                                <h3
                                                    className="film-title-heading"
                                                    // eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{
                                                        __html: video.title,
                                                    }}
                                                />
                                                <iframe
                                                    title={video.title}
                                                    src={video.source}
                                                    width={640}
                                                    height={360}
                                                    frameBorder={0}
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                <EuiHorizontalRule margin="xl" />
                                                {/* <EuiSpacer size="xxl" /> */}
                                            </section>
                                            /* axelinter:enable:empty-heading */
                                        ))}
                                        <p>
                                            <a
                                                href="#film-interviews"
                                                title="Back to top"
                                            >
                                                Back To Top
                                            </a>
                                        </p>
                                    </section>
                                ))}
                            </EuiPageContentBody>
                        </EuiText>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
