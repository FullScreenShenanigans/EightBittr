// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { INameTransform } from "audioplayr";

import { EightBittr } from "../EightBittr";
import { Section } from "./Section";

/**
 * Friendly sound aliases and names for audio.
 */
export class Audio<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Transforms provided names into file names.
     */
    public readonly nameTransform?: INameTransform;
}
