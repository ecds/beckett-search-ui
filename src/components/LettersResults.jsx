import { Link } from "react-router-dom";
import { formatDate } from "../common";
import "./LettersResults.css";

/**
 * List of results for the Letters search view.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @param {number} props.offset Offset of results for current page
 * @returns Populated results list React component
 */
function LettersResults({ data, offset }) {
    return (
        <table id="letters-results" className="search-results">
            <thead>
                <tr>
                    <th aria-label="index">#</th>
                    <th>Recipient</th>
                    <th>Repository</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {data?.hits?.items?.map((letter, idx) => {
                    const dateString = formatDate(letter?.fields?.date);
                    return (
                        <tr key={letter.id} id={letter.id}>
                            <td>
                                <Link
                                    className="to-record"
                                    to={`/letters/${letter.id}`}
                                >
                                    <span>{idx + 1 + (offset || 0)}</span>
                                </Link>
                            </td>
                            <td>
                                <ul>
                                    {letter?.fields?.recipients?.map(
                                        (recipient) => (
                                            <li key={recipient}>{recipient}</li>
                                        ),
                                    )}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {letter?.fields?.repositories?.map(
                                        (repository) => (
                                            <li key={repository}>
                                                {repository}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </td>
                            <td>{dateString}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default LettersResults;
