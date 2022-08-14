import { ItemsHoldr } from "itemsholdr";

/**
 * A collection of groups of changes.
 */
export type Collection = Record<string, ChangeGroup>;

/**
 * A group of changes to an item.
 */
export type ChangeGroup = Record<string, any>;

/**
 * Cache-based wrapper around localStorage for states.
 */
export type StateItemsHoldr = Pick<ItemsHoldr, "addItem" | "getItem" | "hasKey" | "setItem">;

/**
 * Settings to initialize a new StateHoldr.
 */
export interface StateHoldrSettings {
    /**
     * Starting collection to change within, if not "".
     */
    collection?: string;

    /**
     * Cache-based wrapper around localStorage for states.
     */
    itemsHolder?: StateItemsHoldr;

    /**
     * Prefix to prepend to keys in storage.
     */
    prefix?: string;
}
