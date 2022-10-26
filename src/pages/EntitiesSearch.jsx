import { RefinementSelectFacet } from "@ecds/searchkit-sdk";
// eslint-disable-next-line import/no-unresolved
import { useSearchkitSDK } from "@ecds/searchkit-sdk/src/react-hooks";
import {
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

import EntitiesResults from "../components/EntitiesResults";
import { getEntitiesQuery } from "../utils/query";
import "./EntitiesSearch.css";
import ListFacet from "../components/ListFacet";
import withSearchRouting from "../components/withSearchRouting";

// icon component cache required for dynamically imported EUI icons in Vite;
// see https://github.com/elastic/eui/issues/5463
appendIconComponentCache({
    arrowLeft: EuiIconArrowLeft,
    arrowRight: EuiIconArrowRight,
    cross: EuiIconCross,
    search: EuiIconSearch,
});

const fields = [
    { name: "clean_label", boost: 10 },
    { name: "clean_description", boost: 5 },
    { name: "alternate_names", boost: 9 },
    { name: "alternate_spellings", boost: 8 },
];

const analyzers = ["searchkick_search", "searchkick_search2"];

// Config for Searchkit SDK; see https://searchkit.co/docs/core/reference/searchkit-sdk
const config = {
    host: import.meta.env.VITE_SEARCHKIT_ENDPOINT,
    connectionOptions: {
        headers: {
            authorization: `ApiKey ${import.meta.env.VITE_SEARCHKIT_API_KEY}`,
        },
    },
    index: import.meta.env.VITE_SEARCHKIT_ENTITIES_INDEX,
    hits: {
        fields: ["id", "short_display"],
    },
    query: getEntitiesQuery({ analyzers, fields }),
    facets: [
        new RefinementSelectFacet({
            field: "e_type",
            identifier: "e_type",
            label: "Entity Type",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most 100 facets (there won't be that many!)
        }),
    ],
    /**
     * Appends { published: true } filter when there is no query term.
     *
     * @param {object} body The original request body object
     * @returns The modified request body for ElasticSearch
     */
    postProcessRequest: (body) => (body?.query
        ? body
        : {
            ...body,
            query: { bool: { must: [{ term: { published: true } }] } },
        }),
};

/**
 * Entities search page.
 *
 * @returns React entities search page component
 */
function EntitiesSearch() {
    // TODO: add site navigation, style, componentize better.
    const variables = useSearchkitVariables();
    const { results, loading } = useSearchkitSDK(config, variables);
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
                            <EntitiesResults data={results} />
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

export default withSearchkit(withSearchRouting(EntitiesSearch));
