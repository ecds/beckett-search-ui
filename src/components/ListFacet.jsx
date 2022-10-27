import { Fragment, useRef, useEffect } from "react";
import { EuiFacetButton, EuiFacetGroup, EuiTitle } from "@elastic/eui";
import { useSearchkit, FilterLink } from "@searchkit/client";
import "./ListFacet.css";

/**
 * ListFacet override component allowing custom display of facet filters.
 * Adapted almost verbatim from
 * https://github.com/searchkit/searchkit/issues/1107#issuecomment-1185484220
 *
 * @param {object} props React functional component props object
 * @param {object} props.facet The facet to render as a list of options
 * @param {boolean} props.loading Boolean indicating whether or not results are loading
 * @returns {Fragment|null} ListFacet component set
 */
function ListFacet({ facet, loading }) {
    const api = useSearchkit();
    const ref = useRef([]);

    useEffect(() => {
        ref.current = ref.current.slice(0, facet?.entries.length);
    }, [facet?.entries]);

    const entries = facet?.entries?.map((entry, i) => (
        <EuiFacetButton
            className="facet-button"
            key={entry.label}
            quantity={entry.count}
            isSelected={api.isFilterSelected({
                identifier: facet.identifier,
                value: entry.label,
            })}
            isLoading={loading}
            onClick={(e) => {
                ref.current[i].onClick(e);
            }}
        >
            <FilterLink
                ref={(el) => {
                    ref.current[i] = el;
                }}
                filter={{ identifier: facet.identifier, value: entry.label }}
            >
                {entry.label.toString().trim().replaceAll("_", " ") || "[blank]"}
            </FilterLink>
        </EuiFacetButton>
    ));

    if (!facet) {
        return null;
    }

    return (
        <div className="list-facet">
            <EuiTitle size="xxs">
                <h3>{facet.label}</h3>
            </EuiTitle>
            <EuiFacetGroup className="facet-group">{entries}</EuiFacetGroup>
        </div>
    );
}

export default ListFacet;
