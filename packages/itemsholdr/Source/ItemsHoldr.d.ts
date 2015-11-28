declare module ItemsHoldr {
    /**
     * A mapping of ItemValue values to triggered callbacks.
     */
    export interface ITriggers {
        [i: string]: Function;
        [i: number]: Function;
    }

    /**
     * A container of default values to pass to IItemValues, keyed by the
     * IItemValue keys.m
     */
    export interface IItemValueDefaults {
        [i: string]: IItemValueSettings;
    }

    /**
     * Settings to initialize a new instance of the IItemValue interface.
     */
    export interface IItemValueSettings {
        /**
         * An initial value to store.
         */
        value?: any;
        
        /**
         * A default initial value to store, if value isn't provided.
         */
        valueDefault?: any;
        
        /**
         * Whether the value should be stored in the IItemHoldr's localStorage.
         */
        storeLocally?: boolean;
        
        /**
         * A mapping of values to callbacks that should be triggered when value
         * is equal to them.
         */
        triggers?: ITriggers;
        
        /**
         * Whether an Element should be created and synced to the value.
         */
        hasElement?: boolean;
        
        /**
         * An Element tag to use in creating the element, if hasElement is true.
         */
        elementTag?: string;
        
        /**
         * A minimum value for the value to equal, if value is a number.
         */
        minimum?: number;
        
        /**
         * A callback to call when the value reaches the minimum value.
         */
        onMinimum?: Function;
        
        /**
         * A maximum value for the value to equal, if value is a number.
         */
        maximum?: number;
        
        /**
         * A callback to call when the value reaches the maximum value.
         */
        onMaximum?: Function;
        
        /**
         * A maximum number to modulo the value against, if value is a number.
         */
        modularity?: number;
        
        /**
         * A callback to call when the value reaches modularity.
         */
        onModular?: Function;
        
        /**
         * A Function to transform the value when it's being set.
         */
        transformGet?: Function;
        
        /**
         * A Function to transform the value when it's being retrieved.
         */
        transformSet?: Function;
    }
    
    /**
     * Storage container for a single IItemsHoldr value. The value may have triggers
     * assigned to value, modularity, and other triggers, as well as an HTML element.
     */
    export interface IItemValue {
        /**
         * The container IItemsHoldr governing usage of this ItemsValue.
         */
        ItemsHolder: IItemsHoldr;
        
        /**
         * The unique key identifying this ItemValue in the ItemsHoldr.
         */
        key: string;
        
        /**
         * A default initial value to store, if value isn't provided.
         */
        valueDefault: any;
        
        /**
         * Whether the value should be stored in the ItemHoldr's localStorage.
         */
        storeLocally: boolean;
        
        /**
         * A mapping of values to callbacks that should be triggered when value
         * is equal to them.
         */
        triggers: ITriggers;
        
        /**
         * An HTML element whose second child's textContent is always set to that of the element.
         */
        element: HTMLElement;
        
        /**
         * Whether an Element should be created and synced to the value.
         */
        hasElement: boolean;
        
        /**
         * An Element tag to use in creating the element, if hasElement is true.
         */
        elementTag: string;
        
        /**
         * A maximum value for the value to equal, if value is a number.
         */
        maximum: number;
        
        /**
         * A callback to call when the value reaches the maximum value.
         */
        onMaximum: Function;
        
        /**
         * A minimum value for the value to equal, if value is a number.
         */
        minimum: number;
        
        /**
         * A callback to call when the value reaches the minimum value.
         */
        onMinimum: Function;
        
        /**
         * A maximum number to modulo the value against, if value is a number.
         */
        modularity: number;
        
        /**
         * A callback to call when the value reaches modularity.
         */
        onModular: Function;
        
        /**
         * A Function to transform the value when it's being set.
         */
        transformGet?: Function;
        
        /**
         * A Function to transform the value when it's being retrieved.
         */
        transformSet?: Function;
        
        /**
         * @returns The value being stored, with a transformGet applied if one exists.
         */
        getValue(): any;
        
        /**
         * Sets the value being stored, with a is a transformSet applied if one exists.
         * Any attached triggers to the new value will be called.
         *
         * @param value   The desired value to now store.
         */
        setValue(value: any): void;
        
        /**
         * General update Function to be run whenever the internal value is changed.
         * It runs all the trigger, modular, etc. checks, updates the HTML element
         * if there is one, and updates localStorage if needed.
         */
        update(): void;
        
        /**
         * Stores a ItemValue's value in localStorage under the prefix plus its key.
         * 
         * @param overrideAutoSave   Whether the policy on saving should be ignored
         *                           so saving happens regardless. By default, false.
         */
        updateLocalStorage(overrideAutoSave?: boolean): void;
    }

    /**
     * Settings to initialize a new instance of the IItemsHoldr interface.
     */
    export interface IItemsHoldrSettings {
        /**
         * Initial settings for IItemValues to store.
         */
        values?: IItemValueDefaults;
        
        /**
         * Whether new items are allowed to be added (by default, true).
         */
        allowNewItems?: boolean;
        
        /**
         * Whether values should be saved immediately upon being set.
         */
        autoSave?: boolean;
        
        /**
         * Arguments to pass to triggered callback Functions.
         */
        callbackArgs?: any[];
        
        /**
         * A localStorage object to use instead of the global localStorage.
         */
        localStorage?: any;
        
        /**
         * A prefix to add before IItemsValue keys
         */
        prefix?: string;
        
        /**
         * Default attributes for IItemValues.
         */
        defaults?: IItemValueDefaults;
        
        /**
         * Any hardcoded changes to element content.
         */
        displayChanges?: { [i: string]: string };
        
        /**
         * Whether an HTML container should be created to house the IItemValue elements.
         */
        doMakeContainer?: boolean;
        
        /**
         * Arguments to pass to create the container, if not the default div and className.
         */
        containersArguments?: [string, any][];
    }

    /**
     * A versatile container to store and manipulate values in localStorage, and 
     * optionally keep an updated HTML container showing these values.
     */
    export interface IItemsHoldr {
        /**
         * @returns The values contained within, keyed by their keys.
         */
        getValues(): { [i: string]: IItemValue };
        
        /**
         * @returns Default attributes for values.
         */
        getDefaults(): IItemValueDefaults;
        
        /**
         * @returns A reference to localStorage or a replacment object.
         */
        getLocalStorage(): Storage;
        
        /**
         * @returns Whether this should save changes to localStorage automatically.
         */
        getAutoSave(): boolean;
        
        /**
         * @returns The prefix to store thigns under in localStorage.
         */
        getPrefix(): string;
        
        /**
         * @returns The container HTML element, if it exists.
         */
        getContainer(): HTMLElement;
        
        /**
         * @returns createElement arguments for HTML containers, outside-to-inside.
         */
        getContainersArguments(): [string, any][];
        
        /**
         * @returns Any hard-coded changes to element content.
         */
        getDisplayChanges(): { [i: string]: string };
        
        /**
         * @returns Arguments to be passed to triggered event callbacks.
         */
        getCallbackArgs(): any[];
        
        /**
         * @returns String keys for each of the stored IItemValues.
         */
        getKeys(): string[];
        
        /**
         * @param key   The key for a known value.
         * @returns The known value of a key, assuming that key exists.
         */
        getItem(key: string): any;
        
        /**
         * @param key   The key for a known value.
         * @returns The settings for that particular key.
         */
        getObject(key: string): any;
        
        /**
         * @param key   The key for a potentially known value.
         * @returns Whether there is a value under that key.
         */
        hasKey(key: string): boolean;
        
        /**
         * @returns A mapping of key names to the actual values of all objects being stored.
         */
        exportItems(): any;
        
        /**
         * Adds a new key & value pair to by linking to a newly created ItemValue.
         * 
         * @param key   The key to reference by new ItemValue by.
         * @param settings   The settings for the new ItemValue.
         * @returns The newly created ItemValue.
         */
        addItem(key: string, settings: any): IItemValue;
        
        /**
         * Clears a value from the listing, and removes its element from the
         * container (if they both exist).
         * 
         * @param key   The key of the element to remove.
         */
        removeItem(key: string): void;
        
        /**
         * Completely clears all values from the ItemsHoldr, removing their
         * elements from the container (if they both exist) as well.
         */
        clear(): void;
        
        /**
         * Sets the value for the ItemValue under the given key, then updates the ItemValue
         * (including the ItemValue's element and localStorage, if needed).
         * 
         * @param key   The key of the ItemValue.
         * @param value   The new value for the ItemValue.
         */
        setItem(key: string, value: any): void;
        
        /**
         * Increases the value for the ItemValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         * 
         * @param key   The key of the ItemValue.
         * @param amount   The amount to increase by (by default, 1).
         */
        increase(key: string, amount?: number | string): void;
        
        /**
         * Increases the value for the ItemValue under the given key, via addition for
         * Numbers or concatenation for Strings.
         * 
         * @param key   The key of the ItemValue.
         * @param amount   The amount to increase by (by default, 1).
         */
        decrease(key: string, amount?: number): void;
        
        /**
         * Toggles whether a value is true or false.
         * 
         * @param key   The key of the ItemValue.
         */
        toggle(key: string): void;
        
        /**
         * Ensures a key exists in values. If it doesn't, and new values are
         * allowed, it creates it; otherwise, it throws an Error.
         * 
         * @param key
         */
        checkExistence(key: string): void;

        /**
         * Manually saves an item's value to localStorage, ignoring the autoSave flag.
         * 
         * @param key   The key of the item to save.
         */
        saveItem(key: string): void;

        /**
         * Manually saves all values to localStorage, ignoring the autoSave flag. 
         */
        saveAll(): void;
        
        /**
         * Hides the container Element by setting its visibility to hidden.
         */
        hideContainer(): void;
        
        /**
         * Shows the container Element by setting its visibility to visible.
         */
        displayContainer(): void;
        
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
        makeContainer(containers: [string, any][]): HTMLElement;
        
        /**
         * @returns Whether displayChanges has an entry for a particular value.
         */
        hasDisplayChange(value: string): boolean;
        
        /**
         * @returns The displayChanges entry for a particular value.
         */
        getDisplayChange(value: string): string;
        
        /**
         * Creates a new HTMLElement of the given type. For each Object given as
         * arguments after, each member is proliferated onto the element.
         * 
         * @param tag   The type of the HTMLElement (by default, "div").
         * @param args   Any number of Objects to be proliferated onto the 
         *               new HTMLElement.
         * @returns A newly created HTMLElement of the given tag.
         */
        createElement(tag?: string, ...args: any[]): HTMLElement;
        
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
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        
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
        proliferateElement(recipient: any, donor: any, noOverride?: boolean): any;
    }
}
