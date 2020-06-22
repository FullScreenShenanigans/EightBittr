import { IItemsHoldr } from "itemsholdr";

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
     * Stores persistent changes locally.
     */
    itemsHolder?: IItemsHoldr;

    /**
     * Prefix to prepend to keys in storage.
     */
    prefix?: string;
}

/**
 * Stores and retrieves persistent changes to collections of objects.
 */
export interface IStateHoldr {
    /**
     * Gets the storage prefix.
     *
     * @returns Prefix to prepend to keys in storage.
     */
    getPrefix(): string;

    /**
     * Adds a change to an object under the current collection.
     *
     * @param itemKey   Key of the item to add a change under.
     * @param attribute   Attribute of the item being changed.
     * @param value   Value under the attribute to change.
     */
    addChange(itemKey: string, valueKey: string, value: any): void;

    /**
     * Adds a change to an object under another collection.
     *
     * @param otherCollectionKey   Key of the collection to change within.
     * @param itemKey   Key of the item to add a change under.
     * @param attribute   Attribute of the item being changed.
     * @param value   Value under the attribute to change.
     */
    addChangeToCollection(
        otherCollectionKey: string,
        itemKey: string,
        valueKey: string,
        value: any
    ): void;

    /**
     * Copies all changes from a contained item into an output item.
     *
     * @param itemKey   Key of a contained item.
     * @param output   Recipient for all the changes.
     */
    applyChanges(itemKey: string, output: any): void;

    /**
     * Gets the changes for an item.
     *
     * @param itemKey   Key of a contained item.
     * @returns Any changes under the itemKey.
     */
    getChanges(itemKey: string): any;

    /**
     * Sets the currently tracked collection.
     *
     * @param collectionKey   Key of a new collection to switch to.
     * @param value   Container to override any existing state with.
     */
    setCollection(collectionKey: string, value?: any): void;

    /**
     * Saves the currently tracked collection into storage.
     */
    saveCollection(): void;
}
