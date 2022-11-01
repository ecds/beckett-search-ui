import { EuiButton, EuiFlexItem } from "@elastic/eui";
import { FilterLink } from "@searchkit/client";
import { useRef } from "react";

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * copied directly from @ecds/searchkit-elastic-ui; needed, but not exported!
 * https://github.com/searchkit/searchkit/blob/a67420cb1e16d2a459f473c904cde10b3cfd5858/packages/searchkit-elastic-ui/src/SelectedFilters/index.tsx#L46
 */
function ValueFilter({ filter, loading }) {
    const ref = useRef();
    return (
        <EuiFlexItem grow={false}>
            <EuiButton
                iconSide="right"
                iconType="cross"
                isLoading={loading}
                onClick={(e) => {
                    ref.current.onClick(e);
                }}
            >
                <FilterLink ref={ref} filter={filter}>
                    {`${filter.label}: ${filter.value}`}
                </FilterLink>
            </EuiButton>
        </EuiFlexItem>
    );
}

export default ValueFilter;
