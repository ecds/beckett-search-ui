import React from "react";
import { EuiAccordion, EuiPanel, useGeneratedHtmlId } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.css";
import ListFacet from "./ListFacet";
import "./AccordionFacet.css";

/**
 * ListFacet component wrapped in an EuiAccordion container
 *
 * @param {object} props React functional component props object
 * @param {object} props.facet The facet to render as a list of options
 * @param {string} props.label Accordion button label
 * @returns {React.Component} React component for conditionally rendered entity type facets
 */
function AccordionFacet({ facet, label }) {
    const accordionId = useGeneratedHtmlId({ prefix: "accordion" });

    return (
        <div>
            <EuiAccordion
                id={accordionId}
                arrowDisplay="right"
                buttonContent={label}
                buttonClassName="accordion-button"
                className="accordion-facet"
            >
                <EuiPanel color="subdued">
                    <ListFacet
                        displayTitle={false}
                        facet={facet}
                        loading={false}
                        textSearchable
                    />
                </EuiPanel>
            </EuiAccordion>
        </div>
    );
}

export default AccordionFacet;
