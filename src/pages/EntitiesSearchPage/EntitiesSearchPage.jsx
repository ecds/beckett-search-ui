import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    SearchkitClient,
    useSearchkit,
    useSearchkitQueryValue,
    useSearchkitVariables,
    withSearchkit,
} from "@searchkit/client";
import {
    ResetSearchButton,
    SelectedFilters,
    Pagination,
} from "@ecds/searchkit-elastic-ui";
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
import { icon as EuiIconQuestion } from "@elastic/eui/es/components/icon/assets/question_in_circle";
import {
    analyzers,
    entitiesSearchConfig,
    fields,
    scopeOptions,
} from "./entitiesSearchConfig";
import EntitiesResults from "../../components/EntitiesResults";
import ListFacet from "../../components/ListFacet";
import { SearchControls } from "../../components/SearchControls";
import { routeToState, stateToRoute, useCustomSearchkitSDK } from "../../common";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    cross: EuiIconCross,
    search: EuiIconSearch,
    questionInCircle: EuiIconQuestion,
});

/**
 * Entities search page.
 *
 * @returns React entities search page component
 */
function EntitiesSearch() {
    const [query, setQuery] = useSearchkitQueryValue();
    const [operator, setOperator] = useState("or");
    const [scope, setScope] = useState("keyword");
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const { results, loading } = useCustomSearchkitSDK({
        analyzers,
        config: entitiesSearchConfig,
        fields,
        operator,
        variables,
        scope,
    });

    // Use React Router useSearchParams to translate to and from URL query params
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (api && searchParams) {
            api.setSearchState(routeToState(searchParams));
            if (searchParams.has("scope")) {
                setScope(searchParams.get("scope"));
            }
            api.search();
        }
    }, []);
    useEffect(() => {
        if (variables) {
            setSearchParams(stateToRoute({
                ...variables,
                scope,
            }));
        }
    }, [variables]);
    return (
        <main className="search-page">
            <EuiPage paddingSize="l">
                <aside>
                    <EuiPageSideBar>
                        <SearchControls
                            loading={loading}
                            onSearch={(value) => {
                                setQuery(value);
                                api.setQuery(value);
                                api.search();
                            }}
                            operator={operator}
                            setOperator={setOperator}
                            setQuery={setQuery}
                            query={query}
                            scopeOptions={scopeOptions}
                            scope={scope}
                            setScope={setScope}
                        />
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
                        <EuiPageHeaderSection className="active-facet-group">
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
                        {results?.summary?.total > 0 ? (
                            <EuiPageContentBody>
                                <EntitiesResults
                                    data={results}
                                    offset={variables?.page?.from}
                                />
                                <EuiFlexGroup justifyContent="spaceAround">
                                    <Pagination data={results} />
                                </EuiFlexGroup>
                            </EuiPageContentBody>
                        ) : (
                            <EuiPageContentBody>
                                {loading
                                    ? "Loading..."
                                    : "Your search did not return any results."}
                            </EuiPageContentBody>
                        )}
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}

export const EntitiesSearchPage = withSearchkit(
    EntitiesSearch,
    () => new SearchkitClient({ itemsPerPage: 25 }),
);
