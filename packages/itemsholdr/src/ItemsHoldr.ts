import { createStorage } from "./createStorage";
import { IExportedItems, IItemSettings, IItemsHoldr, IItemsHoldrSettings, IItemValues } from "./IItemsHoldr";
import { IItemContainerSettings, ItemContainer } from "./ItemContainer";

/**
 * Item containers, keyed by item name.
 */
interface IItems {
    [i: string]: ItemContainer;
}

/**
 * A versatile container to store and manipulate values in localStorage, and
 * optionally keep an updated HTML container showing these values.
 */
export class ItemsHoldr implements IItemsHoldr {
    /**
     * Settings used to construct this ItemsHoldr.
     */
    private readonly settings: IItemsHoldrSettings;

    /**
     * A prefix to store things under in storage.
     */
    private readonly prefix: string;

    /**
     * A reference to localStorage or a replacement object.
     */
    private readonly storage: Storage;

    /**
     * Settings for item values, keyed by item key.
     */
    private readonly values: IItemValues;

    /**
     * Settings to create item containers.
     */
    private readonly containerSettings: IItemContainerSettings;

    /**
     * Whether this should save changes to localStorage automatically.
     */
    private readonly autoSave: boolean;

    /**
     * All keys for stored items.
     */
    private itemKeys: string[];

    /**
     * The items being stored, keyed by name.
     */
    private items: IItems;

    /**
     * Initializes a new instance of the ItemsHoldr class.
     *
     * @param settings   Any optional custom settings.
     */
    public constructor(settings: IItemsHoldrSettings = {}) {
        this.settings = settings;
        this.autoSave = !!settings.autoSave;
        this.items = {};
        this.itemKeys = [];
        this.prefix = settings.prefix || "";
        this.values = this.settings.values || {};

        if (settings.storage) {
            this.storage = settings.storage;
        } else if (typeof localStorage === "undefined") { // tslint:disable-line strict-type-predicates
            this.storage = createStorage();
        } else {
            this.storage = localStorage;
        }

        this.containerSettings = {
            autoSave: this.autoSave,
            defaults: this.settings.defaults || {},
            prefix: this.prefix,
            storage: this.storage,
        };
    }

    /**
     * How many items are being stored.
     */
    public get length(): number {
        return this.itemKeys.length;
    }

    /**
     * Gets the key at an index.
     *
     * @param index   An index for a key.
     * @returns The indexed key.
     */
    public key(index: number): string {
        return this.itemKeys[index];
    }

    /**
     * Creates a new item with settings.
     *
     * @param key   Unique key to store the item under.
     * @param settings   Any additional settings for the item.
     */
    public addItem(key: string, settings: IItemSettings = {}): void {
        this.items[key] = new ItemContainer(this.containerSettings, key, settings);
        this.itemKeys.push(key);
    }

    /**
     * Gets the value under a key.
     *
     * @param key   The key for a known value.
     * @returns The known value of a key, assuming that key exists.
     */
    public getItem(key: string): any {
        this.checkExistence(key);

        return this.items[key].getValue();
    }

    /**
     * Clears a value from the listing, and removes its element from the
     * container (if they both exist).
     *
     * @param key   The key of the element to remove.
     */
    public removeItem(key: string): void {
        if (!{}.hasOwnProperty.call(this.items, key)) {
            return;
        }

        this.itemKeys.splice(this.itemKeys.indexOf(key), 1);

        delete this.items[key];
        this.storage.removeItem(this.prefix + key);

        if ({}.hasOwnProperty.call(this.values, key)) {
            this.addItem(key, this.values[key]);
        }
    }

    /**
     * Sets the value for an item under the given key.
     *
     * @param key   Key of an item.
     * @param value   The new value for the item.
     */
    public setItem(key: string, value: any): void {
        this.checkExistence(key);

        this.items[key].setValue(value);
    }

    /**
     * Increases the value of an item as a number or string.
     *
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    public increase(key: string, amount: number | string = 1): void {
        this.checkExistence(key);

        // tslint:disable-next-line restrict-plus-operands
        const value: number | string = this.items[key].getValue() + amount;

        this.items[key].setValue(value);
    }

    /**
     * Decreases the value of an item as a number
     *
     * @param key   Key of an item.
     * @param amount   Amount to decrease by (by default, 1).
     */
    public decrease(key: string, amount: number = 1): void {
        this.checkExistence(key);

        const value: number = this.items[key].getValue() - amount;

        this.items[key].setValue(value);
    }

    /**
     * Toggles whether an item is true or false.
     *
     * @param key   Key of an item.
     */
    public toggle(key: string): void {
        this.checkExistence(key);

        const value = this.items[key].getValue() ? false : true;

        this.items[key].setValue(value);
    }

    /**
     * Gets whether an item exists under the key.
     *
     * @param key   Key of an item.
     * @returns Whether there is a value under that key.
     */
    public hasKey(key: string): boolean {
        return {}.hasOwnProperty.call(this.items, key);
    }

    /**
     * Gets a summary of keys and their values.
     *
     * @returns A mapping of key to their stored values.
     */
    public exportItems(): IExportedItems {
        const output: any = {};

        for (const itemKey of this.itemKeys) {
            output[itemKey] = this.items[itemKey].getValue();
        }

        return output;
    }

    /**
     * Completely clears all items.
     */
    public clear(): void {
        for (const key of this.itemKeys) {
            this.storage.removeItem(this.prefix + key);
        }

        this.items = {};
        this.itemKeys = [];

        for (const key in this.values) {
            if ({}.hasOwnProperty.call(this.values, key)) {
                this.addItem(key, this.values[key]);
            }
        }
    }

    /**
     * Manually saves an item's value to storage, ignoring autoSave settings.
     *
     * @param key   The key of the item to save.
     */
    public saveItem(key: string): void {
        if (!{}.hasOwnProperty.call(this.items, key)) {
            throw new Error(`Unknown key given to ItemsHoldr: '${key}'.`);
        }

        this.items[key].updateStorage(true);
    }

    /**
     * Manually saves all items to storage, ignoring autoSave settings.
     */
    public saveAll(): void {
        for (const key in this.items) {
            this.items[key].updateStorage(true);
        }
    }

    /**
     * Ensures a key exists in values. If it doesn't, and new values are
     * allowed, it creates it; otherwise, it throws an Error.
     *
     * @param key
     */
    private checkExistence(key: string): void {
        if (!{}.hasOwnProperty.call(this.items, key)) {
            this.addItem(key, this.values[key]);
        }
    }
}
