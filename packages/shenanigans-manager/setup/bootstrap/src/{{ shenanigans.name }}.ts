import {
    I{{ shenanigans.name }},
    I{{ shenanigans.name }}Settings,
} from "./I{{ shenanigans.name }}";

/**
 * {{ description }}
 */
export class {{ shenanigans.name }} implements I{{ shenanigans.name }} {
    /**
     * Initializes a new instance of the {{ shenanigans.name }} class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: I{{ shenanigans.name }}Settings) {
        throw new Error("TODO: Implement me!")
    }
}
