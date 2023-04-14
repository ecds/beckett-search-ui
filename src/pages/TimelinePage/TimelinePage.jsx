import { EuiButton, EuiPage, EuiPageBody, EuiPageSideBar } from "@elastic/eui";
import React, { useRef, useState } from "react";
import { timelineData } from "../../data/timelineData";
import "react-vertical-timeline-component/style.min.css";
import "./TimelinePage.css";
import TimelineYear from "../../components/TimelineYear";

/**
 * Page for timeline.
 *
 * @returns {React.Component} entity page component.
 */
export function TimeLinePage() {
    const years = timelineData.map(({ year }) => ({
        label: year,
        id: `year-${year}`,
        href: `#year-${year}`,
    }));

    const [currentYear, setCurrentYear] = useState(years[0].id);
    const containerRef = useRef();

    /**
     * Handle navigating to year when button is clicked.
     *
     @param {string} id Element ID of year that was clicked.
     */
    const handleClick = (id) => {
        // Ideally, this would be an effect on the TimeLineYear component when
        // currentYear is updated. But the currentYear is updated by the intersection
        // observer. It get's all wonky/messy when someone is scrolling. This
        // will do for now.
        document.getElementById(id).scrollIntoView({ behavior: "instant" });
        setTimeout(() => setCurrentYear(id), 100);
    };

    return (
        <main ref={containerRef}>
            <EuiPage paddingSize="none" className="timeline-page">
                <EuiPageSideBar sticky paddingSize="l">
                    <nav className="timeline-nav">
                        {years.map((year) => (
                            <EuiButton
                                key={year.label}
                                onClick={() => handleClick(year.id)}
                                id={`nav-${year.label}`}
                                fill={year.id === currentYear}
                            >
                                {year.label}
                            </EuiButton>
                        ))}
                    </nav>
                </EuiPageSideBar>
                <EuiPageBody>
                    <section style={{ overflow: "auto" }}>
                        {timelineData.map((year) => (
                            <TimelineYear
                                key={`timeline-${year.year}`}
                                data={year}
                                currentYear={currentYear}
                                setCurrentYear={setCurrentYear}
                                root={containerRef.current}
                            />
                        ))}
                    </section>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
