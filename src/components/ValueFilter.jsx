import { EuiButton, EuiFlexItem } from "@elastic/eui";
import { useSearchkit, useSearchkitVariables } from "@searchkit/client";
import { useSearchParams } from "react-router-dom";
import { stateToRoute, volumeLabels } from "../common";

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * copied directly from @searchkit/elastic-ui; needed, but not exported!
 * https://github.com/searchkit/searchkit/blob/a67420cb1e16d2a459f473c904cde10b3cfd5858/packages/searchkit-elastic-ui/src/SelectedFilters/index.tsx#L46
 */
function ValueFilter({ filter, loading }) {
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const [_, setSearchParams] = useSearchParams();
    let valueLabel = filter.value;
    // special handling for volume labels
    if (
        filter.value
        && filter.identifier === "volume"
        && Object.keys(volumeLabels).includes(filter.value)
    ) {
        valueLabel = volumeLabels[filter.value];
    }
    return (
        <EuiFlexItem grow={false}>
            <EuiButton
                iconSide="right"
                iconType="cross"
                isLoading={loading}
                onClick={() => {
                    const filters = api
                        .getFilters()
                        .filter((f) => !(
                            f.value === filter.value && f.identifier === filter.identifier
                        ));
                    setSearchParams(
                        stateToRoute({
                            ...variables,
                            filters,
                            page: {
                                from: 0,
                            },
                        }),
                    );
                }}
            >
                <span>
                    {`${filter.label}: ${valueLabel}`}
                </span>
            </EuiButton>
        </EuiFlexItem>
    );
}

export default ValueFilter;
