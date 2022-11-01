// eslint-disable-next-line import/no-unresolved
import { useSearchkitSDK } from "@ecds/searchkit-sdk/src/react-hooks";
import { useSearchkitVariables, withSearchkit } from "@searchkit/client";
import {
    SearchBar,
    ResetSearchButton,
    SelectedFilters,
    Pagination,
} from "@searchkit/elastic-ui";
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiPageSideBar,
    EuiTitle,
    EuiHorizontalRule,
    EuiFlexGroup,
} from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.css";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";

import { entitiesSearchConfig } from "./entitiesSearchConfig";
import EntitiesResults from "../../components/EntitiesResults";
import ListFacet from "../../components/ListFacet";
import withSearchRouting from "../../components/withSearchRouting";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    cross: EuiIconCross,
    search: EuiIconSearch,
});

/**
 * Entities search page.
 *
 * @returns React entities search page component
 */
function EntitiesSearch() {
    const variables = useSearchkitVariables();
    const { results, loading } = useSearchkitSDK(
        entitiesSearchConfig,
        variables,
    );
    return (
        <main>
            <EuiPage paddingSize="l">
                <aside>
                    <EuiPageSideBar>
                        <SearchBar loading={loading} />
                        <EuiHorizontalRule margin="m" />
                        {results?.facets.map((facet) => (
                            <ListFacet
                                key={facet.identifier}
                                facet={facet}
                                loading={loading}
                            />
                        ))}
                    </EuiPageSideBar>
                </aside>
                <EuiPageBody component="section">
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                            <EuiTitle size="l">
                                <SelectedFilters
                                    data={results}
                                    loading={loading}
                                />
                            </EuiTitle>
                        </EuiPageHeaderSection>
                        <EuiPageHeaderSection>
                            <ResetSearchButton loading={loading} />
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageContent>
                        <EuiPageContentHeader>
                            <EuiPageContentHeaderSection>
                                <EuiTitle size="s">
                                    <h2>
                                        {results?.summary.total}
                                        {" "}
                                        Results
                                    </h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiPageContentBody>
                            <EntitiesResults
                                data={results}
                                offset={variables?.page?.from}
                            />
                            <EuiFlexGroup justifyContent="spaceAround">
                                <Pagination data={results} />
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}

export const EntitiesSearchPage = withSearchkit(
    withSearchRouting(EntitiesSearch),
);
