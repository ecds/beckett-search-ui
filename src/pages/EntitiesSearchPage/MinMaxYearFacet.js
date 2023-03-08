export class MinMaxYearFacet {
    /**
     * A facet used to aggregate the minimum or maximum year in the dataset.
     *
     * @param {object} config Configuration options
     */
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = true;
    }

    /**
     * Identifier, which must be unique to facet if not configured.
     *
     * @returns {string} Identifier
     */
    getIdentifier() {
        return this.config.identifier;
    }

    /**
     * Label used for display, if displayed (it's not in our app).
     *
     * @returns {string} Label
     */
    getLabel() {
        return this.config.label;
    }

    /**
     * String "min" or "max" to determine which kind of aggregation this is
     *
     * @returns {string} The string "min" or "max"
     */
    getMinMax() {
        return this.config.minMax;
    }

    /**
     * The ElasticSearch aggregation query for the facet
     *
     * @returns {object} Aggregation query object
     */
    getAggregation() {
        return {
            [this.getIdentifier()]: {
                [this.getMinMax()]: {
                    field: this.config.field
                },
            },
        };
    }

    /**
     * transform ES response into an object that matches the Facet Schema type
     *
     * @param {object} response ElasticSearch response object
     * @returns {object} Facet Schema object, plus value field
     */
    transformResponse(response) {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            type: "CustomFacet",
            display: this.config.display,
            value: response.value
        };
    }
}
