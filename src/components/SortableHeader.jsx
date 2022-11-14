import { EuiButtonIcon } from "@elastic/eui";
import React from "react";
import "./SortableHeader.css";

/**
 * Gets the icon for the sort state (up or down if sorted, "sortable" if not)
 *
 * @param {object} sortState Sort state object which includes the field sorted and direction of sort
 * @param {string} field The field to which the icon will be applied
 * @returns {string} The icon name for the field's sort state
 */
const getSortIcon = (sortState, field) => {
    if (sortState?.field === field) {
        return sortState.direction === 1 ? "sortUp" : "sortDown";
    }
    return "sortable";
};

/**
 * React component for sortable column headers in a table.
 *
 * @param {object} props React functional components props object
 * @param {Function} props.onSort Event handler for clicking the sort button
 * @param {object} props.sortState Current sort state object
 * @param {string} props.name The field name of this column
 * @returns {React.Component} React functional component for the sortable header
 */
export function SortableHeader({ name, onSort, sortState }) {
    return (
        <div className="sortable-header">
            <span>{name}</span>
            <EuiButtonIcon
                size="xs"
                color={
                    getSortIcon(sortState, name) === "sortable"
                        ? "text"
                        : "primary"
                }
                display="empty"
                iconType={getSortIcon(sortState, name)}
                onClick={onSort(name)}
                aria-label={`Sort by ${name}`}
            />
        </div>
    );
}
