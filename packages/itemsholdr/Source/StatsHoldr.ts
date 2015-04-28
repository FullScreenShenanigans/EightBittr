interface IStatsValueSettings {
    value?: any;
    valueDefault?: any;
    hasElement?: boolean;
    element?: string;
    storeLocally?: boolean;
    triggers?: any;
    modularity?: number;
    onModular?: any;
    digits?: number;
    minimum?: number;
    onMinimum?: any;
    maximum?: number;
    onMaximum?: number;
}

interface IStatsHoldrSettings {
    prefix: string;
    proliferate: any;
    createElement: any;
    autoSave?: boolean;
    callbackArgs?: any[];
    localStorage?: any;
    defaults?: any;
    displayChanges?: any;
    values?: any;
    doMakeContainer?: boolean;
    containersArguments?: any[][]
}

class StatsValue {
    private StatsHolder: StatsHoldr;

    private key: string;

    private value: any;

    private valueDefault: any;

    private hasElement: boolean;

    private element: HTMLElement;

    private minimum: number;

    private maximum: number;

    private modularity: number;

    private triggers: any;

    private callbackArgs: any[];

    private onModular: Function;

    private onMinimum: Function;

    private onMaximum: Function;

    private storeLocally: boolean;

    /**
     * Creates a new StatsValue with the given key and settings. Defaults are given
     * to the value via proliferate before the settings.
     * 
     * @constructor
     * @param {StatsHoldr} StatsHolder   The container for this value.
     * @param {String} key   The key to reference this new StatsValue by.
     * @param {IStatsValueSettings} settings   Any optional custom settings.
     */
    constructor(StatsHolder: StatsHoldr, key: string, settings: any) {
        this.StatsHolder = StatsHolder;

        StatsHolder.proliferate(this, StatsHolder.getDefaults());
        StatsHolder.proliferate(this, settings);

        this.key = key;

        if (!this.hasOwnProperty("value")) {
            this.value = this.valueDefault;
        }

        if (this.hasElement) {
            this.element = StatsHolder.createElement(settings.element || "div", {
                className: StatsHolder.getPrefix() + "_value " + key
            });
            this.element.appendChild(StatsHolder.createElement("div", {
                "textContent": key
            }));
            this.element.appendChild(StatsHolder.createElement("div", {
                "textContent": this.value
            }));
        }

        if (this.storeLocally) {
            // If there exists an old version of this property, get it 
            if (StatsHolder.getLocalStorage().hasOwnProperty(StatsHolder.getPrefix() + key)) {
                this.value = this.retrieveLocalStorage();
            } else {
                // Otherwise save the new version to memory
                this.updateLocalStorage();
            }
        }
    }

    /**
     * General update Function to be run whenever the internal value is changed.
     * It runs all the trigger, modular, etc. checks, updates the HTML element
     * if there is one, and updates localStorage if needed.
     */
    update(): void {
        // Mins and maxes must be obeyed before any other considerations
        if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
            this.value = this.minimum;
            if (this.onMinimum) {
                this.onMinimum.apply(this, this.callbackArgs);
            }
        } else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
            this.value = this.maximum;
            if (this.onMaximum) {
                this.onMaximum.apply(this, this.callbackArgs);
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
     * Checks if the current value should trigger a callback, and if so calls 
     * it.
     * 
     * @this {StatsValue}
     */
    checkTriggers(): void {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value].apply(this, this.callbackArgs);
        }
    }

    /**
     * Checks if the current value is greater than the modularity (assuming
     * modular is a non-zero Numbers), and if so, continuously reduces value and 
     * calls this.onModular.
     * 
     * @this {StatsValue}
     */
    checkModularity(): void {
        if (this.value.constructor !== Number || !this.modularity) {
            return;
        }

        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.onModular) {
                this.onModular.apply(this, this.callbackArgs);
            }
        }
    }

    /**
     * Updates the StatsValue's element's second child to be the StatsValue's value.
     * 
     * @this {StatsValue}
     */
    updateElement(): void {
        if (this.StatsHolder.hasDisplayChange(this.value)) {
            this.element.children[1].textContent = this.StatsHolder.getDisplayChange(this.value);
        } else {
            this.element.children[1].textContent = this.value;
        }
    }

    /**
     * Retrieves a StatsValue's value from localStorage, making sure not to try to
     * JSON.parse an undefined or null value.
     * 
     * @return {Mixed}
     */
    retrieveLocalStorage(): void {
        var value: any = localStorage.getItem(this.StatsHolder.getPrefix() + this.key);

        switch (value) {
            case "undefined":
                return undefined;
            case "null":
                return null;
        }

        if (value.constructor !== String) {
            return value;
        }

        return JSON.parse(value);
    }

    /**
     * Stores a StatsValue's value in localStorage under the prefix plus its key.
     * 
     * @param {Boolean} [overrideAutoSave]   Whether the policy on saving should
     *                                       be ignored (so saving happens
     *                                       regardless). By default, false.
     */
    updateLocalStorage(overrideAutoSave: boolean = false): void {
        if (this.StatsHolder.getAutoSave() || overrideAutoSave) {
            this.StatsHolder.getLocalStorage()[this.StatsHolder.getPrefix() + this.key] = JSON.stringify(this.value);
        }
    }
}

/**
 * StatsHoldr
 * A versatile container to store and manipulate values in localStorage, and
 * optionally keep an updated HTML container showing these values. Operations 
 * such as setting, increasing/decreasing, and default values are all abstracted
 * automatically. StatsValues are stored in memory as well as in localStorage for
 * fast lookups.
 * Each StatsHoldr instance requires proliferate and createElement functions 
 * (such as those given by the EightBittr prototype).
 * 
 * @example
 * // Creating and using a StatsHoldr to store user statistics.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * console.log(StatsHolder.get("bestStage")); // "Middle"
 * console.log(StatsHolder.get("bestScore")); // "9001"
 * @example
 * // Creating and using a StatsHoldr to show user statistics in HTML elements.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "doMakeContainer": true,
 *     "containers": [
 *         ["table", {
 *             "id": "StatsOutside",
 *             "style": {
 *                 "textTransform": "uppercase"
 *             }
 *         }],
 *         ["tr", {
 *             "id": "StatsInside"
 *         }]
 *     ],
 *     "defaults": {
 *         "element": "td"
 *     },
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "hasElement": true,
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "hasElement": true,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * document.body.appendChild(StatsHolder.getContainer());
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class StatsHoldr {
    // The objects being stored, keyed as Object<Object>.
    private values: any;

    // Default attributes for value, as Object<Object>.
    private defaults: any;

    // A reference to localStorage or a replacement object.
    private localStorage: any;

    // Whether this should save changes to localStorage automatically
    private autoSave: boolean;

    // A prefix to store things under in localStorage.
    private prefix: string;

    // A container element containing children for each value's element.
    private container: any;

    // An Array of elements as createElement arguments, outside-to-inside.
    private containersArguments: any[][];

    // Any hard-coded changes to element content, such as "INF" for Infinity
    private displayChanges: any;

    // An Array of objects to be passed to triggered events.
    private callbackArgs: any[];

    /**
     * Resets the StatsHoldr.
     * 
     * @constructor
     * @param {String} prefix   A String prefix to prepend to key names in 
     *                          localStorage.
     * @param {Function} proliferate   A Function that takes in a recipient 
     *                                 Object and a donor Object, and copies
     *                                 attributes over. Generally given by
     *                                 EightBittr.prototype to minimize 
     *                                 duplicate code.
     * @param {Function} createElement   A Function to create an Element of a
     *                                   given String type and apply attributes
     *                                   from subsequent Objects. Generally 
     *                                   given by EightBittr.prototype to reduce
     *                                   duplicate code.
     * @param {Object} [values]   The keyed values to be stored, as well as all
     *                            associated information with them. The names of
     *                            values are keys in the values Object.
     * @param {Object} [localStorage]   A substitute for localStorage, generally
     *                                  used as a shim (defaults to window's 
     *                                  localStorage, or a new Object if that
     *                                  does not exist).
     * @param {Boolean} [autoSave]   Whether this should save changes to 
     *                               localStorage automatically (by default,
     *                               false).
     * @param {Boolean} [doMakeContainer]   Whether an HTML container with 
     *                                      children for each value should be
     *                                      made (defaults to false).
     * @param {Object} [defaults]   Default attributes for each value.
     * @param {Array} [callbackArgs]   Arguments to pass via Function.apply to 
     *                                 triggered callbacks (defaults to []).
     */
    constructor(settings: IStatsHoldrSettings = <IStatsHoldrSettings>{}) {
        var key: string;

        this.prefix = settings.prefix || "";
        this.autoSave = settings.autoSave;
        this.callbackArgs = settings.callbackArgs || [];

        if (settings.localStorage) {
            this.localStorage = settings.localStorage;
        } else if (typeof localStorage === "undefined") {
            this.localStorage = {};
        } else {
            this.localStorage = localStorage;
        }

        this.defaults = settings.defaults || {};
        this.displayChanges = settings.displayChanges || {};

        this.values = {};
        if (settings.values) {
            for (key in settings.values) {
                if (settings.values.hasOwnProperty(key)) {
                    this.addStatistic(key, settings.values[key]);
                }
            }
        }

        if (settings.doMakeContainer) {
            this.containersArguments = settings.containersArguments || [
                ["div", {
                    "className": this.prefix + "_container"
                }]
            ];
            this.container = this.makeContainer(settings.containersArguments);
        }
    }


    /* Simple gets
    */

    /**
     * @return {Mixed} The values contained within, keyed by their keys.
     */
    getValues(): any {
        return this.values;
    }

    /**
     * @return {Mixed} Default attributes for values.
     */
    getDefaults(): any {
        return this.defaults;
    }

    /**
     * @return {Mixed} A reference to localStorage or a replacment object.
     */
    getLocalStorage(): any {
        return this.localStorage;
    }

    /**
     * @return {Boolean} Whether this should save changes to localStorage 
     *                   automatically.
     */
    getAutoSave(): boolean {
        return this.autoSave;
    }

    /**
     * @return {String} The prefix to store thigns under in localStorage.
     */
    getPrefix(): string {
        return this.prefix;
    }

    /**
     * @return {HTMLElement} The container HTML element, if it exists.
     */
    getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * @return {Mixed[][]} The createElement arguments for the HTML container
     *                     elements, outside-to-inside.
     */
    getContainersArguments(): any[][] {
        return this.containersArguments;
    }

    /**
     * @return {Mixed} Any hard-coded changes to element content.
     */
    getDisplayChanges(): any {
        return this.displayChanges;
    }

    /**
     * @return {Mixed[]} Arguments to be passed to triggered events.
     */
    getCallbackArgs(): any[] {
        return this.callbackArgs;
    }


    /* Retrieval
    */

    /**
     * @return {String[]} The names of all value's keys.
     */
    getKeys(): string[] {
        return Object.keys(this.values);
    }

    /**
     * @param {String} key   The key for a known value.
     * @return {Mixed} The known value of a key, assuming that key exists.
     */
    get(key: string): any {
        this.checkExistence(key);

        return this.values[key].value;
    }

    /**
     * @param {String} key   The key for a known value.
     * @return {Object} The settings for that particular key.
     */
    getObject(key: string): any {
        return this.values[key];
    }

    /**
     * @param {String} key   The key for a potentially known value.
     * @return {Boolean} Whether there is a value under that key.
     */
    hasKey(key: string): boolean {
        return this.values.hasOwnProperty(key);
    }

    /**
     * @return {Object} The objects being stored.
     */
    getStatsValues(): any {
        return this.values;
    }

    /**
     * @return {Object} A mapping of key names to the actual values of all 
     *                  objects being stored.
     */
    export(): any {
        var output: any = {},
            i: string;

        for (i in this.values) {
            if (this.values.hasOwnProperty(i)) {
                output[i] = this.values[i].value;
            }
        }

        return output;
    }


    /* StatsValues
    */

    /**
     * Adds a new key & value pair to by linking to a newly created StatsValue.
     * 
     * @param {String} key   The key to reference by new StatsValue by.
     * @param {Object} settings   The settings for the new StatsValue.
     * @return {StatsValue} The newly created StatsValue.
     */
    addStatistic(key: string, settings: any): StatsValue {
        return this.values[key] = new StatsValue(this, key, settings);
    }


    /* Updating values
    */

    /**
     * Sets the value for the StatsValue under the given key, then updates the StatsValue
     * (including the StatsValue's element and localStorage, if needed).
     * 
     * @param {String} key   The key of the StatsValue.
     * @param {Mixed} value   The new value for the StatsValue.
     */
    set(key: string, value: any): void {
        this.checkExistence(key);

        this.values[key].value = <string>value;
        this.values[key].update();
    }

    /**
     * Increases the value for the StatsValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     * 
     * @param {String} key   The key of the StatsValue.
     * @param {Mixed} [amount]   The amount to increase by (by default, 1).
     */
    increase(key: string, amount: number | string = 1): void {
        this.checkExistence(key);

        this.values[key].value += arguments.length > 1 ? amount : 1;
        this.values[key].update();
    }

    /**
     * Increases the value for the StatsValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     * 
     * @param {String} key   The key of the StatsValue.
     * @param {Number} [amount]   The amount to increase by (by default, 1).
     */
    decrease(key: string, amount: number = 1): void {
        this.checkExistence(key);

        this.values[key].value -= amount;
        this.values[key].update();
    }

    /**
     * Toggles whether a value is 1 or 0.
     * 
     * @param {String} key   The key of the StatsValue.
     */
    toggle(key: string): void {
        this.checkExistence(key);
        this.values[key].value = this.values[key].value ? 0 : 1;
        this.values[key].update();
    }

    /**
     * Ensures a key exists in values, and throws an Error if it doesn't.
     * 
     * @param {String} key
     */
    checkExistence(key: string): void {
        if (!this.values.hasOwnProperty(key)) {
            throw new Error("Unknown key given to StatsHoldr: '" + key + "'.");
        }
    }

    /**
     * Manually saves all values to localStorage, ignoring the autoSave flag. 
     */
    saveAll(): void {
        for (var key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                this.values[key].updateLocalStorage(true);
            }
        }
    }


    /* HTML helpers
    */

    /**
     * Hides the container Element by setting its visibility to hidden.
     */
    hideContainer(): void {
        this.container.style.visibility = "hidden";
    }

    /**
     * Shows the container Element by setting its visibility to visible.
     */
    displayContainer(): void {
        this.container.style.visibility = "visible";
    }

    /**
     * Creates the container Element, which contains a child for each StatsValue that
     * specifies hasElement to be true.
     * 
     * @param {Mixed[][]} containers   An Array representing the Element to be
     *                                 created and the children between it and 
     *                                 the contained StatsValues. Each contained 
     *                                 Mixed[]  has a String tag name as its 
     *                                 first member, followed by any number of 
     *                                 Objects to apply via createElement.
     * @return {HTMLElement}
     */
    makeContainer(containers: any[][]): HTMLElement {
        var output: HTMLElement = this.createElement.apply(this, containers[0]),
            current: HTMLElement = output,
            child: HTMLElement,
            key: string,
            i: number;

        for (i = 1; i < containers.length; ++i) {
            child = this.createElement.apply(this, containers[i]);
            current.appendChild(child);
            current = child;
        }

        for (key in this.values) {
            if (this.values[key].hasElement) {
                child.appendChild(this.values[key].element);
            }
        }

        return output;
    }

    /**
     * @return {Boolean} Whether displayChanges has an entry for a particular
     *                   value.
     */
    hasDisplayChange(value: string): boolean {
        return this.displayChanges.hasOwnProperty(value);
    }

    /**
     * @return {String} The displayChanges entry for a particular value.
     */
    getDisplayChange(value: string): string {
        return this.displayChanges[value];
    }


    /* Utilities
    */

    createElement(tag: string = undefined, ...args: any[]): HTMLElement {
        var element: HTMLElement = document.createElement(tag),
            i: number;

        // For each provided object, add those settings to the element
        for (i = 0; i < args.length; i += 1) {
            this.proliferate(element, args[i]);
        }

        return element;
    }

    proliferate(recipient: any, donor: any, noOverride: boolean = false): any {
        var setting: any,
            i: string;

        // For each attribute of the donor:
        for (i in donor) {
            if (donor.hasOwnProperty(i)) {
                // If noOverride, don't override already existing properties
                if (noOverride && recipient.hasOwnProperty(i)) {
                    continue;
                }

                // If it's an object, recurse on a new version of it
                setting = donor[i];
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
        }
        return recipient;
    }


}
