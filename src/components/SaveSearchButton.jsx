import { useState } from "react";
import { EuiButton, EuiToolTip } from "@elastic/eui";

/**
 * Button to allow user to copy current URL to clipboard
 *
 * @returns React component
 */
function SaveSearchButton() {
    const [disableSaveSearch, setDisableSaveSearch] = useState(false);

    /**
     * Disable button, copy current URL to clipboard, and re-enable button
     */
    const saveSearch = () => {
        setDisableSaveSearch(true);
        navigator.clipboard.writeText(window.location.href);
        setTimeout(() => setDisableSaveSearch(false), 1500);
    };

    /**
     * Render Save Search button
     *
     * @returns React component
     */
    const button = () => (
        <EuiButton
            color="text"
            className="save-search"
            disabled={disableSaveSearch}
            onClick={saveSearch}
        >
            {disableSaveSearch ? "Copied!" : "Save Search"}
        </EuiButton>
    );

    //  only rendering the tooltip when the button is not disabled is a
    //  workaround to prevent the tooltip from getting stuck when the button
    //  is disabled

    return disableSaveSearch ? (
        button()
    ) : (
        <EuiToolTip
            className="tooltip"
            content="Copy current search URL to clipboard"
            position="top"
        >
            {button()}
        </EuiToolTip>
    );
}

export default SaveSearchButton;
