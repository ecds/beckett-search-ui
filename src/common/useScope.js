import { useSearchkitVariables } from "@searchkit/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isDefault, stateToRoute } from "./searchRouting";

/**
 * Utility hook to factor out two repeated concepts between the search pages:
 * - The "scope" state defaults and side effects
 * - Updating URL search params when Searchkit Variables change
 * Calling it useScope since we only actually need to return the scope state and setter.
 *
 * @returns {Array<object, Function>} An array containing the current scope frontend state and
 * the setState function for it.
 */
export const useScope = () => {
    const variables = useSearchkitVariables();
    const [searchParams, setSearchParams] = useSearchParams();

    const [scope, setScope] = useState(() => {
        if (searchParams.has("scope")) {
            return searchParams.get("scope");
        }
        // default scope: keyword
        return "keyword";
    });
    useEffect(() => {
        // don't auto-update search params when loading the defaults;
        // if we need to reset, do it manually (i.e. reset button or unclicking filters)
        if (variables && !isDefault(variables)) {
            setSearchParams((prevParams) => {
                let page = {};
                // reset page to 0 if scope changes; could filter out results
                if (
                    !prevParams.has("scope") ||
                    scope !== prevParams.get("scope")
                ) {
                    page = {
                        page: {
                            from: 0,
                            size: 25,
                        },
                    };
                }
                return stateToRoute({
                    ...variables,
                    ...page,
                    scope,
                });
            });
        }
    }, [variables, scope]);

    return [scope, setScope];
};
