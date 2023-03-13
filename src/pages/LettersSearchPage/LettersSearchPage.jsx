import { useState, useEffect } from "react";
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
    EuiTitle,
    EuiHorizontalRule,
    EuiFlexGroup,
    EuiSpacer,
    EuiButton,
} from "@elastic/eui";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowDown } from "@elastic/eui/es/components/icon/assets/arrow_down";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconCalendar } from "@elastic/eui/es/components/icon/assets/calendar";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";
import { icon as EuiIconSortable } from "@elastic/eui/es/components/icon/assets/sortable";
import { icon as EuiIconSortUp } from "@elastic/eui/es/components/icon/assets/sort_up";
import { icon as EuiIconSortDown } from "@elastic/eui/es/components/icon/assets/sort_down";
import {
    lettersSearchConfig,
    analyzers,
    fields,
    scopeOptions,
} from "./lettersSearchConfig";
import LettersResults from "../../components/LettersResults";
import ListFacet from "../../components/ListFacet";
import ValueFilter from "../../components/ValueFilter";
import DateRangeFacet from "../../components/DateRangeFacet";
import "../../common/search.css";
import SaveSearchButton from "../../components/SaveSearchButton";
import { SearchControls } from "../../components/SearchControls";
import {
    routeToState,
    stateToRoute,
    useCustomSearchkitSDK,
    useScope,
} from "../../common";
import { useDateFilter } from "./useDateFilter";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    arrowDown: EuiIconArrowDown,
    calendar: EuiIconCalendar,
    cross: EuiIconCross,
    search: EuiIconSearch,
    sortable: EuiIconSortable,
    sortUp: EuiIconSortUp,
    sortDown: EuiIconSortDown,
});

/**
 * Letters search page.
 *
 * @returns React letters search page component
 */
function LettersSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(() => (searchParams.has("query") ? searchParams.get("query") : ""));
    const [operator, setOperator] = useState(searchParams.has("op") ? searchParams.get("op") : "or");
    const [dateRangeState, setDateRangeState] = useDateFilter();
    const [scope, setScope] = useScope();
    const [sortState, setSortState] = useState(() => {
        if (searchParams?.has("sort")) {
            const [field, dir] = searchParams.get("sort").split("_");
            const direction = dir === "asc" ? 1 : -1;
            return { field, direction };
        }
        // default sort: date asc
        return {
            field: "date",
            direction: 1,
        };
    });
    /**
     * Curried event listener funciton to set the sort state to a given field.
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
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const {
        results, loading, dateRange, dateRangeLoading,
    } = useCustomSearchkitSDK({
        analyzers,
        config: lettersSearchConfig,
        fields,
        operator,
    });

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
            let sortBy = sortState.field;
            if (sortState.direction) {
                const dir = sortState.direction === 1 ? "asc" : "desc";
                sortBy = `${sortState.field}_${dir}`;
            }
            if (!searchParams.has("sort") || searchParams.get("sort") !== sortBy) {
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
        if (operator && searchParams && (!searchParams.has("op") || searchParams.get("op") !== operator)) {
            setSearchParams(
                stateToRoute({
                    ...variables,
                    scope,
                    operator,
                    page: {
                        from: 0, // reset page to 0 on operator change; could exclude results!
                    },
                }),
            );
        }
    }, [operator]);

    return (
        <main className="search-page">
            <EuiPage paddingSize="l">
                <aside>
                    <EuiPageSideBar>
                        <SearchControls
                            loading={loading}
                            onSearch={(value) => {
                                setQuery(value);
                                setSearchParams(
                                    stateToRoute({
                                        ...variables,
                                        scope,
                                        operator,
                                        query: value,
                                        page: {
                                            from: 0,
                                        },
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
                        <DateRangeFacet
                            minDate={dateRange?.minDate}
                            maxDate={dateRange?.maxDate}
                            loading={dateRangeLoading || loading}
                            dateRange={dateRangeState}
                            setDateRange={setDateRangeState}
                        />
                        <EuiSpacer size="l" />
                        {results?.facets
                            .filter(
                                (facet) => facet.display
                                    && facet.display !== "CustomDateFacet",
                            )
                            .map((facet) => (
                                <div key={facet.identifier}>
                                    <ListFacet
                                        data={results}
                                        facet={facet}
                                        loading={loading}
                                    />
                                    <EuiSpacer size="l" />
                                </div>
                            ))}
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
                                    {results?.summary?.appliedFilters
                                        .filter(
                                            (f) => !f.identifier.endsWith("_date"),
                                        )
                                        .map((filter) => (
                                            <ValueFilter
                                                filter={filter}
                                                loading={loading}
                                                key={filter.id}
                                            />
                                        ))}
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
                                    // reset query and date range
                                    api.setQuery("");
                                    setDateRangeState({
                                        startDate: null,
                                        endDate: null,
                                    });
                                    setSearchParams(
                                        stateToRoute({
                                            filters: [],
                                            query: "",
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
                                <LettersResults
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

export const LettersSearchPage = withSearchkit(
    LettersSearch,
    () => new SearchkitClient({ itemsPerPage: 25 }),
);
