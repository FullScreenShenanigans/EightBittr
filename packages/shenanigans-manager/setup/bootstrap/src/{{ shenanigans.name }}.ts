{{ #shenanigans.game }}
import { EightBittr, IEightBittrConstructorSettings } from 'eightbittr';
{{ /shenanigans.game }}

{{ ^shenanigans.game }}
import { I{{ shenanigans.name }}, I{{ shenanigans.name }}Settings } from "./types";
{{ /shenanigans.game }}

/**
 * {{ description }}
 */
{{ #shenanigans.game }}
export class {{ shenanigans.name }} extends EightBittr {
    /**
     * Initializes a new instance of the {{ shenanigans.name }} class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IEightBittrConstructorSettings) {
        super(settings);
        
        this.quadsKeeper.resetQuadrants();
    }
}
{{ /shenanigans.game }}
{{ ^shenanigans.game }}
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
{{ /shenanigans.game }}
