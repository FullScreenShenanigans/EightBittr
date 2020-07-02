import { ItemsHoldr } from "itemsholdr";

/**
 * A collection of groups of changes.
 */
export interface ICollection {
    [i: string]: IChangeGroup;
}

/**
 * A group of changes to an item.
 */
export interface IChangeGroup {
    [i: string]: any;
}

/**
 * Settings to initialize a new IStateHoldr.
 */
export interface IStateHoldrSettings {
    /**
     * Starting collection to change within, if not "".
     */
    collection?: string;

    /**
     * Cache-based wrapper around localStorage.
     */
    itemsHolder?: ItemsHoldr;

    /**
     * Prefix to prepend to keys in storage.
     */
    prefix?: string;
}
