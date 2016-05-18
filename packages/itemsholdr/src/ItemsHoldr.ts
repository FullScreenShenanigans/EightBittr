import { IItemsHoldr, IItemsHoldrSettings } from "./IItemsHoldr";
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
    private settings: IItemsHoldrSettings;

    /**
     * The ItemValues being stored, keyed by name.
     */
    private items: {
        [i: string]: IItemValue
    };

    /**
     * A listing of all the String keys for the stored items.
     */
    private itemKeys: string[];

    /**
     * Default attributes for ItemValues.
     */
    private defaults: IItemValueDefaults;

    /**
     * A reference to localStorage or a replacement object.
     */
    private localStorage: Storage;

    /**
     * A prefix to store things under in localStorage.
     */
    private prefix: string;

    /**
     * Whether new items are allowed to be created using setItem.
     */
    private allowNewItems: boolean;

    /**
     * Whether this should save changes to localStorage automatically.
     */
    private autoSave: boolean;

    /**
     * A container element containing children for each value's element.
     */
    private container: HTMLElement;

    /**
     * An Array of elements as createElement arguments, outside-to-inside.
     */
    private containersArguments: [string, any][];

    /**
     * Any hardcoded changes to element content, such as "INF" for Infinity.
     */
    private displayChanges: { [i: string]: string };

    /**
     * Arguments to be passed to triggered callback Functions.
     */
    private callbackArgs: any[];

    /**
     * Initializes a new instance of the ItemsHoldr class.
     * 
     * @param settings   Any optional custom settings.
     */
    constructor(settings: IItemsHoldrSettings = {}) {
        this.settings = settings;
        this.prefix = settings.prefix || "";
        this.autoSave = settings.autoSave;
        this.callbackArgs = settings.callbackArgs || [];

        this.allowNewItems = settings.allowNewItems === undefined
            ? true : settings.allowNewItems;

        if (settings.localStorage) {
            this.localStorage = settings.localStorage;
        } else if (typeof localStorage === "undefined") {
            this.localStorage = this.createPlaceholderStorage();
        } else {
            this.localStorage = localStorage;
        }

        this.defaults = settings.defaults || {};
        this.displayChanges = settings.displayChanges || {};

        this.resetItemsToDefaults();

        if (settings.doMakeContainer) {
            this.containersArguments = settings.containersArguments || [
                ["div", {
                    "className": this.prefix + "_container"
                }]
            ];
            this.container = this.makeContainer(settings.containersArguments);
        }
    }

    /**
     * @returns The indexed key.
     */
    public key(index: number): string {
        return this.itemKeys[index];
    }

    /**
     * @returns The values contained within, keyed by their keys.
     */
    public getValues(): { [i: string]: IItemValue } {
        return this.items;
    }

    /**
     * @returns {Mixed} Default attributes for values.
     */
    public getDefaults(): any {
        return this.defaults;
    }

    /**
     * @returns A reference to localStorage or a replacment object.
     */
    public getLocalStorage(): Storage {
        return this.localStorage;
    }

    /**
     * @returns Whether this should save changes to localStorage automatically.
     */
    public getAutoSave(): boolean {
        return this.autoSave;
    }

    /**
     * @returns The prefix to store thigns under in localStorage.
     */
    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * @returns The container HTML element, if it exists.
     */
    public getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * @returns createElement arguments for HTML containers, outside-to-inside.
     */
    public getContainersArguments(): [string, any][] {
        return this.containersArguments;
    }

    /**
     * @returns Any hard-coded changes to element content.
     */
    public getDisplayChanges(): { [i: string]: string } {
        return this.displayChanges;
    }

    /**
     * @returns Arguments to be passed to triggered event callbacks.
     */
    public getCallbackArgs(): any[] {
        return this.callbackArgs;
    }

    /**
     * @returns String keys for each of the stored ItemValues.
     */
    public getKeys(): string[] {
        return Object.keys(this.items);
    }

    /**
     * @param key   The key for a known value.
     * @returns The known value of a key, assuming that key exists.
     */
    public getItem(key: string): any {
        this.checkExistence(key);

        return this.items[key].getValue();
    }

    /**
     * @param key   The key for a known value.
     * @returns The settings for that particular key.
     */
    public getObject(key: string): any {
        return this.items[key];
    }

    /**
     * @param key   The key for a potentially known value.
     * @returns Whether there is a value under that key.
     */
    public hasKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    /**
     * @returns A mapping of key names to the actual values of all objects being stored.
     */
    public exportItems(): any {
        const output: any = {};

        for (let i in this.items) {
            if (this.items.hasOwnProperty(i)) {
                output[i] = this.items[i].getValue();
            }
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

        if (this.container && this.items[key].getElement() !== undefined) {
            this.container.removeChild(this.items[key].getElement());
        }

        this.itemKeys.splice(this.itemKeys.indexOf(key), 1);

        delete this.items[key];
    }

    /**
     * Completely clears all values from the ItemsHoldr, removing their
     * elements from the container (if they both exist) as well.
     */
    public clear(): void {
        if (this.container) {
            for (let i in this.items) {
                if (this.items[i].getElement() !== undefined) {
                    this.container.removeChild(this.items[i].getElement());
                }
            }
        }

        this.resetItemsToDefaults();
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

        const value: number | string = this.items[key].getValue() + amount;

        this.items[key].setValue(value);
    }

    /**
     * Increases the value for the ItemValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     * 
     * @param key   The key of the ItemValue.
     * @param amount   The amount to increase by (by default, 1).
     */
    public decrease(key: string, amount: number = 1): void {
        this.checkExistence(key);

        let value: number = this.items[key].getValue() - amount;

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
            throw new Error("Unknown key given to ItemsHoldr: '" + key + "'.");
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
            throw new Error("Unknown key given to ItemsHoldr: '" + key + "'.");
        }

        this.items[key].updateLocalStorage(true);
    }

    /**
     * Manually saves all values to localStorage, ignoring the autoSave flag. 
     */
    public saveAll(): void {
        for (let key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                this.items[key].updateLocalStorage(true);
            }
        }
    }

    /**
     * Hides the container Element by setting its visibility to hidden.
     */
    public hideContainer(): void {
        this.container.style.visibility = "hidden";
    }

    /**
     * Shows the container Element by setting its visibility to visible.
     */
    public displayContainer(): void {
        this.container.style.visibility = "visible";
    }

    /**
     * Creates the container Element, which contains a child for each ItemValue that
     * specifies hasElement to be true.
     * 
     * @param containers   An Array representing the Element to be created and the
     *                     children between it and the contained ItemValues. 
     *                     Each contained Object has a String tag name as its 
     *                     first member, followed by any number of Objects to apply 
     *                     via createElement.
     * @returns A newly created Element that can be used as a container.
     */
    public makeContainer(containers: [string, any][]): HTMLElement {
        const output: HTMLElement = this.createElement.apply(this, containers[0]);
        let lastElement: HTMLElement = output;

        for (let i = 1; i < containers.length; i += 1) {
            const child = this.createElement.apply(this, containers[i]);
            lastElement.appendChild(child);
            lastElement = child;
        }

        for (let key in this.items) {
            if (this.items[key].getElement() !== undefined) {
                lastElement.appendChild(this.items[key].getElement());
            }
        }

        return output;
    }

    /**
     * @returns Whether displayChanges has an entry for a particular value.
     */
    public hasDisplayChange(value: string): boolean {
        return this.displayChanges.hasOwnProperty(value);
    }

    /**
     * @returns The displayChanges entry for a particular value.
     */
    public getDisplayChange(value: string): string {
        return this.displayChanges[value];
    }

    /**
     * Creates a new HTMLElement of the given type. For each Object given as
     * arguments after, each member is proliferated onto the element.
     * 
     * @param tag   The type of the HTMLElement (by default, "div").
     * @param args   Any number of Objects to be proliferated onto the 
     *               new HTMLElement.
     * @returns A newly created HTMLElement of the given tag.
     */
    public createElement(tag: string = "div", ...args: any[]): HTMLElement {
        const element: HTMLElement = document.createElement(tag);

        // For each provided object, add those settings to the element
        for (let i = 0; i < args.length; i += 1) {
            this.proliferateElement(element, args[i]);
        }

        return element;
    }

    /**
     * Proliferates all members of the donor to the recipient recursively, as
     * a deep copy.
     * 
     * @param recipient   An object receiving the donor's members.
     * @param donor   An object whose members are copied to recipient.
     * @param noOverride   If recipient properties may be overriden (by 
     *                     default, false).
     * @returns The recipient, which should have the donor proliferated onto it.
     */
    public proliferate(recipient: any, donor: any, noOverride?: boolean): any {
        // For each attribute of the donor:
        for (let i in donor) {
            if (!donor.hasOwnProperty(i)) {
                continue;
            }

            // If noOverride, don't override already existing properties
            if (noOverride && recipient.hasOwnProperty(i)) {
                continue;
            }

            // If it's an object, recurse on a new version of it
            const setting = donor[i];
            if (typeof setting === "object") {
                if (!recipient.hasOwnProperty(i)) {
                    recipient[i] = new setting.constructor();
                }
                this.proliferate(recipient[i], setting, noOverride);
            } else {
                // Regular primitives are easy to copy otherwise
                recipient[i] = setting;
            }
        }

        return recipient;
    }

    /**
     * Identical to proliferate, but tailored for HTML elements because many
     * element attributes don't play nicely with JavaScript Array standards. 
     * Looking at you, HTMLCollection!
     * 
     * @param recipient   An HTMLElement receiving the donor's members.
     * @param donor   An object whose members are copied to recipient.
     * @param noOverride   If recipient properties may be overriden (by 
     *                     default, false).
     * @returns The recipient, which should have the donor proliferated onto it.
     */
    public proliferateElement(recipient: any, donor: any, noOverride?: boolean): HTMLElement {
        // For each attribute of the donor:
        for (let i in donor) {
            if (!donor.hasOwnProperty(i)) {
                continue;
            }

            // If noOverride, don't override already existing properties
            if (noOverride && recipient.hasOwnProperty(i)) {
                continue;
            }

            const setting = donor[i];

            // Special cases for HTML elements
            switch (i) {
                // Children and options: just append all of them directly
                case "children":
                case "options":
                    if (typeof (setting) !== "undefined") {
                        for (let j = 0; j < setting.length; j += 1) {
                            recipient.appendChild(setting[j]);
                        }
                    }
                    break;

                // Style: proliferate (instead of making a new Object)
                case "style":
                    this.proliferate(recipient[i], setting);
                    break;

                // By default, use the normal proliferate logic
                default:
                    // If it's an object, recurse on a new version of it
                    if (typeof setting === "object") {
                        if (!recipient.hasOwnProperty(i)) {
                            recipient[i] = new setting.constructor();
                        }
                        this.proliferate(recipient[i], setting, noOverride);
                    } else {
                        // Regular primitives are easy to copy otherwise
                        recipient[i] = setting;
                    }
                    break;
            }
        }

        return recipient;
    }

    /**
     * Creates an Object that can be used to create a new LocalStorage
     * replacement, if the JavaScript environment doesn't have one.
     * 
     * @returns {Object}
     */
    private createPlaceholderStorage(): Storage {
        const output: any = {
            keys: [],
            getItem: (key: string): any => {
                return this.localStorage[key];
            },
            setItem: (key: string, value: string): void => {
                this.localStorage[key] = value;
            },
            clear: (): void => {
                for (let i in this) {
                    if (this.hasOwnProperty(i)) {
                        delete (this as any)[i];
                    }
                }
            },
            removeItem: (key: string): void => {
                delete (this as any)[key];
            },
            key: function (index: number): string {
                return this.keys[index];
            }
        };

        Object.defineProperties(output, {
            length: {
                get: (): number => output.keys.length
            },
            remainingSpace: {
                get: (): number => 9001
            }
        });

        return output;
    }

    /**
     * Resets this.items to their default values and resets this.itemKeys.
     */
    private resetItemsToDefaults(): void {
        this.items = {};

        if (!this.settings.values) {
            this.itemKeys = [];
            return;
        }

        this.itemKeys = Object.keys(this.settings.values);

        for (let key in this.settings.values) {
            if (this.settings.values.hasOwnProperty(key)) {
                this.addItem(key, this.settings.values[key]);
            }
        }
    }
}
