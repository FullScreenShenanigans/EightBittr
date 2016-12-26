import {
     IDictionary, IFunctionGroups, IGroupHoldr, IGroupHoldrSettings, IGroups, ITypesListing
} from "./IGroupHoldr";

/**
 * A general storage abstraction for keyed containers of items.
 */
export class GroupHoldr implements IGroupHoldr {
    /**
     * Stored object groups, keyed by name.
     */
    private groups: IGroups<any>;

    /**
     * Mapping of "add", "delete", "get", and "set" keys to a listing of the
     * appropriate Functions for each group.
     */
    private functions: IFunctionGroups;

    /**
     * Names of the stored object groups.
     */
    private groupNames: string[];

    /**
     * Types for each stored object group, as Array or Object.
     */
    private groupTypes: ITypesListing;

    /**
     * The names of each group's type, as "Array" or "Object".
     */
    private groupTypeNames: any;

    /**
     * Initializes a new instance of the GroupHoldr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    constructor(settings: IGroupHoldrSettings = {}) {
        // These functions containers are filled in setGroupNames 
        this.functions = {
            setGroup: {},
            getGroup: {},
            set: {},
            get: {},
            add: {},
            "delete": {}
        };
        this.setGroupNames(settings.groupNames || [], settings.groupTypes || "Object");
    }

    /**
     * @returns The mapping of operation types to each group's Functions.
     */
    public getFunctions(): IFunctionGroups {
        return this.functions;
    }

    /**
     * @returns The stored object groups, keyed by name.
     */
    public getGroups(): IGroups<any> {
        return this.groups;
    }

    /**
     * @param name   The name of the group to retrieve.
     * @returns The group stored under the given name.
     */
    public getGroup(name: string): { [i: string]: any } | any[] {
        return this.groups[name];
    }

    /**
     * @returns Names of the stored object groups.
     */
    public getGroupNames(): string[] {
        return this.groupNames;
    }

    /**
     * Switches an object from one group to another.
     * 
     * @param value   The value being moved from one group to another.
     * @param groupNameOld   The name of the group to move out of.
     * @param groupNameNew   The name of the group to move into.
     * @param keyOld   What key the value used to be under (required if
     *                 the old group is an Object).
     * @param keyNew   Optionally, what key the value will now be under
     *                 (required if the new group is an Object).
     */
    public switchMemberGroup(
        value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void {
        const groupOld: any = this.groups[groupNameOld];

        if (groupOld.constructor === Array) {
            this.functions.delete[groupNameOld](value, keyOld);
        } else {
            this.functions.delete[groupNameOld](keyOld);
        }

        this.functions.add[groupNameNew](value, keyNew);
    }

    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed in an array after scope and func, as in
     * Function.apply's standard.
     * 
     * @param scope   An optional scope to call this from (if falsy, defaults
     *                to the calling GroupHoldr).
     * @param func   A function to apply to each group.
     * @param args   Optionally, arguments to pass in after each group.
     */
    public applyAll(scope: any, func: (...args: any[]) => any, args: any[] | undefined = undefined): void {
        if (!args) {
            args = [undefined];
        } else {
            args.unshift(undefined);
        }

        if (!scope) {
            scope = this;
        }

        for (let i: number = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }

        args.shift();
    }

    /**
     * Calls a function for each member of each group. Extra arguments may be 
     * passed in an array after scope and func, as in Function.apply's standard.
     * 
     * @param scope   An optional scope to call this from (if falsy, defaults 
     *                to the calling GroupHoldr).
     * @param func   A function to apply to each group.
     * @param args   Optionally, arguments to pass in after each group.
     */
    public applyOnAll(scope: any, func: (...args: any[]) => any, args: any[] | undefined = undefined): void {
        if (!args) {
            args = [undefined];
        } else {
            args.unshift(undefined);
        }

        if (!scope) {
            scope = this;
        }

        for (let i: number = this.groupNames.length - 1; i >= 0; i -= 1) {
            const group: IDictionary<any> | any = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                for (let j: number = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            } else {
                for (const j in group) {
                    if (group.hasOwnProperty(j)) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
            }
        }
    }

    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed after scope and func natively, as in 
     * Function.call's standard.
     * 
     * @param scope   An optional scope to call this from (if falsy, 
     *                defaults to this).
     * @param func   A function to apply to each group.
     */
    public callAll(scope: any, func: (...args: any[]) => any): void {
        const args: any[] = Array.prototype.slice.call(arguments, 1);

        if (!scope) {
            scope = this;
        }

        for (let i: number = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }
    }

    /**
     * Calls a function for each member of each group. Extra arguments may be
     * passed after scope and func natively, as in Function.call's standard.
     * 
     * @param scope   An optional scope to call this from (if falsy, 
     *                defaults to this).
     * @param func   A function to apply to each group member.
     */
    public callOnAll(scope: any, func: (...args: any[]) => any): void {
        const args: any[] = Array.prototype.slice.call(arguments, 1);

        if (!scope) {
            scope = this;
        }

        for (let i: number = this.groupNames.length - 1; i >= 0; i -= 1) {
            const group: IDictionary<any> | any[] = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                for (let j: number = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            } else {
                for (const j in group) {
                    if (group.hasOwnProperty(j)) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
            }
        }
    }

    /**
     * Clears each Array by setting its length to 0.
     */
    public clearArrays(): void {
        for (let i: number = this.groupNames.length - 1; i >= 0; i -= 1) {
            const group: IDictionary<any> | any[] = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                group.length = 0;
            }
        }
    }

    /** 
     * Meaty function to reset, given an Array of names and an object of 
     * types. Any pre-existing Functions are cleared, and new ones are added 
     * as member objects and to this.functions.
     * 
     * @param names   An array of names of groupings to be made
     * @param types   An mapping of the function types of
     *                the names given in names. This may also be taken
     *                in as a String, to be converted to an Object.
     */
    private setGroupNames(names: string[], types: string | any): void {
        const scope: GroupHoldr = this;

        // If there already were group names, clear them
        if (this.groupNames) {
            this.clearFunctions();
        }

        // Reset the group types and type names, to be filled next
        this.groupNames = names;
        this.groupTypes = {};
        this.groupTypeNames = {};

        // If groupTypes is an object, set custom group types for everything
        if (types.constructor === Object) {
            this.groupNames.forEach((name: string): void => {
                scope.groupTypes[name] = scope.getTypeFunction(types[name]);
                scope.groupTypeNames[name] = scope.getTypeName(types[name]);
            });
        } else {
            // Otherwise assume everything uses the same one, such as from a String
            const typeFunc: typeof Object | typeof Array = this.getTypeFunction(types);
            const typeName: string = this.getTypeName(types);

            this.groupNames.forEach((name: string): void => {
                scope.groupTypes[name] = typeFunc;
                scope.groupTypeNames[name] = typeName;
            });
        }

        // Create the containers, and set the modifying functions
        this.setGroups();
        this.createFunctions();
    }

    /**
     * Removes any pre-existing "set", "get", etc. functions.
     */
    private clearFunctions(): void {
        this.functions.setGroup = {};
        this.functions.getGroup = {};
        this.functions.set = {};
        this.functions.get = {};
        this.functions.add = {};
        this.functions.delete = {};
    }

    /**
     * Resets groups to an empty Object, and fills it with a new groupType for
     * each name in groupNames.
     */
    private setGroups(): void {
        this.groups = {};
        this.groupNames.forEach((name: string): void => {
            this.groups[name] = new this.groupTypes[name]();
        });
    }

    /**
     * Calls the function creators for each name in groupNames.
     */
    private createFunctions(): void {
        for (const groupName of this.groupNames) {
            this.createFunctionSetGroup(groupName);
            this.createFunctionGetGroup(groupName);
            this.createFunctionSet(groupName);
            this.createFunctionGet(groupName);
            this.createFunctionAdd(groupName);
            this.createFunctionDelete(groupName);
        }
    }

    /**
     * Creates a setGroup function under functions.setGroup.
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionSetGroup(name: string): void {
        /**
         * Sets the value of the group referenced by the name.
         * 
         * @param value   The new value for the group, which should be 
         *                the same type as the group (Array or Object).
         */
        this.functions.setGroup[name] = (value: any | any[]): void => {
            this.groups[name] = value;
        };
    }

    /**
     * Creates a getGroup function under functions.getGroup.
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionGetGroup(name: string): void {
        /**
         * @param key   The String key that references the group.
         * @returns The group referenced by the given key.
         */
        this.functions.getGroup[name] = (): any | any[] => {
            return this.groups[name];
        };
    }

    /**
     * Creates a set function under functions.set.
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionSet(name: string): void {
        /**
         * Sets a value contained within the group.
         * 
         * @param key   The key referencing the value to obtain. This 
         *              should be a Number if the group is an Array, or
         *              a String if the group is an Object.
         * @param value   The value to be contained within the group.
         */
        this.functions.set[name] = (key: string | number, value?: any): void => {
            (this.groups[name] as any)[key as string] = value;
        };
    }

    /**
     * Creates a get<type> function under functions.get
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionGet(name: string): void {
        /**
         * Gets the value within a group referenced by the given key.
         * 
         * @param  key   The key referencing the value to obtain. This 
         *               should be a Number if the group is an Array, or
         *               a String if the group is an Object.
         * @param value   The value contained within the group.
         */
        this.functions.get[name] = (key: string | number): any => {
            return (this.groups[name] as any)[key as string];
        };
    }

    /**
     * Creates an add function under functions.add.
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionAdd(name: string): void {
        const group: any = this.groups[name];

        if (this.groupTypes[name] === Object) {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param key   The String key to reference the value to be
             *              added.
             * @param value   The value to be added to the group.
             */
            this.functions.add[name] = (value: any, key: string): void => {
                group[key] = value;
            };
        } else {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param value   The value to be added to the group.
             */
            this.functions.add[name] = (value: any, key?: number): void => {
                if (key !== undefined) {
                    group[key] = value;
                } else {
                    group.push(value);
                }
            };
        }
    }

    /**
     * Creates a delete function under functions.delete.
     * 
     * @param name   The name of the group, from groupNames.
     */
    private createFunctionDelete(name: string): void {
        const group: any = this.groups[name];

        if (this.groupTypes[name] === Object) {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param key   The String key to reference the value to be
             *              deleted.
             */
            this.functions.delete[name] = (key: string): void => {
                delete group[key];
            };
        } else {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param value The value to be deleted.
             */
            this.functions.delete[name] = (value: any, index: number = group.indexOf(value)): void => {
                if (index !== -1) {
                    group.splice(index, 1);
                }
            };
        }
    }

    /**
     * Returns the name of a type specified by a string ("Array" or "Object").
     * 
     * @param str   The name of the type. If falsy, defaults to Array.
     * @returns The proper name of the type.
     */
    private getTypeName(str: string): string {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return "Object";
        }

        return "Array";
    }

    /**
     * Returns function specified by a string (Array or Object).
     * 
     * @param str   The name of the type. If falsy, defaults to Array
     * @returns The class function of the type.
     */
    private getTypeFunction(str: string): typeof Object | typeof Array {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return Object;
        }

        return Array;
    }
}
