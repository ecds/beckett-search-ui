export class CustomDateRangeFacet {
    /**
     * A facet used to filter by date range in the dataset. Adapted from @searchkit/sdk, but
     * modified to create separate filters for start and end date.
     *
     * @param {object} config Configuration options
     */
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = true;
    }

    /**
     * Identifier, which must be unique to facet.
     *
     * @returns {string} Identifier
     */
    getIdentifier() {
        return this.config.identifier;
    }

    /**
     * Label used for display, if displayed.
     *
     * @returns {string} Label
     */
    getLabel() {
        return this.config.label;
    }

    /**
     * Generate ES range filter object from chosen dates.
     *
     * @param {Array<object>} filters The filter from the search state.
     * @returns {object} The resulting range filter.
     */
    getFilters(filters) {
        const rangeFilter = {};
        if (filters[0]?.dateMin) {
            rangeFilter.gte = filters[0].dateMin;
        } else if (filters[0]?.dateMax) {
            rangeFilter.lte = filters[0].dateMax;
        }
        return { range: { [this.config.field]: rangeFilter } };
    }

    /**
     * Force empty aggregation
     *
     * @returns {object} Empty object
     */
    // eslint-disable-next-line class-methods-use-this
    getAggregation() {
        return {};
    }

    /**
     * Returns an object used for filter choice presentation.
     *
     * @param {object} filterSet The filter from the search state.
     * @returns {object} Object used by appliedFilters for presentation.
     */
    getSelectedFilter(filterSet) {
        return {
            type: "DateRangeSelectedFilter",
            id: `${this.getIdentifier()}_${
                filterSet.dateMin || filterSet.dateMax
            }`,
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            dateMin: filterSet.dateMin,
            dateMax: filterSet.dateMax,
            display: this.config.display || "CustomDateFacet",
        };
    }

    /**
     * transform ES response into an object that matches the Facet Schema type
     *
     * @returns {object} Facet Schema object
     */
    transformResponse() {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            type: "DateRangeFacet",
            display: this.config.display || "CustomDateFacet",
            entries: null,
        };
    }
}

export default CustomDateRangeFacet;
