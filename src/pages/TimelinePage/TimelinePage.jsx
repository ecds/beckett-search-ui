import {
    EuiPage,
    EuiPageBody,
    EuiPageSideBar,
    EuiSideNav,
    EuiText,
    EuiTextAlign,
} from "@elastic/eui";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import React from "react";
import { timelineData } from "../../data/timelineData";
import "react-vertical-timeline-component/style.min.css";
import "./TimelinePage.css";

/**
 * Page for timeline.
 *
 * @returns {React.Component} entity page component.
 */
export function TimeLinePage() {
    const years = timelineData.map(({ year }) => ({
        name: year,
        id: `nav-${year}`,
        href: `#year-${year}`,
    }));

    return (
        <main>
            <EuiPage paddingSize="l">
                <EuiPageSideBar sticky>
                    <EuiSideNav items={years} />
                </EuiPageSideBar>
                <EuiPageBody>
                    {timelineData.map((year) => (
                        <section key={year.year} id={`year-${year.year}`}>
                            <EuiText className="timeline-year-header">
                                <EuiTextAlign textAlign="center">
                                    <h1>{year.year}</h1>
                                </EuiTextAlign>
                            </EuiText>
                            <VerticalTimeline
                                lineColor="#b1b3b3"
                                animate={false}
                            >
                                {year.events.map((event) => {
                                    const color =
                                        event.type === "personal"
                                            ? "#007dba"
                                            : "#e6b965";
                                    return (
                                        <VerticalTimelineElement
                                            key={event.id}
                                            position={
                                                event.type === "personal"
                                                    ? "left"
                                                    : "right"
                                            }
                                            iconStyle={{
                                                background: color,
                                                marginTop: "-10px",
                                            }}
                                            contentArrowStyle={{
                                                borderRight: `7px solid  ${color}`,
                                                top: "10px",
                                            }}
                                            contentStyle={{
                                                borderColor: color,
                                                borderStyle: "solid",
                                                borderWidth: "thin",
                                                boxShadow: "none",
                                                padding: "0",
                                            }}
                                            className={`timeline-event timeline-event-type-${event.type}`}
                                        >
                                            <h2>{event.date}</h2>
                                            <p
                                                // eslint-disable-next-line react/no-danger
                                                dangerouslySetInnerHTML={{
                                                    __html: event.description,
                                                }}
                                            />
                                        </VerticalTimelineElement>
                                    );
                                })}
                            </VerticalTimeline>
                        </section>
                    ))}
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
