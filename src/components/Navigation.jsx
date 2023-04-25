import { useState } from "react";
import {
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
    EuiPopover,
    EuiButtonEmpty,
    EuiListGroup,
    EuiListGroupItem,
} from "@elastic/eui";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowEnd } from "@elastic/eui/es/components/icon/assets/arrowEnd";
import { icon as EuiIconArrowStart } from "@elastic/eui/es/components/icon/assets/arrowStart";
import { icon as EuiIconApps } from "@elastic/eui/es/components/icon/assets/apps";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowEnd: EuiIconArrowEnd,
    arrowStart: EuiIconArrowStart,
    apps: EuiIconApps,
});

/**
 * Site navigation functional component.
 *
 * @returns React component
 */
function Navigation() {
    const [popoverOpen, setPopoverOpen] = useState(false);

    /**
     * Toggle the popover for the about pages.
     */
    const togglePopover = () => {
        setPopoverOpen(!popoverOpen);
    };

    return (
        <header className="main-nav-header">
            <EuiHeader>
                <EuiHeaderSection>
                    <EuiHeaderSectionItem border="none">
                        <EuiHeaderLinks popoverBreakpoints="none">
                            <NavLink to="/" tabIndex="-1" end>
                                <EuiHeaderLink className="home">
                                    Samuel Beckett Letters
                                </EuiHeaderLink>
                            </NavLink>
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                    <EuiHeaderSectionItem border="none">
                        <EuiHeaderLinks>
                            <NavLink to="/letters" tabIndex="-1">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        Search Letters
                                    </EuiHeaderLink>
                                )}
                            </NavLink>
                            <NavLink to="/entities" tabIndex="-1">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        Search Entities
                                    </EuiHeaderLink>
                                )}
                            </NavLink>
                            <EuiPopover
                                button={
                                    <EuiButtonEmpty
                                        onClick={togglePopover}
                                        color="text"
                                        iconType="arrowDown"
                                        iconSide="right"
                                    >
                                        About
                                    </EuiButtonEmpty>
                                }
                                isOpen={popoverOpen}
                                closePopover={togglePopover}
                                anchorPosition="downLeft"
                                panelPaddingSize="none"
                            >
                                <EuiListGroup>
                                    <EuiListGroupItem
                                        label={
                                            <NavLink to="/about" tabIndex="-1">
                                                {({ isActive }) => (
                                                    <EuiHeaderLink
                                                        isActive={isActive}
                                                    >
                                                        About
                                                    </EuiHeaderLink>
                                                )}
                                            </NavLink>
                                        }
                                    />
                                    <EuiListGroupItem
                                        label={
                                            <NavLink
                                                to="/about/project-history"
                                                tabIndex="-1"
                                            >
                                                {({ isActive }) => (
                                                    <EuiHeaderLink
                                                        isActive={isActive}
                                                    >
                                                        Project History
                                                    </EuiHeaderLink>
                                                )}
                                            </NavLink>
                                        }
                                    />
                                    <EuiListGroupItem
                                        label={
                                            <NavLink
                                                to="/about/letters"
                                                tabIndex="-1"
                                            >
                                                {({ isActive }) => (
                                                    <EuiHeaderLink
                                                        isActive={isActive}
                                                    >
                                                        Letters
                                                    </EuiHeaderLink>
                                                )}
                                            </NavLink>
                                        }
                                    />
                                    <EuiListGroupItem
                                        label={
                                            <NavLink
                                                to="/about/entities"
                                                tabIndex="-1"
                                            >
                                                {({ isActive }) => (
                                                    <EuiHeaderLink
                                                        isActive={isActive}
                                                    >
                                                        Entities
                                                    </EuiHeaderLink>
                                                )}
                                            </NavLink>
                                        }
                                    />
                                    <EuiListGroupItem
                                        label={
                                            <NavLink
                                                to="/about/abbreviations"
                                                tabIndex="-1"
                                            >
                                                {({ isActive }) => (
                                                    <EuiHeaderLink
                                                        isActive={isActive}
                                                    >
                                                        Abbreviations
                                                    </EuiHeaderLink>
                                                )}
                                            </NavLink>
                                        }
                                    />
                                </EuiListGroup>
                            </EuiPopover>

                            <NavLink to="/faq" tabIndex="-1">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        FAQ
                                    </EuiHeaderLink>
                                )}
                            </NavLink>

                            <NavLink to="/timeline" tabIndex="-1">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        Timeline
                                    </EuiHeaderLink>
                                )}
                            </NavLink>
                            <NavLink to="/film-interviews" tabIndex="-1">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        Film Interviews
                                    </EuiHeaderLink>
                                )}
                            </NavLink>
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                </EuiHeaderSection>
            </EuiHeader>
        </header>
    );
}

export default Navigation;
