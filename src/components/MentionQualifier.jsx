import React from "react";
import { EuiIcon } from "@elastic/eui";
import { icon as EuiIconStarEmptyIcon } from "@elastic/eui/es/components/icon/assets/star_empty";
import { icon as EuiIconDocumentEditIcon } from "@elastic/eui/es/components/icon/assets/documentEdit";
import directingIcon from "./directing.svg";

/**
 * Icon based on type.
 *
 * @param {string} type Qualifier type
 * @returns {EuiIcon} Icon.
 */
const getIcon = (type) => {
    switch (type) {
        case "directing":
            return directingIcon;
        case "star":
            return EuiIconStarEmptyIcon;
        case "revising":
            return EuiIconDocumentEditIcon;
        default:
            return undefined;
    }
};

/**
 * Displays qualifier icon for a mention.
 *
 * @param {string} type Qualifier type
 * @returns {React.Component} Qualifier icon component.
 */
export default function MentionQualifier({ type }) {
    return (
        <EuiIcon type={getIcon(type)} title={`This mention is ${type}`} />
    );
}
