// Facets to display for each given Entity Type

export const conditionalFacets = {
    attendance: [
        "attended_with",
        "date",
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
    production: ["city", "date_str", "directors", "place"],
    public_event: ["date_str"],
    publication: ["authors", "date", "translators"],
    reading: ["authors", "date"],
    translating: ["translated_into", "translators"],
    work_of_art: ["artists", "country"],
    writing: ["date_str", "years"],
};
