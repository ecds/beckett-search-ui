import React from "react";
import { EuiIcon, EuiToolTip } from "@elastic/eui";
import { AiTwotoneStar } from "react-icons/ai";
import { TbChairDirector } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import "./MentionQualifier.css";

/**
 * Icon based on type.
 *
 * @param {string} type Qualifier type
 * @returns {EuiIcon} Icon.
 */
const getIcon = (type) => {
    switch (type) {
        case "directing":
            return TbChairDirector;
        case "star":
            return AiTwotoneStar;
        case "revision":
            return BiEdit;
        default:
            return undefined;
    }
};

/**
 * Tooltip content based on type.
 *
 * @param {string} type Qualifier type
 * @returns {string} Tooltip content.
 */
const getContent = (type) => {
    switch (type) {
        case "directing":
            return "Letter discusses directing of a production.";
        case "star":
            return "Discussion is highly important.";
        case "revision":
            return "Letter discusses revision of a text.";
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
        <EuiToolTip content={getContent(type)} position="top">
            <EuiIcon
                className="qualifier-icon"
                type={getIcon(type)}
                alt={getContent(type)}
            />
        </EuiToolTip>
    );
}
