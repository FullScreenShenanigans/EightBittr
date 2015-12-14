declare module GroupHoldr {
    /**
     * An Object group containing objects of type T.
     * 
     * @param T   The type of values contained within the group.
     */
    export interface IGroupHoldrObjectGroup<T> {
        [i: string]: T;
    }

    /**
     * Stored object groups, keyed by name.
     */
    export interface IGroupHoldrGroups<T> {
        [i: string]: IGroupHoldrObjectGroup<T> | T[];
    }

    /**
     * Types for stored object groups, as Array or Object.
     */
    export interface IGroupHoldrTypesListing {
        [i: string]: (...args: any[]) => void;
    }

    /**
     * Abstract parent interface of all group Functions.
     */
    export interface IGroupHoldrFunction extends Function { }

    /**
     * Stores the given group internally.
     * 
     * @param value   The new group to store.
     */
    export interface IGroupHoldrSetGroupFunction<T> extends IGroupHoldrFunction {
        (value: IGroupHoldrObjectGroup<T> | T[]): void;
    }

    /**
     * @returns One of the stored groups.
     */
    export interface IGroupHoldrGetGroupFunction<T> extends IGroupHoldrFunction {
        (): IGroupHoldrObjectGroup<T> | T[];
    }

    /**
     * Sets a value in a group.
     *
     * @param key   The key to store the value under.
     * @param [value]   The value to store in the group.
     */
    export interface IGroupHoldrSetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }

    /**
     * Retrieves a value from a group.
     * 
     * @param key   The key the value is stored under.
     */
    export interface IGroupHoldrGetFunction extends IGroupHoldrFunction {
        (key: string | number): void;
    }

    /**
     * Adds a value to a group.
     * 
     * @param value   The value to store in the group.
     * @param [key]   The key to store the value under.
     * @remarks If the group is an Array, not providing a key will use Array::push.
     */
    export interface IGroupHoldrAddFunction extends IGroupHoldrFunction {
        (value: any, key?: string | number): void;
    }

    /**
     * Adds a value to an Array group.
     * 
     * @param value   The value to store in the group.
     * @param [key]   The index to store the value under.
     */
    export interface IGroupHoldrArrayAddFunction extends IGroupHoldrAddFunction {
        (value: any, key?: number): void;
    }

    /**
     * Adds a value to an Object group.
     * 
     * @param value   The value to store in the group.
     * @param key   The key to store the value under.
     */
    export interface IGroupHoldrObjectAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: string): void;
    }

    /**
     * Deletes a value from a group.
     * 
     * @param [arg1]   Either the value (Arrays) or the key (Objects).
     * @param [arg2]   Optionally, for Array groups, the value's index.
     */
    export interface IGroupHoldrDeleteFunction extends IGroupHoldrFunction {
        (arg1?: any, arg2?: any): void;
    }

    /**
     * Deletes a value from an Array group.
     * 
     * @param [value]   The value to delete, if index is not provided.
     * @param [index]   The index of the value, to bypass Array::indexOf.
     */
    export interface IGroupHoldrArrayDeleteFunction extends IGroupHoldrDeleteFunction {
        (value?: any, index?: number): void;
    }

    /**
     * Deletes a value from an Object group.
     *
     * @param key   The key of the value to delete.
     */
    export interface IGroupHoldrObjectDeleteFunction extends IGroupHoldrDeleteFunction {
        (key: string): void;
    }

    /**
     * Storage for Function groups of a single group, keyed by their operation.
     */
    export interface IGroupHoldrFunctionGroup<T extends IGroupHoldrFunction> {
        [i: string]: T;
    }

    /**
     * Storage for Function groups, keyed by their operation.
     */
    export interface IGroupHoldrFunctionGroups {
        /**
         * Setter Functions for each group, keyed by their group name.
         */
        setGroup: IGroupHoldrFunctionGroup<IGroupHoldrSetGroupFunction<any>>;
        
        /**
         * Getter Functions for each group, keyed by their group name.
         */
        getGroup: IGroupHoldrFunctionGroup<IGroupHoldrGetGroupFunction<any>>;
        
        /**
         * Value setter Functions for each group, keyed by their group name.
         */
        set: IGroupHoldrFunctionGroup<IGroupHoldrSetFunction>;
        
        /**
         * Value getter Functions for each group, keyed by their group name.
         */
        get: IGroupHoldrFunctionGroup<IGroupHoldrGetFunction>;
        
        /**
         * Value adder Functions for each group, keyed by their group name.
         */
        add: IGroupHoldrFunctionGroup<IGroupHoldrAddFunction>;
        
        /**
         * Valuer deleter Functions for each group, keyed by their group name.
         */
        delete: IGroupHoldrFunctionGroup<IGroupHoldrDeleteFunction>;
    }

    /**
     * Settings to initialize a new IGroupHoldr.
     */
    export interface IGroupHoldrSettings {
        /**
         * The names of groups to be creaed.
         */
        groupNames: string[];

        /**
         * The mapping of group types. This can be a single String ("Array" or
         * "Object") to set each one, or an Object mapping each groupName to 
         * a different String (type).
         */
        groupTypes: string | {
            [i: string]: string;
        };
    }

    /**
     * A general storage container for values in keyed Arrays and/or Objects.
     * Manipulation utlities are provided for adding, removing, switching, and
     * applying methods to values.
     */
    export interface IGroupHoldr {
        /**
         * @returns The mapping of operation types to each group's Functions.
         */
        getFunctions(): IGroupHoldrFunctionGroups;

        /**
         * @returns The stored object groups, keyed by name.
         */
        getGroups(): IGroupHoldrGroups<any>;

        /**
         * @param name   The name of the group to retrieve.
         * @returns The group stored under the given name.
         */
        getGroup(name: string): { [i: string]: any } | any[];

        /**
         * @returns Names of the stored object groups.
         */
        getGroupNames(): string[];

        /**
         * Switches an object from one group to another.
         * 
         * @param value   The value being moved from one group to another.
         * @param groupNameOld   The name of the group to move out of.
         * @param groupNameNew   The name of the group to move into.
         * @param [keyOld]   What key the value used to be under (required if
         *                   the old group is an Object).
         * @param [keyNew]   Optionally, what key the value will now be under
         *                   (required if the new group is an Object).
         */
        switchMemberGroup(value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void;

        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed in an array after scope and func, as in
         * Function.apply's standard.
         * 
         * @param scope   An optional scope to call this from (if falsy, defaults
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;

        /**
         * Calls a function for each member of each group. Extra arguments may be 
         * passed in an array after scope and func, as in Function.apply's standard.
         * 
         * @param scope   An optional scope to call this from (if falsy, defaults 
         *                to the calling GroupHoldr).
         * @param func   A Function to apply to each group.
         * @param [args]   Optionally, arguments to pass in after each group.
         */
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;

        /**
         * Calls a Function for each group, with that group as the first argument.
         * Extra arguments may be passed after scope and func natively, as in 
         * Function.call's standard.
         * 
         * @param scope   An optional scope to call this from (if falsy, 
         *                defaults to this).
         * @param func   A Function to apply to each group.
         */
        callAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;

        /**
         * Calls a function for each member of each group. Extra arguments may be
         * passed after scope and func natively, as in Function.call's standard.
         * 
         * @param scope   An optional scope to call this from (if falsy, 
         *                defaults to this).
         * @param func   A Function to apply to each group member.
         */
        callOnAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;

        /**
         * Clears each Array by setting its length to 0.
         */
        clearArrays(): void;
    }
}
