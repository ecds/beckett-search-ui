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
 * Displays qualifier icon for a mention.
 *
 * @param {string} type Qualifier type
 * @returns {React.Component} Qualifier icon component.
 */
export default function MentionQualifier({ type }) {
    return (
        <EuiToolTip content={`This mention is ${type}.`} position="top">
            <EuiIcon
                className="qualifier-icon"
                type={getIcon(type)}
                alt={`This mention is ${type}`}
            />
        </EuiToolTip>
    );
}
