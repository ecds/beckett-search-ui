import { useState } from "react";
import {
    SearchkitClient,
    useSearchkit,
    useSearchkitQueryValue,
    useSearchkitVariables,
    withSearchkit,
} from "@searchkit/client";
import { Pagination, ResetSearchButton } from "@ecds/searchkit-elastic-ui";
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
} from "@elastic/eui";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconCalendar } from "@elastic/eui/es/components/icon/assets/calendar";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";
import { lettersSearchConfig, analyzers, fields } from "./lettersSearchConfig";
import LettersResults from "../../components/LettersResults";
import ListFacet from "../../components/ListFacet";
import ValueFilter from "../../components/ValueFilter";
import DateRangeFacet from "../../components/DateRangeFacet";
import withSearchRouting from "../../components/withSearchRouting";
import "../../common/search.css";
import { SearchControls } from "../../components/SearchControls";
import { useCustomSearchkitSDK } from "../../common";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    calendar: EuiIconCalendar,
    cross: EuiIconCross,
    search: EuiIconSearch,
});

/**
 * Letters search page.
 *
 * @returns React letters search page component
 */
function LettersSearch() {
    const [query, setQuery] = useSearchkitQueryValue();
    const [operator, setOperator] = useState("or");
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const { results, loading } = useCustomSearchkitSDK({
        analyzers,
        config: lettersSearchConfig,
        fields,
        operator,
        variables,
    });
    return (
        <main>
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
                        />
                        <EuiHorizontalRule margin="m" />
                        <DateRangeFacet data={results} loading={loading} />
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
