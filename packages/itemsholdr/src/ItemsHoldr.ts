import { createStorage } from "./createStorage";
import {
    IItemSettings,
    IItemsHoldr,
    IItemsHoldrSettings,
    IItemValues,
    IStringKeysOf,
} from "./IItemsHoldr";
import { IItemContainerSettings, ItemContainer } from "./ItemContainer";

/**
 * Item containers, keyed by item name.
 */
interface IItems {
    [i: string]: ItemContainer;
}

/**
 * Cache-based wrapper around localStorage.
 *
 * @template TItems   Items names linked to their types.
 */
export class ItemsHoldr<TItems = any> implements IItemsHoldr<TItems> {
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
    private readonly values: IItemValues<TItems>;

    /**
     * Settings to create item containers.
     */
    private readonly containerSettings: IItemContainerSettings;

    /**
     * Whether this should save changes to localStorage automatically.
     */
    private autoSave: boolean;

    /**
     * All keys for stored items.
     */
    private itemKeys: IStringKeysOf<TItems>[];

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
        } else if (typeof localStorage === "undefined") {
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
    public key(index: number): IStringKeysOf<TItems> {
        return this.itemKeys[index];
    }

    /**
     * Gets whether autoSave is enabled.
     *
     * @returns Whether autoSave is enabled.
     */
    public getAutoSave(): boolean {
        return this.autoSave;
    }

    /**
     * Sets whether autoSave is enabled.
     *
     * @param autoSave   Whether autoSave is enabled.
     */
    public setAutoSave(autoSave: boolean): void {
        this.autoSave = autoSave;
    }

    /**
     * Creates a new item with settings.
     *
     * @template TKey   Key name of an item.
     * @param key   Unique key to store the item under.
     * @param settings   Any additional settings for the item.
     */
    public addItem<TKey extends IStringKeysOf<TItems>>(
        key: TKey,
        settings?: IItemSettings<TItems[TKey]>
    ): void {
        this.items[key] = new ItemContainer(this.containerSettings, key, settings);
        this.itemKeys.push(key);
    }

    /**
     * Gets the value under a key.
     *
     * @template TKey   Key name of an item.
     * @param key   The key for a known value.
     * @returns The known value of a key, assuming that key exists.
     */
    public getItem<TKey extends IStringKeysOf<TItems>>(key: TKey): TItems[TKey] {
        this.checkExistence(key);

        return this.items[key].getValue();
    }

    /**
     * Clears a value from the listing, and removes its element from the
     * container (if they both exist).
     *
     * @template TKey   Key name of an item.
     * @param key   The key of the element to remove.
     */
    public removeItem<TKey extends IStringKeysOf<TItems>>(key: TKey): void {
        if (!{}.hasOwnProperty.call(this.items, key)) {
            return;
        }

        this.itemKeys.splice(this.itemKeys.indexOf(key), 1);

        delete this.items[key];
        this.storage.removeItem(`${this.prefix}${key}`);

        if ({}.hasOwnProperty.call(this.values, key)) {
            this.addItem(key, this.values[key]);
        }
    }

    /**
     * Sets the value for an item under the given key.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param value   The new value for the item.
     */
    public setItem<TKey extends IStringKeysOf<TItems>>(key: TKey, value: TItems[TKey]): void {
        this.checkExistence(key);

        this.items[key].setValue(value);
    }

    /**
     * Increases the value of an item as a number or string.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    public increase<TKey extends IStringKeysOf<TItems>>(
        key: TKey,
        amount: number | string = 1
    ): void {
        this.checkExistence(key);

        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const value: number | string = this.items[key].getValue() + amount;

        this.items[key].setValue(value);
    }

    /**
     * Decreases the value of an item as a number.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param amount   Amount to decrease by (by default, 1).
     */
    public decrease<TKey extends IStringKeysOf<TItems>>(key: TKey, amount = 1): void {
        this.checkExistence(key);

        const value: number = (this.items[key].getValue() as number) - amount;

        this.items[key].setValue(value);
    }

    /**
     * Toggles whether an item is true or false.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     */
    public toggle<TKey extends IStringKeysOf<TItems>>(key: TKey): void {
        this.checkExistence(key);

        const value = this.items[key].getValue() ? false : true;

        this.items[key].setValue(value);
    }

    /**
     * Gets whether an item exists under the key.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @returns Whether there is a value under that key.
     */
    public hasKey<TKey extends keyof TItems>(key: TKey): boolean {
        return {}.hasOwnProperty.call(this.items, key);
    }

    /**
     * Gets a summary of keys and their values.
     *
     * @returns A mapping of key to their stored values.
     */
    public exportItems(): TItems {
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
            this.storage.removeItem(`${this.prefix}${key}`);
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
     * @template TKey   Key name of an item.
     * @param key   The key of the item to save.
     */
    public saveItem<TKey extends IStringKeysOf<TItems>>(key: TKey): void {
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
     * Manually resets all items to their storage defaults.
     */
    public resetAll(): void {
        this.items = {};
        this.itemKeys = [];
    }

    /**
     * Ensures a key exists in values. If it doesn't, and new values are
     * allowed, it creates it; otherwise, it throws an Error.
     *
     * @param key   Key to guarantee existence of.
     */
    private checkExistence(key: IStringKeysOf<TItems>): void {
        if (!{}.hasOwnProperty.call(this.items, key)) {
            this.addItem(key, this.values[key]);
        }
    }
}
