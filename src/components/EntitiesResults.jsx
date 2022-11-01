import { Link } from "react-router-dom";
import "./EntitiesResults.css";

/**
 * List of results for the Entities search view.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @param {number} props.offset Offset of results for current page
 * @returns Populated results list React component
 */
function EntitiesResults({ data, offset }) {
    return (
        <table id="entities-results" className="search-results">
            <thead>
                <tr>
                    <th aria-label="index">#</th>
                    <th>Entity</th>
                    <th>Type</th>
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
