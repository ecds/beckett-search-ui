import {
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
} from "@elastic/eui";
import { NavLink } from "react-router-dom";

/**
 * Site navigation functional component.
 * TODO: - Update style for site name
 *
 * @returns React component
 */
function Navigation() {
    return (
        <header>
            <EuiHeader>
                <EuiHeaderSection>
                    <EuiHeaderSectionItem border="none">
                        <EuiHeaderLinks>
                            <NavLink to="/" end>
                                <EuiHeaderLink>
                                    Samuel Beckett Letters
                                </EuiHeaderLink>
                            </NavLink>
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                    <EuiHeaderSectionItem border="none">
                        <EuiHeaderLinks>
                            <NavLink to="/about">
                                <EuiHeaderLink>About</EuiHeaderLink>
                            </NavLink>
                            <NavLink to="/letters">
                                {({ isActive }) => (
                                    <EuiHeaderLink isActive={isActive}>
                                        Search Letters
                                    </EuiHeaderLink>
                                )}
                            </NavLink>
                            <NavLink to="/entities">
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
