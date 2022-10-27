// eslint-disable-next-line import/no-unresolved
import { useSearchkitSDK } from "@ecds/searchkit-sdk/src/react-hooks";
import {
    SearchkitClient,
    useSearchkitVariables,
    withSearchkit,
} from "@searchkit/client";
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

import { lettersSearchConfig } from "./lettersSearchConfig";
import LettersResults from "../../components/LettersResults";
import ListFacet from "../../components/ListFacet";
import withSearchRouting from "../../components/withSearchRouting";
import "../common/search.css";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    cross: EuiIconCross,
    search: EuiIconSearch,
});

/**
 * Letters search page.
 *
 * @returns React letters search page component
 */
function LettersSearch() {
    const variables = useSearchkitVariables();
    const { results, loading } = useSearchkitSDK(
        lettersSearchConfig,
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
                            <LettersResults
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

export const LettersSearchPage = withSearchkit(
    withSearchRouting(LettersSearch),
    () => new SearchkitClient({ itemsPerPage: 25 }),
);
