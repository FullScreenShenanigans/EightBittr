import { createPlaceholderStorage } from "./createPlaceholderStorage";
import { IItems, IItemsHoldr, IItemsHoldrSettings } from "./IItemsHoldr";
import { IItemValue, IItemValueDefaults } from "./IItemValue";
import { ItemValue } from "./ItemValue";

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
     * Default attributes for ItemValues.
     */
    private readonly defaults: IItemValueDefaults;

    /**
     * A reference to localStorage or a replacement object.
     */
    private readonly localStorage: Storage;

    /**
     * A prefix to store things under in localStorage.
     */
    private readonly prefix: string;

    /**
     * Whether new items are allowed to be created using setItem.
     */
    private readonly allowNewItems: boolean;

    /**
     * The ItemValues being stored, keyed by name.
     */
    private items: IItems;

    /**
     * A listing of all the String keys for the stored items.
     */
    private itemKeys: string[];

    /**
     * Whether this should save changes to localStorage automatically.
     */
    private autoSave: boolean;

    /**
     * Initializes a new instance of the ItemsHoldr class.
     *
     * @param settings   Any optional custom settings.
     */
    public constructor(settings: IItemsHoldrSettings = {}) {
        this.settings = settings;
        this.autoSave = !!settings.autoSave;
        this.prefix = settings.prefix || "";

        this.allowNewItems = settings.allowNewItems === undefined
            ? true : settings.allowNewItems;

        if (settings.localStorage) {
            this.localStorage = settings.localStorage;
        } else if (typeof localStorage === "undefined") { // tslint:disable-line strict-type-predicates
            this.localStorage = createPlaceholderStorage();
        } else {
            this.localStorage = localStorage;
        }

        this.defaults = settings.defaults || {};

        this.clear();
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
     * Gets the contained values.
     *
     * @returns The values contained within, keyed by their keys.
     */
    public getValues(): { [i: string]: IItemValue } {
        return this.items;
    }

    /**
     * Gets the default attributes for values.
     *
     * @returns Default attributes for values.
     */
    public getDefaults(): any {
        return this.defaults;
    }

    /**
     * Gets the reference to localStorage or its placeholder.
     *
     * @returns A reference to localStorage or its placeholder.
     */
    public getLocalStorage(): Storage {
        return this.localStorage;
    }

    /**
     * Gets whether this should save changes to localStorage automatically.
     *
     * @returns Whether this should save changes to localStorage automatically.
     */
    public getAutoSave(): boolean {
        return this.autoSave;
    }

    /**
     * Gets the prefix for localStorage keys.
     *
     * @returns The prefix to store keys under in localStorage.
     */
    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * Gets all keys for all items.
     *
     * @returns String keys for each of the stored ItemValues.
     */
    public getKeys(): string[] {
        return Object.keys(this.items);
    }

    /**
     * Gets all stored keys of items.
     *
     * @returns All keys of items.
     */
    public getItemKeys(): string[] {
        return this.itemKeys;
    }

    /**
     * Gets the value for a known key.
     *
     * @param key   The key for a known value.
     * @returns The known value of a key, assuming that key exists.
     */
    public getItem(key: string): any {
        this.checkExistence(key);

        return this.items[key].getValue();
    }

    /**
     * Gets the value for a potentially unknown key.
     *
     * @param key   The key for a potentially unknown value.
     * @returns The settings for that particular key.
     */
    public getObject(key: string): any {
        return this.items[key];
    }

    /**
     * Checks whether a key exists.
     *
     * @param key   The key for a potentially known value.
     * @returns Whether there is a value under that key.
     */
    public hasKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    /**
     * Maps key names to their values.
     *
     * @returns A mapping of key names to the actual values of all objects being stored.
     */
    public exportItems(): any {
        const output: any = {};

        for (const i in this.items) {
            output[i] = this.items[i].getValue();
        }

        return output;
    }

    /**
     * Adds a new key & value pair to by linking to a newly created ItemValue.
     *
     * @param key   The key to reference by new ItemValue by.
     * @param settings   The settings for the new ItemValue.
     * @returns The newly created ItemValue.
     */
    public addItem(key: string, settings: any = {}): IItemValue {
        this.items[key] = new ItemValue(this, key, settings);
        this.itemKeys.push(key);
        return this.items[key];
    }

    /**
     * Clears a value from the listing, and removes its element from the
     * container (if they both exist).
     *
     * @param key   The key of the element to remove.
     */
    public removeItem(key: string): void {
        if (!this.items.hasOwnProperty(key)) {
            return;
        }

        this.itemKeys.splice(this.itemKeys.indexOf(key), 1);

        delete this.items[key];
        delete this.localStorage[this.prefix + key];
    }

    /**
     * Completely clears all values from the ItemsHoldr, removing their
     * elements from the container (if they both exist) as well.
     */
    public clear(): void {
        this.items = {};
        this.itemKeys = [];

        if (!this.settings.values) {
            return;
        }

        for (const key in this.settings.values) {
            if (this.settings.values.hasOwnProperty(key)) {
                this.addItem(key, this.settings.values[key]);
            }
        }
    }

    /**
     * Sets the value for the ItemValue under the given key, then updates the ItemValue
     * (including the ItemValue's element and localStorage, if needed).
     *
     * @param key   The key of the ItemValue.
     * @param value   The new value for the ItemValue.
     */
    public setItem(key: string, value: any): void {
        this.checkExistence(key);

        this.items[key].setValue(value);
    }

    /**
     * Increases the value for the ItemValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param key   The key of the ItemValue.
     * @param amount   The amount to increase by (by default, 1).
     */
    public increase(key: string, amount: number | string = 1): void {
        this.checkExistence(key);

        // tslint:disable-next-line restrict-plus-operands
        const value: number | string = this.items[key].getValue() + amount;

        this.items[key].setValue(value);
    }

    /**
     * Decreases the value for the ItemValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param key   The key of the ItemValue.
     * @param amount   The amount to decrease by (by default, 1).
     */
    public decrease(key: string, amount: number = 1): void {
        this.checkExistence(key);

        const value: number = this.items[key].getValue() - amount;

        this.items[key].setValue(value);
    }

    /**
     * Toggles whether a value is true or false.
     *
     * @param key   The key of the ItemValue.
     */
    public toggle(key: string): void {
        this.checkExistence(key);

        const value: any = this.items[key].getValue() ? false : true;

        this.items[key].setValue(value);
    }

    /**
     * Toggles this.autoSave.
     */
    public toggleAutoSave(): void {
        this.autoSave = !this.autoSave;
    }

    /**
     * Ensures a key exists in values. If it doesn't, and new values are
     * allowed, it creates it; otherwise, it throws an Error.
     *
     * @param key
     */
    public checkExistence(key: string): void {
        if (this.items.hasOwnProperty(key)) {
            return;
        }

        if (!this.allowNewItems) {
            throw new Error(`Unknown key given to ItemsHoldr: '${key}'.`);
        }

        this.addItem(key);
    }

    /**
     * Manually saves an item's value to localStorage, ignoring the autoSave flag.
     *
     * @param key   The key of the item to save.
     */
    public saveItem(key: string): void {
        if (!this.items.hasOwnProperty(key)) {
            throw new Error(`Unknown key given to ItemsHoldr: '${key}'.`);
        }

        this.items[key].updateLocalStorage(true);
    }

    /**
     * Manually saves all values to localStorage, ignoring the autoSave flag.
     */
    public saveAll(): void {
        for (const key in this.items) {
            this.items[key].updateLocalStorage(true);
        }
    }
}
