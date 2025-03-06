import { useSearchkit } from "@searchkit/client";
import { EuiPagination } from "@elastic/eui";

/**
 * Returns pagination for results.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @returns React pagination for results
 */
export function Pagination({ data }) {
    const api = useSearchkit();

    return (
        <EuiPagination
            aria-label="Pagination"
            pageCount={data?.hits.page.totalPages}
            activePage={data?.hits.page.pageNumber}
            onPageClick={(activePage) => {
                api.setPage({
                    size: data.hits.page.size,
                    from: activePage * data.hits.page.size,
                });
                api.search();
            }}
        />
    );
}
