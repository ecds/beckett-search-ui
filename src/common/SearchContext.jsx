import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { isDefault, routeToState, stateToRoute } from "./searchRouting";

/**
 * Replacement for @searchkit/client. URL search params remain the source of truth;
 * this context exposes a Searchkit-compatible API surface on top of them.
 */
const SearchContext = createContext(null);

/**
 * Provider component replacing SearchkitClient / withSearchkit.
 *
 * @param {object} props React props
 * @param {React.ReactNode} props.children Child components
 * @returns {React.ReactElement} Provider element
 */
export function SearchProvider({ children }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive current variables from URL params on every render.
    const variables = useMemo(
        () => routeToState(searchParams),
        [searchParams],
    );

    const api = useMemo(
        () => ({
            /** @returns {Array<object>} Current active filters */
            getFilters: () => variables.filters ?? [],

            /**
             * @param {object} filter Filter to check
             * @param {string} filter.identifier
             * @param {*} filter.value
             * @returns {boolean}
             */
            isFilterSelected: ({ identifier, value }) =>
                (variables.filters ?? []).some(
                    (f) =>
                        f.identifier === identifier &&
                        f.value === String(value),
                ),

            /** @returns {boolean} True if the search has any non-default state */
            canResetSearch: () => !isDefault(variables),

            /**
             * Navigate to the given page by updating URL params.
             *
             * @param {object} page
             * @param {number} page.size
             * @param {number} page.from
             */
            setPage: ({ size, from }) => {
                setSearchParams(
                    stateToRoute({ ...variables, page: { size, from } }),
                );
            },

            // No-ops: useCustomSearchkitSDK watches searchParams directly.
            search: () => {},
            setSearchState: () => {},
            setQuery: () => {},
        }),
        [variables, setSearchParams],
    );

    return (
        <SearchContext.Provider value={{ api, variables }}>
            {children}
        </SearchContext.Provider>
    );
}

/**
 * Hook returning the search API (replaces useSearchkit from @searchkit/client).
 *
 * @returns {object} Search API object
 */
export function useSearchkit() {
    return useContext(SearchContext).api;
}

/**
 * Hook returning current search variables derived from URL params
 * (replaces useSearchkitVariables from @searchkit/client).
 *
 * @returns {object} Current search state
 */
export function useSearchkitVariables() {
    return useContext(SearchContext).variables;
}

/**
 * Higher-order component wrapping a component with SearchProvider
 * (replaces withSearchkit from @searchkit/client).
 * The second argument (client factory) is accepted but ignored.
 *
 * @param {React.ComponentType} Component Component to wrap
 * @returns {React.ComponentType} Wrapped component
 */
export function withSearchkit(Component) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    return function SearchWrapped(props) {
        return (
            <SearchProvider>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...props} />
            </SearchProvider>
        );
    };
}
