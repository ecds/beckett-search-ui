export class CustomYearRangeFacet {
    /**
     * A facet used to filter by year range in the dataset. Adapted from @searchkit/sdk, but
     * modified to create separate filters for start and end year.
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
     * Generate ES range filter object from chosen years.
     *
     * @param {Array<object>} filters The filter from the search state.
     * @returns {object} The resulting range filter.
     */
    getFilters(filters) {
        const rangeFilter = {};
        if (filters[0]?.yearMin) {
            rangeFilter.gte = filters[0].yearMin;
        } else if (filters[0]?.yearMax) {
            rangeFilter.lte = filters[0].yearMax;
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
            type: "YearRangeSelectedFilter",
            id: `${this.getIdentifier()}_${
                filterSet.yearMin || filterSet.yearMax
            }`,
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            yearMin: filterSet.yearMin,
            yearMax: filterSet.yearMax,
            display: this.config.display || "CustomYearFacet",
            value: filterSet.yearMin || filterSet.yearMax,
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
            type: "YearRangeFacet",
            display: this.config.display || "CustomYearFacet",
            entries: null,
        };
    }
}

export default CustomYearRangeFacet;
