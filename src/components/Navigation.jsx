import {
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
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
    return (
        <header>
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
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                </EuiHeaderSection>
            </EuiHeader>
        </header>
    );
}

export default Navigation;
