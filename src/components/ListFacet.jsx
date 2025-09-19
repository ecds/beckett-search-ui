import { Fragment, useState } from "react";
import {
    EuiFacetButton,
    EuiFacetGroup,
    EuiFieldText,
    EuiSpacer,
    EuiTitle,
    EuiToolTip,
} from "@elastic/eui";
import { useSearchkit, useSearchkitVariables } from "@searchkit/client";
import { useSearchParams } from "react-router-dom";
import ASCIIFolder from "fold-to-ascii";
import { entityTypes, stateToRoute, volumeLabels } from "../common";
import "./ListFacet.css";

/**
 * ListFacet override component allowing custom display of facet filters.
 * Adapted from
 * https://github.com/searchkit/searchkit/issues/1107#issuecomment-1185484220
 *
 * @param {object} props React functional component props object
 * @param {boolean} props.displayTitle Indicate if title should be displayed
 * @param {object} props.facet The facet to render as a list of options
 * @param {boolean} props.loading Boolean indicating whether or not results are loading
 * @param {boolean} props.textSearchable Indicate if text search box should be displayed
 * @returns {Fragment|null} ListFacet component set
 */
function ListFacet({ displayTitle, facet, loading, textSearchable }) {
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const [_, setSearchParams] = useSearchParams();
    const [textFilter, setTextFilter] = useState("");
    const entries = facet?.entries
        // filter using any entered text
        ?.filter(
            (entry) =>
                !textFilter ||
                // fold Unicode to ASCII for quick searching
                ASCIIFolder.foldMaintaining(
                    entry.label.toString().toLowerCase(),
                ).includes(
                    ASCIIFolder.foldMaintaining(textFilter.toLowerCase()),
                ),
        )
        .map((entry) => {
            let label = entry.label.toString().trim().replaceAll("_", " ");
            // special handling for volume labels
            if (
                label &&
                facet.identifier === "volume" &&
                Object.keys(volumeLabels).includes(label)
            ) {
                label = volumeLabels[label];
            }
            // add tooltip for entity type facets
            const ToolTipComponent =
                facet.identifier === "e_type"
                    ? ({ children }) => (
                          <EuiToolTip
                              className="tooltip"
                              content={entityTypes[entry.label] || entry.label}
                          >
                              {children}
                          </EuiToolTip>
                      ) // eslint-disable-next-line react/jsx-no-useless-fragment
                    : ({ children }) => <>{children}</>;
            const filter = {
                identifier: facet.identifier,
                value: entry.label,
            };
            const isSelected = api.isFilterSelected(filter);

            return (
                label && (
                    <EuiFacetButton
                        className="facet-button"
                        key={entry.label}
                        quantity={entry.count}
                        isSelected={isSelected}
                        isLoading={loading}
                        onClick={() => {
                            let { filters } = variables;
                            if (isSelected) {
                                // remove on cilck
                                filters = filters.filter(
                                    (f) =>
                                        !(
                                            f.identifier === facet.identifier &&
                                            f.value === entry.label
                                        ),
                                );
                            } else {
                                // add on click
                                filters.push(filter);
                            }
                            setSearchParams(
                                stateToRoute({
                                    ...variables,
                                    filters,
                                    page: {
                                        from: 0,
                                    },
                                }),
                            );
                        }}
                    >
                        <ToolTipComponent>
                            <span className="capital-label">{label}</span>
                        </ToolTipComponent>
                    </EuiFacetButton>
                )
            );
        });

    if (!facet) {
        return null;
    }

    return (
        <div className={`list-facet pp ${textSearchable ? "searchable-facet" : ""}`}>
            {displayTitle && (
                <EuiTitle size="xxs">
                    <h3>{facet.label}</h3>
                </EuiTitle>
            )}
            {textSearchable && (
                <>
                    <EuiFieldText
                        compressed
                        placeholder="Type here to filter options"
                        value={textFilter}
                        onChange={(e) => setTextFilter(e.target.value)}
                    />
                    <EuiSpacer size="xs" />
                </>
            )}
            <EuiFacetGroup className="facet-group">{entries}</EuiFacetGroup>
        </div>
    );
}

// Disambiguate from Searchkit builtin ListFacet
ListFacet.DISPLAY = "CustomListFacet";
ListFacet.defaultProps = {
    displayTitle: true,
};
export default ListFacet;
