import { IItemsHoldr, ItemsHoldr } from "itemsholdr";

import { ICollection, IStateHoldr, IStateHoldrSettings } from "./IStateHoldr";

/**
 * General localStorage saving for collections of state.
 */
export class StateHoldr implements IStateHoldr {
    /**
     * The internal IItemsHoldr instance that stores data.
     */
    private readonly itemsHolder: IItemsHoldr;

    /**
     * What prefix to prepend keys for the ItemsHolder.
     */
    private readonly prefix: string;

    /**
     * The list of collection keys referenced, with the prefix.
     */
    private readonly collectionKeys: string[];

    /**
     * The current key for the collection, with the prefix.
     */
    private collectionKey: string;

    /**
     * The current key for the collection, without the prefix.
     */
    private collectionKeyRaw: string;

    /**
     * The current Object with attributes saved within.
     */
    private collection: ICollection;

    /**
     * Initializes a new instance of the StateHoldr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IStateHoldrSettings = {}) {
        this.itemsHolder = settings.itemsHolder || new ItemsHoldr();
        this.prefix = settings.prefix || "StateHolder";
        this.collectionKeys = [];
    }

    /**
     * @returns The ItemsHoldr instance that stores data.
     */
    public getItemsHolder(): IItemsHoldr {
        return this.itemsHolder;
    }

    /**
     * @returns The prefix used for ItemsHoldr keys.
     */
    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * @returns The current key for the collection, with the prefix.
     */
    public getCollectionKey(): string {
        return this.collectionKey;
    }

    /**
     * @returns The list of keys of collections, with the prefix.
     */
    public getCollectionKeys(): string[] {
        return this.collectionKeys;
    }

    /**
     * @returns The current key for the collection, without the prefix.
     */
    public getCollectionKeyRaw(): string {
        return this.collectionKeyRaw;
    }

    /**
     * @returns The current Object with attributes saved within.
     */
    public getCollection(): ICollection {
        return this.collection;
    }

    /**
     * @param otherCollectionKeyRaw   A key for a collection to retrieve.
     * @returns The collection stored under the raw key, if it exists.
     */
    public getOtherCollection(otherCollectionKeyRaw: string): ICollection {
        const otherCollectionKey: string = this.prefix + otherCollectionKeyRaw;

        this.ensureCollectionKeyExists(otherCollectionKey);

        return this.itemsHolder.getItem(otherCollectionKey);
    }

    /**
     * @param itemKey   The item key whose changes are being retrieved.
     * @returns Any changes under the itemKey, if it exists.
     */
    public getChanges(itemKey: string): any {
        return this.getCollectionItemSafely(itemKey);
    }

    /**
     * @param itemKey   The item key whose changes are being retrieved.
     * @param valueKey   The specific change being requested.
     * @returns The changes for the specific item, if it exists.
     */
    public getChange(itemKey: string, valueKey: string): any {
        return this.getCollectionItemSafely(itemKey)[valueKey];
    }

    /**
     * Sets the currently tracked collection.
     *
     * @param collectionKeyRawNew   The raw key of the new collection
     *                              to switch to.
     * @param value   An optional container of values to set the new
     *                collection equal to.
     */
    public setCollection(collectionKeyRawNew: string, value?: any): void {
        this.collectionKeyRaw = collectionKeyRawNew;
        this.collectionKey = this.prefix + this.collectionKeyRaw;

        this.ensureCollectionKeyExists(this.collectionKey);

        if (value) {
            this.itemsHolder.setItem(this.collectionKey, value);
        }

        this.collection = this.itemsHolder.getItem(this.collectionKey);
    }

    /**
     * Saves the currently tracked collection into the ItemsHolder.
     */
    public saveCollection(): void {
        this.itemsHolder.setItem(this.collectionKey, this.collection);
        this.itemsHolder.setItem(`${this.prefix}collectionKeys`, this.collectionKeys);
    }

    /**
     * Adds a change to the collection, stored as a key-value pair under an item.
     *
     * @param itemKey   The key for the item experiencing the change.
     * @param valueKey   The attribute of the item being changed.
     * @param value   The actual value being stored.
     */
    public addChange(itemKey: string, valueKey: string, value: any): void {
        this.getCollectionItemSafely(itemKey)[valueKey] = value;
    }

    /**
     * Adds a change to any collection requested by the key, stored as a key-value
     * pair under an item.
     *
     * @param collectionKeyOtherRaw   The raw key for the other collection
     *                                to add the change under.
     * @param itemKey   The key for the item experiencing the change.
     * @param valueKey   The attribute of the item being changed.
     * @param value   The actual value being stored.
     */
    public addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void {
        const collectionKeyOther: string = this.prefix + collectionKeyOtherRaw;

        this.ensureCollectionKeyExists(collectionKeyOther);
        const otherCollection: any = this.itemsHolder.getItem(collectionKeyOther);

        if (typeof otherCollection[itemKey] === "undefined") {
            otherCollection[itemKey] = {};
        }

        otherCollection[itemKey][valueKey] = value;

        this.itemsHolder.setItem(collectionKeyOther, otherCollection);
    }

    /**
     * Copies all changes from a contained item into an output item.
     *
     * @param itemKey   The key for the contained item.
     * @param output   The recipient for all the changes.
     */
    public applyChanges(itemKey: string, output: any): void {
        const changes: any = this.collection[itemKey];

        if (!changes) {
            return;
        }

        for (const key in changes) {
            output[key] = changes[key];
        }
    }

    /**
     * Ensures a collection exists by checking for it and creating it under
     * the internal ItemsHoldr if it doesn't.
     *
     * @param collectionKey   The key for the collection that must exist,
     *                        including the prefix.
     */
    private ensureCollectionKeyExists(collectionKey: string): void {
        if (!this.itemsHolder.hasKey(collectionKey)) {
            this.itemsHolder.addItem(collectionKey, {
                valueDefault: {},
            });

            this.collectionKeys.push(collectionKey);
            this.itemsHolder.setItem(`${this.prefix}collectionKeys`, this.collectionKeys);
        }
    }

    /**
     * Ensures an item in the current collection exists by checking for it and
     * creating it if it doesn't.
     *
     * @param itemKey   The item key that must exist.
     * @returns The item in the collection under the given key.
     */
    private getCollectionItemSafely(itemKey: string): any {
        if (!{}.hasOwnProperty.call(this.collection, itemKey)) {
            return this.collection[itemKey] = {};
        }

        return this.collection[itemKey];
    }
}
