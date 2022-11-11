import { EuiButton, EuiFlexItem } from "@elastic/eui";
import { useSearchkit } from "@searchkit/client";
import { formatDate } from "../common";

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * adapted from @searchkit/elastic-ui
 * https://github.com/searchkit/searchkit/blob/a67420cb1e16d2a459f473c904cde10b3cfd5858/packages/searchkit-elastic-ui/src/SelectedFilters/index.tsx#L25-L44
 */
function DateRangeFilter({ filter, loading }) {
    const api = useSearchkit();
    const rangeString = `${filter.label}: ${formatDate(
        filter.dateMin,
    )} – ${formatDate(filter.dateMax)}`;

    return (
        <EuiFlexItem grow={false}>
            <EuiButton
                onClick={() => {
                    api.removeFilter(filter);
                    api.search();
                }}
                iconSide="right"
                iconType="cross"
                isLoading={loading}
            >
                {rangeString}
            </EuiButton>
        </EuiFlexItem>
    );
}

export default DateRangeFilter;
