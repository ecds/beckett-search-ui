import { Link } from "react-router-dom";
import { SortableHeader } from "./SortableHeader";
import "./EntitiesResults.css";

/**
 * List of results for the Entities search view.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @param {number} props.offset Offset of results for current page
 * @param {Function} props.onSort Sort handler
 * @param {object} props.sortState Current sort state
 * @returns Populated results list React component
 */
function EntitiesResults({
    data, offset, onSort, sortState,
}) {
    const sortableColumns = ["entity", "type"];
    return (
        <table id="entities-results" className="search-results">
            <thead>
                <tr>
                    <th aria-label="index">#</th>
                    {sortableColumns.map((column) => (
                        <th key={column}>
                            <SortableHeader
                                name={column}
                                onSort={onSort}
                                sortState={sortState}
                            />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.hits?.items?.map((entity, idx) => (
                    <tr key={entity.id} id={entity.id}>
                        <td>
                            <Link
                                className="to-record"
                                to={`/entities/${entity.id}`}
                            >
                                <span>{idx + 1 + (offset || 0)}</span>
                            </Link>
                        </td>
                        <td
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                                __html: entity?.fields?.short_display,
                            }}
                        />
                        <td className="capital-label">
                            {entity?.fields?.e_type
                                .toString()
                                .replaceAll("_", " ")}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EntitiesResults;
