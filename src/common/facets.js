/**
 * Replacement for @searchkit/sdk's RefinementSelectFacet, compatible with Elasticsearch 8.
 */
export class RefinementSelectFacet {
    /**
     * @param {object} config Facet configuration
     * @param {string} config.field ES field name
     * @param {string} config.identifier Unique identifier for this facet
     * @param {string} config.label Display label
     * @param {boolean} [config.multipleSelect] Allow multiple values
     * @param {"value"|"count"} [config.order] Sort order for buckets
     * @param {number} [config.size] Max number of buckets
     * @param {string} [config.display] Display component hint
     */
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = true;
    }

    /** @returns {string} */
    getIdentifier() {
        return this.config.identifier;
    }

    /** @returns {string} */
    getLabel() {
        return this.config.label;
    }

    /**
     * Build the ES 8 terms aggregation for this facet.
     *
     * @returns {object} Aggregation query object
     */
    getAggregation() {
        const order =
            this.config.order === "value" ? { _key: "asc" } : { _count: "desc" };
        return {
            [this.config.identifier]: {
                terms: {
                    field: this.config.field,
                    size: this.config.size ?? 10,
                    order,
                },
            },
        };
    }

    /**
     * Build the ES 8 filter clause for selected values.
     *
     * @param {Array<object>} filters Active filters for this facet
     * @returns {object|null} Filter clause, or null if no values
     */
    getFilters(filters) {
        const values = filters.map((f) => f.value).filter(Boolean);
        if (!values.length) return null;
        return this.config.multipleSelect
            ? { terms: { [this.config.field]: values } }
            : { term: { [this.config.field]: values[0] } };
    }

    /**
     * Build the applied-filter display object for a single selected value.
     *
     * @param {object} filterSet The selected filter
     * @returns {object} Applied filter display object
     */
    getSelectedFilter(filterSet) {
        return {
            type: "ValueSelectedFilter",
            id: `${this.config.identifier}_${filterSet.value}`,
            identifier: this.config.identifier,
            label: this.config.label,
            value: filterSet.value,
            display: this.config.display || "ListFacet",
        };
    }

    /**
     * Transform an ES 8 aggregation response bucket into the expected facet shape.
     *
     * @param {object} response The aggregation result from ES 8
     * @returns {object} Facet result object
     */
    transformResponse(response) {
        const buckets = response?.buckets ?? [];
        return {
            identifier: this.config.identifier,
            label: this.config.label,
            type: "RefinementSelectFacet",
            display: this.config.display || "ListFacet",
            entries: buckets.map((b) => ({
                label: String(b.key),
                count: b.doc_count,
            })),
        };
    }
}
