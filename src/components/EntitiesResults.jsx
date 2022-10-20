import { EuiFlexGrid, EuiHorizontalRule, EuiFlexItem } from "@elastic/eui";

/**
 * List of results for the Entities search view.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @returns Populated results list React component
 */
function EntitiesResults({ data }) {
    return (
        <EuiFlexGrid columns={1}>
            {data?.hits.items.map((hit) => (
                <>
                    <EuiFlexItem
                        key={hit.id}
                        dangerouslySetInnerHTML={{
                            __html: hit?.fields?.short_display,
                        }}
                    />
                    <EuiHorizontalRule />
                </>
            ))}
        </EuiFlexGrid>
    );
}

export default EntitiesResults;
