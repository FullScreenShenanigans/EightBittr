import { INameTransform } from "audioplayr";

import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * Transforms provided names into file names.
     */
    public readonly nameTransform?: INameTransform;
}
