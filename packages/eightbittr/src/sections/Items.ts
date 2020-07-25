import { ItemValues } from "itemsholdr";

import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Storage keys and value settings.
 */
export class Items<Game extends EightBittr> extends Section<Game> {
    /**
     * Prefix to add before keys in storage.
     */
    public readonly prefix?: string;

    /**
     * Initial settings for item values to store.
     */
    public readonly values: ItemValues<{}>;
}
