import { IItemValues } from "itemsholdr";

import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Storage keys and value settings.
 */
export class Items<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Prefix to add before keys in storage.
     */
    public readonly prefix?: string;

    /**
     * Initial settings for item values to store.
     */
    public readonly values: IItemValues<{}>;
}
