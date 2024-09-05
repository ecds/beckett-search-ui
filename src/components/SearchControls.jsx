import React from "react";
import {
    EuiButton,
    EuiButtonGroup,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIconTip,
    EuiSelect,
    EuiSpacer,
} from "@elastic/eui";
import "./SearchControls.css";

/**
 * Component for the search bar, the and/or operator picker, and the search submit button.
 *
 * @param {object} props React functional component props object
 * @param {boolean} props.loading Boolean for loading indicators
 * @param {Function} props.onSearch Event handler function for submitting search
 * @param {string} props.operator Currently selected operator
 * @param {Function} props.setOperator Event handler function for changing the operator
 * @param {Function} props.setQuery Event handler function for typing in the search bar
 * @param {string} props.query Current query
 * @param {string} props.scope Current search scope state (keyword, recipient, repository)
 * @param {Array<object>} props.scopeOptions List of label/value pairs for search scope options
 * @param {Function} props.setScope Function to set the search scope state
 * @returns {React.Component} React functional component for search controls
 */
export function SearchControls({
    loading,
    onSearch,
    operator,
    scope,
    scopeOptions,
    setOperator,
    setQuery,
    setScope,
    query,
}) {
    return (
        <>
            <EuiFieldSearch
                fullWidth
                placeholder="Search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                isLoading={loading}
                onSearch={onSearch}
                isClearable
                aria-label="Search"
                prepend={
                    scopeOptions && (
                        <EuiSelect
                            className="type-select"
                            options={scopeOptions}
                            onChange={(e) => setScope(e.target.value)}
                            value={scope}
                        />
                    )
                }
            />
            <EuiSpacer size="m" />
            <EuiFlexGroup
                justifyContent="spaceBetween"
                className="controls-group"
            >
                <EuiFlexItem>
                    <div className="operator-group">
                        <EuiButtonGroup
                            isDisabled={loading}
                            legend="Choose a search operator"
                            idSelected={operator}
                            onChange={(optionId) => setOperator(optionId)}
                            options={[
                                {
                                    id: "or",
                                    label: "Any",
                                },
                                {
                                    id: "and",
                                    label: "All",
                                },
                            ]}
                        />
                        <EuiIconTip
                            className="operator-tooltip"
                            position="bottom"
                            type="questionInCircle"
                            content="Choose Any to match any entered keyword, or All to match all keywords."
                            iconProps={{
                                className: "operator-icon",
                            }}
                            size="l"
                        />
                    </div>
                </EuiFlexItem>
                <EuiFlexItem>
                    <div className="search-button-container">
                        <EuiButton
                            iconType="search"
                            iconSide="right"
                            isLoading={loading}
                            size="s"
                            fill
                            onClick={() => onSearch(query)}
                            type="submit"
                            className="primary-button"
                        >
                            Search
                        </EuiButton>
                    </div>
                </EuiFlexItem>
            </EuiFlexGroup>
        </>
    );
}
