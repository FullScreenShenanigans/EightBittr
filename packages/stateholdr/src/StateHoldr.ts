import { ItemsHoldr } from "itemsholdr";

import { Collection, StateHoldrSettings, StateItemsHoldr } from "./types";

/**
 * Default prefix prepended to key names, if one isn't provided.
 */
export const defaultPrefix = "StateHoldr::";

/**
 * Item name to store collection keys under.
 */
export const collectionKeysItemName = "collectionKeys";

/**
 * Stores and retrieves persistent changes to collections of objects.
 */
export class StateHoldr {
    /**
     * Cache-based wrapper around localStorage for states.
     */
    private readonly itemsHolder: StateItemsHoldr;

    /**
     * Prefix to prepend to keys in storage.
     */
    private readonly prefix: string;

    /**
     * Current collection of objects.
     */
    private collection: Collection;

    /**
     * Key of the current collection.
     */
    private collectionKey: string;

    /**
     * In-progress list of all collection keys.
     */
    private readonly collectionKeys: string[];

    /**
     * Initializes a new instance of the StateHoldr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: StateHoldrSettings = {}) {
        this.itemsHolder = settings.itemsHolder ?? new ItemsHoldr();
        this.prefix = settings.prefix ?? defaultPrefix;

        const collectionKeys = this.itemsHolder.getItem(
            `${this.prefix}${collectionKeysItemName}`
        );
        this.collectionKeys = collectionKeys === undefined ? [] : collectionKeys;

        this.setCollection(settings.collection === undefined ? "" : settings.collection);
    }

    /**
     * Gets the storage prefix.
     *
     * @returns Prefix to prepend to keys in storage.
     */
    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * Adds a change to an object under the current collection.
     *
     * @param itemKey   Key of the item to add a change under.
     * @param attributeKey   Attribute of the item being changed.
     * @param value   Value under the attribute to change.
     */
    public addChange<
        ItemKey extends keyof Collection,
        AttributeKey extends keyof Collection[ItemKey]
    >(
        itemKey: ItemKey,
        attributeKey: AttributeKey,
        value: Collection[ItemKey][AttributeKey]
    ): void {
        this.getCollectionItemSafely(itemKey)[attributeKey] = value;
    }

    /**
     * Adds a change to an object under another collection.
     *
     * @param otherCollectionKey   Key of the collection to change within.
     * @param itemKey   Key of the item to add a change under.
     * @param attribute   Attribute of the item being changed.
     * @param value   Value under the attribute to change.
     */
    public addChangeToCollection<
        ItemKey extends keyof Collection,
        ValueKey extends keyof Collection
    >(
        otherCollectionKey: string,
        itemKey: ItemKey,
        valueKey: ValueKey,
        value: Collection[ValueKey]
    ): void {
        this.ensureCollectionKeyExists(otherCollectionKey);
        const otherCollection = this.itemsHolder.getItem(
            `${this.prefix}${otherCollectionKey}`
        ) as Collection;

        if ({}.hasOwnProperty.call(otherCollection, itemKey)) {
            otherCollection[itemKey][valueKey] = value;
        } else {
            otherCollection[itemKey] = {};
        }

        this.itemsHolder.setItem(otherCollectionKey, otherCollection);
    }

    /**
     * Copies all changes from a contained item into an output item.
     *
     * @param itemKey   Key of a contained item.
     * @param output   Recipient for all the changes.
     */
    public applyChanges<Key extends keyof Collection>(
        itemKey: Key,
        output: Collection[Key]
    ): void {
        if (!{}.hasOwnProperty.call(this.collection, itemKey)) {
            return;
        }

        const changes = this.collection[itemKey];

        for (const key in changes) {
            if ({}.hasOwnProperty.call(changes, key)) {
                output[key] = changes[key];
            }
        }
    }

    /**
     * Gets the changes for an item.
     *
     * @param itemKey   Key of a contained item.
     * @returns Any changes under the itemKey.
     */
    public getChanges(itemKey: string): any {
        return this.getCollectionItemSafely(itemKey);
    }

    /**
     * Sets the currently tracked collection.
     *
     * @param collectionKey   Key of a new collection to switch to.
     * @param value   Container to override any existing state with.
     */
    public setCollection(collectionKey: string, value?: any): void {
        this.collectionKey = collectionKey;
        this.ensureCollectionKeyExists(this.collectionKey);

        const prefixedKey = `${this.prefix}${this.collectionKey}`;

        if (value) {
            this.itemsHolder.setItem(prefixedKey, value);
        }

        const collection = this.itemsHolder.getItem(prefixedKey);
        this.collection = collection === undefined ? {} : collection;
    }

    /**
     * Saves the currently tracked collection into the ItemsHoldr.
     */
    public saveCollection(): void {
        this.itemsHolder.setItem(`${this.prefix}${this.collectionKey}`, this.collection);
        this.itemsHolder.setItem(`${this.prefix}${collectionKeysItemName}`, this.collectionKeys);
    }

    /**
     * Ensures a collection exists by checking for it and creating it under
     * the internal ItemsHoldr if it doesn't.
     *
     * @param collectionKey   The key for the collection that must exist,
     *                        including the prefix.
     */
    private ensureCollectionKeyExists(collectionKey: string): void {
        if (!this.collectionKeys.includes(collectionKey)) {
            this.collectionKeys.push(collectionKey);
        }

        this.itemsHolder.setItem(`${this.prefix}${collectionKeysItemName}`, this.collectionKeys);

        if (!this.itemsHolder.hasKey(`${this.prefix}${collectionKey}`)) {
            this.itemsHolder.addItem(`${this.prefix}${collectionKey}`, {
                valueDefault: {},
            });
        }
    }

    /**
     * Ensures an item in the current collection exists by checking for it and
     * creating it if it doesn't.
     *
     * @param itemKey   The item key that must exist.
     * @returns The item in the collection under the given key.
     */
    private getCollectionItemSafely<ItemKey extends keyof Collection>(itemKey: ItemKey) {
        if (!{}.hasOwnProperty.call(this.collection, itemKey)) {
            this.collection[itemKey] = {};
        }

        return this.collection[itemKey];
    }
}
