import {
    EuiFormControlLayout,
    EuiFormLabel,
    EuiPage,
    EuiPageBody,
    EuiPageSidebar,
    EuiSelect,
    EuiSpacer,
    EuiText,
} from "@elastic/eui";
import React, { useEffect, useRef, useState } from "react";
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
        text: year,
        value: year,
        id: `select-${year}`,
    }));

    const [currentYear, setCurrentYear] = useState(`year-${years[0].year}`);
    const [docHeightState, setDocHeightState] = useState(0);
    const containerRef = useRef();

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() =>
            setDocHeightState(docHeightState + 1),
        );

        resizeObserver.observe(containerRef?.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    /**
     * Handle navigating to year when button is clicked.
     *
     @param {string} id Element ID of year that was clicked.
     */
    const handleChange = (id) => {
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
                <EuiPageSidebar sticky paddingSize="l">
                    <nav className="timeline-nav">
                        <EuiFormControlLayout
                            prepend={
                                <EuiFormLabel htmlFor="year-select">
                                    Select Year
                                </EuiFormLabel>
                            }
                        >
                            <EuiSelect
                                id="year-select"
                                options={years}
                                value={currentYear.replace("year-", "")}
                                onChange={({ target }) =>
                                    handleChange(`year-${target.value}`)
                                }
                            />
                        </EuiFormControlLayout>
                        <EuiSpacer size="l" />
                        <EuiText>
                            <p className="timeline-key timeline-key-personal">
                                Beckett work and life events.
                            </p>
                            <p className="timeline-key timeline-key-global">
                                Significant global events.
                            </p>
                        </EuiText>
                    </nav>
                </EuiPageSidebar>
                <EuiPageBody panelled>
                    <section className="timeline-scrolling-container">
                        {timelineData.map((year) => (
                            <TimelineYear
                                key={`timeline-${year.year}`}
                                data={year}
                                currentYear={currentYear}
                                setCurrentYear={setCurrentYear}
                                root={containerRef.current}
                                docHeightState={docHeightState}
                            />
                        ))}
                    </section>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
