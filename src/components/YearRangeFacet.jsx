import React from "react";
import {
    EuiAccordion,
    EuiDualRange,
    EuiFormRow,
    EuiPanel,
    EuiTitle,
    useGeneratedHtmlId,
} from "@elastic/eui";
import "./AccordionFacet.css";

/**
 * YearRange facet display component, adapted from @searchkit/elastic-ui but with the
 * ability to use minimum and maximum year aggregations across the dataset.
 *
 * @param {object} props - React functional component props
 * @param {boolean} props.accordion Indicate if form should be wrapped in an accordion
 * @param {number} props.minYear - Min year returned from API
 * @param {number} props.maxYear - Max year returned from API
 * @param {Function} props.setYearRange - Function to set year range state
 * @param {object} props.yearRange - Current year range state
 * @returns {React.Component} Year range React component
 */
function YearRangeFacet({
    accordion,
    minYear,
    maxYear,
    setYearRange,
    yearRange,
}) {
    const accordionId = useGeneratedHtmlId({ prefix: "accordion" });

    /**
     * Handle change in start/end year of year filtering range
     *
     * @param {Array<number>} value - start and end years of year filtering range
     */
    const onRangeChange = (value) => {
        setYearRange((prevState) => ({
            ...prevState,
            startYear: value[0],
            endYear: value[1],
        }));
    };

    // Passing empty strings as the value allows the inputs to be blank,
    // though the range handles will still be placed at the min/max positions

    return (
        <div>
            {accordion ? (
                <EuiAccordion
                    id={accordionId}
                    arrowDisplay="right"
                    buttonClassName="accordion-button"
                    buttonContent="Years"
                    className="accordion-facet"
                >
                    <EuiPanel color="subdued">
                        <EuiFormRow>
                            <EuiDualRange
                                value={[
                                    yearRange.startYear || "",
                                    yearRange.endYear || "",
                                ]}
                                onChange={onRangeChange}
                                fullWidth
                                min={minYear || 1900}
                                max={maxYear}
                                showInput="inputWithPopover"
                                showLabels
                                aria-label="Year filter input form"
                                prepend="From"
                                append="To"
                            />
                        </EuiFormRow>
                    </EuiPanel>
                </EuiAccordion>
            ) : (
                <>
                    <EuiTitle size="xxs">
                        <h3>Years</h3>
                    </EuiTitle>
                    <EuiFormRow>
                        <EuiDualRange
                            value={[
                                yearRange.startYear || "",
                                yearRange.endYear || "",
                            ]}
                            onChange={onRangeChange}
                            fullWidth
                            min={minYear || 1900}
                            max={maxYear}
                            showInput="inputWithPopover"
                            showLabels
                            aria-label="Year filter input form"
                            prepend="From"
                            append="To"
                        />
                    </EuiFormRow>
                </>
            )}
        </div>
    );
}

YearRangeFacet.defaultProps = {
    accordion: false,
};

export default YearRangeFacet;
