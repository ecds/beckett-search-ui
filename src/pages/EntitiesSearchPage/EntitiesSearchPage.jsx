import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    SearchkitClient,
    useSearchkit,
    useSearchkitVariables,
    withSearchkit,
} from "@searchkit/client";
import { Pagination } from "@ecds/searchkit-elastic-ui";
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
    EuiSpacer,
    EuiTitle,
    EuiHorizontalRule,
    EuiFlexGroup,
    EuiButton,
} from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.css";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";
import { icon as EuiIconQuestion } from "@elastic/eui/es/components/icon/assets/question_in_circle";
import { icon as EuiIconSortable } from "@elastic/eui/es/components/icon/assets/sortable";
import { icon as EuiIconSortUp } from "@elastic/eui/es/components/icon/assets/sort_up";
import { icon as EuiIconSortDown } from "@elastic/eui/es/components/icon/assets/sort_down";
import {
    analyzers,
    entitiesSearchConfig,
    fields,
    scopeOptions,
} from "./entitiesSearchConfig";
import EntitiesResults from "../../components/EntitiesResults";
import EntitySubtypeFacets from "../../components/EntitySubtypeFacets";
import ListFacet from "../../components/ListFacet";
import SaveSearchButton from "../../components/SaveSearchButton";
import { SearchControls } from "../../components/SearchControls";
import YearRangeFacet from "../../components/YearRangeFacet";
import {
    conditionalFacets,
    getSortByFromState,
    routeToState,
    stateToRoute,
    useCustomSearchkitSDK,
    useScope,
} from "../../common";
import ValueFilter from "../../components/ValueFilter";
import { useYearFilter } from "./useYearFilter";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    cross: EuiIconCross,
    questionInCircle: EuiIconQuestion,
    search: EuiIconSearch,
    sortable: EuiIconSortable,
    sortUp: EuiIconSortUp,
    sortDown: EuiIconSortDown,
});

/**
 * Entities search page.
 *
 * @returns React entities search page component
 */
function EntitiesSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(() =>
        searchParams.has("query") ? searchParams.get("query") : "",
    );
    const [operator, setOperator] = useState(
        searchParams.has("op") ? searchParams.get("op") : "or",
    );
    const [yearRangeState, setYearRangeState] = useYearFilter();
    const [scope, setScope] = useScope();
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const { results, loading, yearRange } = useCustomSearchkitSDK({
        analyzers,
        config: entitiesSearchConfig,
        fields,
    });
    const [sortState, setSortState] = useState(() => {
        if (searchParams?.has("sort")) {
            const [field, dir] = searchParams.get("sort").split("_");
            const direction = dir === "asc" ? 1 : -1;
            return { field, direction };
        }
        // default sort: short_display asc
        return {
            field: "entity",
            direction: 1,
        };
    });
    /**
     * Curried event listener function to set the sort state to a given field.
     *
     * @param {string} field The name of the field to sort on.
     * @returns {Function} The event listner function.
     */
    const onSort = (field) => () => {
        if (sortState.field === field) {
            setSortState((prevState) => ({
                field,
                direction: -1 * prevState.direction,
            }));
        } else {
            setSortState({ field, direction: 1 });
        }
    };

    // Use React Router useSearchParams to translate to and from URL query params
    useEffect(() => {
        if (api && searchParams) {
            api.setSearchState(routeToState(searchParams));
            api.search();
        }
    }, [searchParams]);
    useEffect(() => {
        // handle sorting separately in order to only update in case of changes
        if (sortState) {
            const sortBy = getSortByFromState(sortState);
            if (
                !searchParams.has("sort") ||
                searchParams.get("sort") !== sortBy
            ) {
                setSearchParams(
                    stateToRoute({
                        ...variables,
                        query,
                        sortBy,
                        scope,
                        operator,
                    }),
                );
            }
        }
    }, [sortState]);
    useEffect(() => {
        if (
            operator &&
            searchParams &&
            (!searchParams.has("op") || searchParams.get("op") !== operator)
        ) {
            setSearchParams(
                stateToRoute({
                    ...variables,
                    query,
                    sortBy: getSortByFromState(sortState),
                    scope,
                    operator,
                    page: {
                        from: 0, // reset page to 0 on operator change; could exclude results!
                    },
                }),
            );
        }
    }, [operator]);
    useEffect(() => {
        if (variables?.page?.from) {
            setSearchParams(
                stateToRoute({
                    ...variables,
                    query,
                    sortBy: getSortByFromState(sortState),
                    scope,
                    operator,
                    page: {
                        from: variables.page.from,
                    },
                }),
            );
        }
    }, [variables?.page?.from]);

    return (
        <main className="search-page">
            <EuiPage paddingSize="l">
                <aside>
                    <EuiPageSideBar>
                        <SearchControls
                            loading={loading}
                            onSearch={(value) => {
                                setQuery(value);
                                if (value === "") {
                                    setSortState({
                                        field: "entity",
                                        direction: 1,
                                    });
                                } else {
                                    setSortState({ field: "relevance" });
                                }
                                setSearchParams(
                                    stateToRoute({
                                        ...variables,
                                        scope,
                                        operator,
                                        query: value,
                                        page: {
                                            from: 0,
                                        },
                                        sortBy: value === "" ? "" : "relevance",
                                    }),
                                );
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

                        <EuiSpacer size="s" />

                        {results && searchParams.get("e_type") ? (
                            <EntitySubtypeFacets
                                facets={results.facets}
                                subtype={searchParams.get("e_type")}
                            />
                        ) : (
                            results?.facets
                                .filter(
                                    (facet) => facet.identifier === "e_type",
                                )
                                .map((facet) => (
                                    <ListFacet
                                        key={facet.identifier}
                                        facet={facet}
                                        loading={loading}
                                    />
                                ))
                        )}

                        {searchParams.get("e_type") &&
                            conditionalFacets[
                                searchParams.get("e_type")
                            ].includes("years") && (
                                <YearRangeFacet
                                    accordion
                                    minYear={yearRange?.minYear}
                                    maxYear={yearRange?.maxYear}
                                    setYearRange={setYearRangeState}
                                    yearRange={yearRangeState}
                                />
                            )}
                    </EuiPageSideBar>
                </aside>
                <EuiPageBody component="section">
                    <EuiPageHeader>
                        <EuiPageHeaderSection className="active-facet-group">
                            <EuiTitle size="l">
                                <EuiFlexGroup
                                    gutterSize="s"
                                    alignItems="center"
                                >
                                    {results?.summary?.appliedFilters.map(
                                        (filter) => (
                                            <ValueFilter
                                                key={filter.id}
                                                filter={filter}
                                                loading={loading}
                                            />
                                        ),
                                    )}
                                </EuiFlexGroup>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                        <EuiPageHeaderSection>
                            <EuiButton
                                fill
                                color="text"
                                className="reset-search"
                                disabled={!api.canResetSearch()}
                                isLoading={loading}
                                onClick={() => {
                                    // reset query and filters

                                    api.setQuery("");
                                    setYearRangeState({
                                        endYear: "",
                                        startYear: "",
                                    });
                                    setSearchParams(
                                        stateToRoute({
                                            filters: [],
                                            query: "",
                                            sort: {
                                                field: "entity",
                                                direction: 1,
                                            },
                                        }),
                                    );
                                }}
                            >
                                Reset Search
                            </EuiButton>
                            <SaveSearchButton />
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageContent>
                        <EuiPageContentHeader>
                            <EuiPageContentHeaderSection>
                                <EuiTitle size="s">
                                    <h2>{results?.summary.total} Results</h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        {results?.summary?.total > 0 ? (
                            <EuiPageContentBody>
                                <EntitiesResults
                                    data={results}
                                    offset={variables?.page?.from}
                                    onSort={onSort}
                                    sortState={sortState}
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
