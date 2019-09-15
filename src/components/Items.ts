import { IItemValues } from "itemsholdr";

import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Storage keys and value settings.
 */
export class Items<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * Prefix to add before keys in storage.
     */
    public readonly prefix?: string;

    /**
     * Initial settings for item values to store.
     */
    public readonly values: IItemValues<{}>;
}
