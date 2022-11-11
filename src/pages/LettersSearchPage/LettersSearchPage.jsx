// eslint-disable-next-line import/no-unresolved
import { useSearchkitSDK } from "@ecds/searchkit-sdk/src/react-hooks";
import {
    SearchkitClient,
    useSearchkitVariables,
    withSearchkit,
} from "@searchkit/client";
import {
    Pagination,
    ResetSearchButton,
    SearchBar,
    SelectedFilters,
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
    EuiSpacer,
} from "@elastic/eui";
import { appendIconComponentCache } from "@elastic/eui/es/components/icon/icon";
import { icon as EuiIconArrowLeft } from "@elastic/eui/es/components/icon/assets/arrow_left";
import { icon as EuiIconArrowRight } from "@elastic/eui/es/components/icon/assets/arrow_right";
import { icon as EuiIconCross } from "@elastic/eui/es/components/icon/assets/cross";
import { icon as EuiIconCalendar } from "@elastic/eui/es/components/icon/assets/calendar";
import { icon as EuiIconSearch } from "@elastic/eui/es/components/icon/assets/search";

import { lettersSearchConfig } from "./lettersSearchConfig";
import LettersResults from "../../components/LettersResults";
import ListFacet from "../../components/ListFacet";
import ValueFilter from "../../components/ValueFilter";
import DateRangeFacet from "../../components/DateRangeFacet";
import DateRangeFilter from "../../components/DateRangeFilter";
import withSearchRouting from "../../components/withSearchRouting";
import "../../common/search.css";

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
                        {results?.facets.filter((facet) => facet.display).map((facet) => {
                            const Component = facet.display === "CustomDateFacet"
                                ? DateRangeFacet
                                : ListFacet;
                            return (
                                <div key={facet.identifier}>
                                    <Component
                                        data={results}
                                        facet={facet}
                                        loading={loading}
                                    />
                                    <EuiSpacer size="l" />
                                </div>
                            );
                        })}
                    </EuiPageSideBar>
                </aside>
                <EuiPageBody component="section">
                    <EuiPageHeader>
                        <EuiPageHeaderSection className="active-facet-group">
                            <EuiTitle size="l">
                                <SelectedFilters
                                    data={results}
                                    loading={loading}
                                    customFilterComponents={{
                                        CustomDateFacet: DateRangeFilter,
                                        CustomListFacet: ValueFilter,
                                    }}
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
