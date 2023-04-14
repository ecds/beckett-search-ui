import { EuiText, EuiTextAlign } from "@elastic/eui";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";

import React, { useEffect, useRef } from "react";
import "./TimelineYear.css";
/**
 * React component for displaying a timeline for a year.
 * Much of the intersection observer logic is based on
 * https://developer.chrome.com/blog/sticky-headers/
 *
 * @param {object} props React functional components props object
 * @param {HTMLElement} props.root Container for all timelines
 * @param {object} props.data Object with all the events for the given year
 * @param {number} props.docHeighState Year that is currently in the viewport
 * @param {Function} props.setCurrentYear Function to set the value for currentYear
 * @returns {React.Component} React functional component for a timeline
 */
function TimelineYear({ data, root, setCurrentYear, docHeighState }) {
    const headerRef = useRef();
    const bumperTopRef = useRef();
    const bumperBottomRef = useRef();
    const id = `year-${data.year}`;

    useEffect(() => {
        // Observer for the top bumpers that updates the current year while scrolling down.
        const topObserver = new IntersectionObserver(
            ([record]) => {
                const { boundingClientRect, rootBounds } = record;

                if (boundingClientRect.bottom < rootBounds.top) {
                    setCurrentYear(id);
                }
            },
            { threshold: [0], root },
        );

        // Observer for the bottom bumpers that updates the current year while scrolling up.
        const bottomObserver = new IntersectionObserver(
            ([record]) => {
                const { boundingClientRect, rootBounds, intersectionRatio } =
                    record;

                if (
                    boundingClientRect.bottom > rootBounds.top &&
                    intersectionRatio === 1
                ) {
                    setCurrentYear(id);
                }
            },
            { threshold: [1], root },
        );

        if (bumperTopRef.current) topObserver.observe(bumperTopRef.current);
        if (bumperBottomRef.current)
            bottomObserver.observe(bumperBottomRef.current);

        return () => {
            topObserver.disconnect();
            bottomObserver.disconnect();
        };
    }, [docHeighState]);

    return (
        <section
            id={`year-${data.year}`}
            style={{ position: "relative" }}
            ref={headerRef}
        >
            <header className="sticky-timeline-header">
                <EuiText>
                    <EuiTextAlign textAlign="center">
                        <h1>{data.year}</h1>
                    </EuiTextAlign>
                </EuiText>
            </header>
            <VerticalTimeline lineColor="#b1b3b3" animate={false}>
                {data.events.map((event) => {
                    const color =
                        event.type === "personal" ? "#007dba" : "#e6b965";
                    return (
                        <VerticalTimelineElement
                            key={event.id}
                            position={
                                event.type === "personal" ? "left" : "right"
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
            {/* These elements mark the top and bottom of the time line and help determine the currentYear */}
            <div
                className="sticky-bumper sticky-bumper-top"
                ref={bumperTopRef}
            />
            <div
                className="sticky-bumper sticky-bumper-bottom"
                ref={bumperBottomRef}
            />
        </section>
    );
}

export default TimelineYear;
