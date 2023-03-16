import React from "react";
import { EuiTitle } from "@elastic/eui";
import AccordionFacet from "./AccordionFacet";
import { conditionalFacets } from "../common/conditionalFacets";

/**
 * Component to conditionally render entity type filter facets
 *
 * @param {object} props React functional component props object
 * @param {Array<object>} props.facets An array of facets to be conditionally rendered
 * @param {string} props.subtype String label for current selected entity type filter
 * @returns {React.Component} React component for conditionally rendered entity type facets
 */
function EntitySubtypeFacets({ facets, subtype }) {
    const list = facets.filter(
        (facet) =>
            facet.entries?.length &&
            conditionalFacets[subtype].includes(facet.identifier),
    );

    return (
        <div>
            <EuiTitle
                className="capital-label"
                size="xxs"
                style={{ marginBottom: "0.25rem" }}
            >
                <h3>{subtype} Filters</h3>
            </EuiTitle>
            {list.map((facet) => (
                <AccordionFacet
                    facet={facet}
                    key={`accordion-facet-${facet.identifier}`}
                    label={facet.label}
                />
            ))}
        </div>
    );
}

export default EntitySubtypeFacets;
