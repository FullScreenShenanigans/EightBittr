import { IItemsHoldr } from "./IItemsHoldr";
import { IItemValue, ITriggers } from "./IItemValue";

/**
 * Storage container for a single ItemsHoldr value. The value may have triggers
 * assigned to value, modularity, and other triggers, as well as an HTML element.
 */
export class ItemValue implements IItemValue {
    /**
     * The container ItemsHoldr governing usage of this ItemsValue.
     */
    private ItemsHolder: IItemsHoldr;

    /**
     * The unique key identifying this ItemValue in the ItemsHoldr.
     */
    private key: string;

    /**
     * A default initial value to store, if value isn't provided.
     */
    private valueDefault: any;

    /**
     * Whether the value should be stored in the ItemHoldr's localStorage.
     */
    private storeLocally: boolean;

    /**
     * A mapping of values to callbacks that should be triggered when value
     * is equal to them.
     */
    private triggers: ITriggers;

    /**
     * An HTML element whose second child's textContent is always set to that of the element.
     */
    private element: HTMLElement;

    /**
     * Whether an Element should be created and synced to the value.
     */
    private hasElement: boolean;

    /**
     * An Element tag to use in creating the element, if hasElement is true.
     */
    private elementTag: string;

    /**
     * A minimum value for the value to equal, if value is a number.
     */
    private minimum: number;

    /**
     * A callback to call when the value reaches the minimum value.
     */
    private onMinimum: Function;

    /**
     * A maximum value for the value to equal, if value is a number.
     */
    private maximum: number;

    /**
     * A callback to call when the value reaches the maximum value.
     */
    private onMaximum: Function;

    /**
     * A maximum number to modulo the value against, if value is a number.
     */
    private modularity: number;

    /**
     * A callback to call when the value reaches modularity.
     */
    private onModular: Function;

    /**
     * A Function to transform the value when it's being set.
     */
    private transformGet: Function;

    /**
     * A Function to transform the value when it's being retrieved.
     */
    private transformSet: Function;

    /**
     * The value being stored.
     */
    private value: any;

    /**
     * Creates a new ItemValue with the given key and settings. Defaults are given
     * to the value via proliferate before the settings.
     *
     * @constructor
     * @param ItemsHolder   The container for this value.
     * @param key   The key to reference this new ItemValue by.
     * @param settings   Any optional custom settings.
     */
    public constructor(ItemsHolder: IItemsHoldr, key: string, settings: any = {}) {
        this.ItemsHolder = ItemsHolder;

        ItemsHolder.proliferate(this, ItemsHolder.getDefaults());
        ItemsHolder.proliferate(this, settings);

        this.key = key;

        if (!this.hasOwnProperty("value")) {
            this.value = this.valueDefault;
        }

        if (this.hasElement) {
            this.element = ItemsHolder.createElement(this.elementTag || "div", {
                className: ItemsHolder.getPrefix() + "_value " + key
            });
            this.element.appendChild(ItemsHolder.createElement("div", {
                "textContent": key
            }));
            this.element.appendChild(ItemsHolder.createElement("div", {
                "textContent": this.value
            }));
        }

        if (this.storeLocally) {
            // If there exists an old version of this property, get it
            if (ItemsHolder.getLocalStorage().hasOwnProperty(ItemsHolder.getPrefix() + key)) {
                this.value = this.retrieveLocalStorage();
                this.update();
            } else {
                // Otherwise save the new version to memory
                this.updateLocalStorage();
            }
        }
    }

    /**
     * @returns The value being stored, with a transformGet applied if one exists.
     */
    public getValue(): any {
        if (this.transformGet) {
            return this.transformGet(this.value);
        }

        return this.value;
    }

    /**
     * Sets the value being stored, with a is a transformSet applied if one exists.
     * Any attached triggers to the new value will be called.
     *
     * @param value   The desired value to now store.
     */
    public setValue(value: any): void {
        if (this.transformSet) {
            this.value = this.transformSet(value);
        } else {
            this.value = value;
        }

        this.update();
    }

    /**
     * @returns The stored HTML element, if it exists.
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * General update Function to be run whenever the internal value is changed.
     * It runs all the trigger, modular, etc. checks, updates the HTML element
     * if there is one, and updates localStorage if needed.
     */
    public update(): void {
        // Mins and maxes must be obeyed before any other considerations
        if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
            this.value = this.minimum;
            if (this.onMinimum) {
                this.onMinimum.apply(this, this.ItemsHolder.getCallbackArgs());
            }
        } else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
            this.value = this.maximum;
            if (this.onMaximum) {
                this.onMaximum.apply(this, this.ItemsHolder.getCallbackArgs());
            }
        }

        if (this.modularity) {
            this.checkModularity();
        }

        if (this.triggers) {
            this.checkTriggers();
        }

        if (this.hasElement) {
            this.updateElement();
        }

        if (this.storeLocally) {
            this.updateLocalStorage();
        }
    }

    /**
     * Stores a ItemValue's value in localStorage under the prefix plus its key.
     *
     * @param [overrideAutoSave]   Whether the policy on saving should be
     *                             ignored (so saving happens regardless). By
     *                             default, false.
     */
    public updateLocalStorage(overrideAutoSave?: boolean): void {
        if (overrideAutoSave || this.ItemsHolder.getAutoSave()) {
            this.ItemsHolder.getLocalStorage()[this.ItemsHolder.getPrefix() + this.key] = JSON.stringify(this.value);
        }
    }

    /**
     * Checks if the current value should trigger a callback, and if so calls it.
     */
    private checkTriggers(): void {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value].apply(this, this.ItemsHolder.getCallbackArgs());
        }
    }

    /**
     * Checks if the current value is greater than the modularity (assuming
     * modular is a non-zero Numbers), and if so, continuously reduces value and
     * calls this.onModular.
     */
    private checkModularity(): void {
        if (this.value.constructor !== Number || !this.modularity) {
            return;
        }

        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.onModular) {
                this.onModular.apply(this, this.ItemsHolder.getCallbackArgs());
            }
        }
    }

    /**
     * Updates the ItemValue's element's second child to be the ItemValue's value.
     */
    private updateElement(): void {
        if (this.ItemsHolder.hasDisplayChange(this.value)) {
            this.element.children[1].textContent = this.ItemsHolder.getDisplayChange(this.value);
        } else {
            this.element.children[1].textContent = this.value;
        }
    }

    /**
     * Retrieves a ItemValue's value from localStorage, making sure not to try to
     * JSON.parse an undefined or null value.
     *
     * @returns {Mixed}
     */
    private retrieveLocalStorage(): any {
        const value: any = this.ItemsHolder.getLocalStorage()[this.ItemsHolder.getPrefix() + this.key];

        if (typeof value === "undefined" || value === "undefined") {
            return undefined;
        }

        if (value.constructor !== String) {
            return value;
        }

        return JSON.parse(value);
    }
}
