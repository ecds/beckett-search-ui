import {
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
} from "@elastic/eui";

/**
 * Site navigation functional component.
 * TODO: - Use href on EuiHeaderLink to point to actual routes
 *       - Use isActive conditionally
 *       - Update style for site name
 *
 * @returns React component
 */
function Navigation() {
    return (
        <EuiHeader>
            <EuiHeaderSection>
                <EuiHeaderSectionItem border="none">
                    <EuiHeaderLinks>
                        <EuiHeaderLink>Samuel Beckett Letters</EuiHeaderLink>
                    </EuiHeaderLinks>
                </EuiHeaderSectionItem>
                <EuiHeaderSectionItem border="none">
                    <EuiHeaderLinks>
                        <EuiHeaderLink>About</EuiHeaderLink>
                        <EuiHeaderLink>Search Letters</EuiHeaderLink>
                        <EuiHeaderLink isActive>Search Entities</EuiHeaderLink>
                    </EuiHeaderLinks>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
}

export default Navigation;
