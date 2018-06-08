import { IItemSettings, ITriggers } from "./IItemsHoldr";
import { proliferate } from "./proliferate";

/**
 * Settings to initialize a new ItemContainer.
 */
export interface IItemContainerSettings<TItem = any> {
    /**
     * Whether this should save changes to localStorage automatically.
     */
    autoSave: boolean;

    /**
     * Default attributes for items.
     */
    defaults: IItemSettings<TItem>;

    /**
     * A prefix to store things under in localStorage.
     */
    prefix: string;

    /**
     * A reference to localStorage or a replacement object.
     */
    storage: Storage;
}

/**
 * Storage container for a single ItemsHoldr value.
 */
export class ItemContainer<TItem = any> {
    /**
     * Settings used for initialization.
     */
    private readonly settings: IItemContainerSettings;

    /**
     * The unique key identifying this ItemValue in the ItemsHoldr.
     */
    private readonly key: string;

    /**
     * A default initial value to store, if value isn't provided.
     */
    private readonly valueDefault: TItem;

    /**
     * A mapping of values to callbacks that should be triggered when value
     * is equal to them.
     */
    private readonly triggers: ITriggers;

    /**
     * A minimum value for the value to equal, if value is a number.
     */
    private readonly minimum: number;

    /**
     * A callback to call when the value reaches the minimum value.
     */
    private readonly onMinimum: Function | undefined;

    /**
     * A maximum value for the value to equal, if value is a number.
     */
    private readonly maximum: number;

    /**
     * A callback to call when the value reaches the maximum value.
     */
    private readonly onMaximum: Function | undefined;

    /**
     * A maximum number to modulo the value against, if value is a number.
     */
    private readonly modularity: number;

    /**
     * A callback to call when the value reaches modularity.
     */
    private readonly onModular: Function;

    /**
     * The value being stored.
     */
    private value: any;

    /**
     * Creates a new ItemValue with the given key and settings. Defaults are given
     * to the value via proliferate before the settings.
     *
     * @param itemsHolder   The container for this value.
     * @param key   The key to reference this new ItemValue by.
     * @param item   Any custom settings for the value.
     */
    public constructor(settings: IItemContainerSettings, key: string, item: IItemSettings<TItem> = {}) {
        this.settings = settings;

        proliferate(this, settings.defaults);
        proliferate(this, item);

        this.key = key;

        if (!this.hasOwnProperty("value")) {
            this.value = this.valueDefault;
        }

        // If there exists an old version of this property, get it
        if ({}.hasOwnProperty.call(settings.storage, `${settings.prefix}${key}`)) {
            this.value = this.retrieveLocalStorage();
            this.update();
        } else {
            // Otherwise save the new version to memory
            this.updateStorage();
        }
    }

    /**
     * Gets the stored value.
     *
     * @returns The value being stored.
     */
    public getValue(): any {
        return this.value;
    }

    /**
     * Sets the value being stored.
     *
     * @param value   New value to store.
     */
    public setValue(value: any): void {
        this.value = value;
        this.update();
    }

    /**
     * General update Function to be run whenever the internal value is changed.
     */
    public update(): void {
        // Mins and maxes must be obeyed before any other considerations
        if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
            this.value = this.minimum;
            if (this.onMinimum !== undefined) {
                this.onMinimum();
            }
        } else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
            this.value = this.maximum;
            if (this.onMaximum !== undefined) {
                this.onMaximum();
            }
        }

        if (this.modularity) {
            this.checkModularity();
        }

        if (this.triggers) {
            this.checkTriggers();
        }

        this.updateStorage();
    }

    /**
     * Stores a ItemValue's value in localStorage under the prefix plus its key.
     *
     * @param overrideAutoSave   Whether the policy on saving should be
     *                           ignored (so saving happens regardless). By
     *                           default, false.
     */
    public updateStorage(overrideAutoSave?: boolean): void {
        if (overrideAutoSave || this.settings.autoSave) {
            this.settings.storage.setItem(`${this.settings.prefix}${this.key}`, JSON.stringify(this.value));
        }
    }

    /**
     * Checks if the current value should trigger a callback, and if so calls it.
     */
    private checkTriggers(): void {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value](this.value);
        }
    }

    /**
     * Checks if the current value is greater than the modularity (assuming
     * modular is a non-zero Numbers), and if so, continuously reduces value and
     * calls this.onModular.
     */
    private checkModularity(): void {
        if (typeof this.value !== "number" || !this.modularity) {
            return;
        }

        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.onModular) {
                this.onModular();
            }
        }
    }

    /**
     * Retrieves a ItemValue's value from localStorage, making sure not to try to
     * JSON.parse an undefined or null value.
     */
    private retrieveLocalStorage(): any {
        const value: any = this.settings.storage.getItem(`${this.settings.prefix}${this.key}`);

        if (value === undefined || value === "undefined") {
            return undefined;
        }

        if (typeof value !== "string") {
            return value;
        }

        return JSON.parse(value);
    }
}
