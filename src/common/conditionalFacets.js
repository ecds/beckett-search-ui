// Facets to display for each given Entity Type

export const conditionalFacets = {
    attendance: [
        "attended_with",
        "directors",
        "event_type",
        "place",
        "performed_by",
        "years",
    ],
    music: ["composers", "performed_by"],
    organization: [],
    person: [],
    people: [],
    place: [],
    production: ["directors", "places", "years"],
    public_event: ["years"],
    publication: ["authors", "translators", "years"],
    reading: ["authors", "years"],
    translating: ["translated_into", "translators"],
    work_of_art: ["artists", "countries"],
    writing: ["years"],
};
