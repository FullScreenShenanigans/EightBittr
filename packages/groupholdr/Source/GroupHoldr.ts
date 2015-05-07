interface IGroupHoldrSettings {
    // The listing of group names.
    groupNames: string[];

    // The mapping of group types. This can be a String ("Array" or
    // "Object") to set each one, or an Object mapping each groupName
    // to a different String.
    groupTypes: string | any;
}

/**
 * GroupHoldr.js
 * 
 * A general utility to keep Arrays and/or Objects by key names within a
 * container so they can be referenced automatically by those keys. Automation
 * is made easier by more abstraction, such as by automatically generated add,
 * remove, etc. methods.
 * 
 * @example
 * // Creating and using a GroupHoldr to store populations of locations.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Country", "State"],
 *     "groupTypes": "Object"
 * });
 * 
 * GroupHolder.addCountry("United States", 316130000);
 * GroupHolder.addCountry("Canada", 35160000);
 * GroupHolder.addState("New York", 19650000);
 * 
 * console.log(GroupHolder.getCountry("United States")); // 316,130,000
 * 
 * @example
 * // Creating and using a GroupHoldr to hold people by their age group.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Child", "Adult"],
 *     "groupTypes": "Array"
 * });
 * 
 * GroupHolder.addChild("Alex");
 * GroupHolder.addChild("Bob");
 * GroupHolder.getGroup("Adult").push("Carol");
 * GroupHolder.getGroups().Adult.push("Devin");
 * 
 * console.log(GroupHolder.getAdultGroup()); // ["Carol", "Devin"]
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class GroupHoldr {
    // Associative array of strings to groups, where groups are each some
    // sort of array (either typical or associative).
    private groups: any;

    // Associative array containing "add", "del", "get", and "set" keys to
    // those appropriate functions (e.x. functions.add.MyGroup is the same
    // as this.addMyGroup).
    private functions: any;

    // Array of string names, each of which is tied to a group.
    private groupNames: string[];

    // Associative array keying each group to the function it uses: Array
    // for regular arrays, and Object for associative arrays.
    private groupTypes: any;

    // Associative array keying each group to the string name of the
    // function it uses: "Array" for regular arrays, and "Object" for
    // associative arrays.
    private groupTypeNames: any;

    /**
     * Resets the GroupHoldr.
     * 
     * @constructor
     * @param {IGroupHoldrSettings} settings
     */
    constructor(settings: IGroupHoldrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings given to GroupHoldr.");
        }
        if (typeof settings.groupNames === "undefined") {
            throw new Error("No groupNames given to GroupHoldr.");
        }
        if (typeof settings.groupTypes === "undefined") {
            throw new Error("No groupTypes given to GroupHoldr.");
        }

        // These functions containers are filled in setGroupNames 
        this.functions = {
            "setGroup": {},
            "getGroup": {},
            "set": {},
            "get": {},
            "add": {},
            "delete": {}
        };
        this.setGroupNames(settings.groupNames, settings.groupTypes);
    }


    /* Simple gets
    */

    /**
     * @return {Object} The Object with Object<Function>s for each action
     *                  available on groups.
     */
    getFunctions(): any {
        return this.functions;
    }

    /**
     * @return {Object} The Object storing each of the internal groups.
     */
    getGroups(): any {
        return this.groups;
    }

    /**
     * @param {String} name
     * @return {Mixed} The group of the given name.
     */
    getGroup(name: string): any {
        return this.groups[name];
    }

    /**
     * @return {String[]} An Array containing each of the group names.
     */
    getGroupNames(): string[] {
        return this.groupNames;
    }


    /* Group/ordering manipulators
    */

    /**
     * Deletes a given object from a group by calling Array.splice on
     * the result of Array.indexOf
     * 
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Mixed} value   The object to be deleted from the group.
     */
    deleteObject(groupName: string, value: any): void {
        this.groups[groupName].splice(this.groups[groupName].indexOf(value), 1);
    }

    /**
     * Deletes a given index from a group by calling Array.splice. 
     * 
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Number} index   The index to be deleted from the group.
     * @param {Number} [max]   How many elements to delete after that index (if
     *                         falsy, just the first 1).
     */
    deleteIndex(groupName: string, index: number, max: number = 1): void {
        this.groups[groupName].splice(index, max);
    }

    /**
     * Switches an object from groupOld to groupNew by removing it from the
     * old group and adding it to the new. If the new group uses an associative
     * array, a key should be passed in (which defaults to undefined).
     * 
     * @param {Mixed} value   The value to be moved from one group to another.
     * @param {String} groupOld   The string name of the value's old group.
     * @param {String} groupNew   The string name of the value's new group.
     * @param {String} [keyNew]   A key for the value to be placed in the new
     *                             group, required only if the group contains an
     *                             associative array.
     */
    switchObjectGroup(value: any, groupOld: string, groupNew: string, keyNew: string = undefined): void {
        this.deleteObject(groupOld, value);
        this.functions.add[groupNew](value, keyNew);
    }

    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed in an array after scope and func, as in
     * Function.apply's standard.
     * 
     * @param {Mixed} scope   An optional scope to call this from (if falsy, 
     *                        defaults to this).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the 
     *                         function after each group.
     */
    applyAll(scope: any, func: any, args: any[] = undefined): void {
        var i: number;

        if (!args) {
            args = [undefined];
        } else {
            args.unshift(undefined);
        }

        if (!scope) {
            scope = this;
        }

        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }

        args.shift();
    }

    /**
     * Calls a function for each member of each group. Extra arguments may be 
     * passed in an array after scope and func, as in Function.apply's standard.
     * 
     * @param {Mixed} scope   An optional scope to call this from (if falsy, 
     *                        defaults to this).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the 
     *                         function after each group.
     */
    applyOnAll(scope: any, func: any, args: any[] = undefined): void {
        var group: any,
            i: number,
            j: any;

        if (!args) {
            args = [undefined];
        } else {
            args.unshift(undefined);
        }

        if (!scope) {
            scope = this;
        }

        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                for (j = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            } else {
                for (j in group) {
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
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to this).
     * @param {Function} func   A function to apply to each group.
     */
    callAll(scope: any, func: any): void {
        var args: any[] = Array.prototype.slice.call(arguments, 1),
            i: number;

        if (!scope) {
            scope = this;
        }

        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }
    }

    /**
     * Calls a function for each member of each group. Extra arguments may be
     * passed after scope and func natively, as in Function.call's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to this).
     * @param {Function} func   A function to apply to each group member.
     */
    callOnAll(scope: any, func: any): void {
        var args: any[] = Array.prototype.slice.call(arguments, 1),
            group: any,
            i: number,
            j: any;

        if (!scope) {
            scope = this;
        }

        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                for (j = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            } else {
                for (j in group) {
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
    clearArrays(): void {
        var group: any,
            i: number;

        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];

            if (group instanceof Array) {
                group.length = 0;
            }
        }
    }


    /* Core setup logic
    */

    /** 
     * Meaty function to reset, given an array of names an object of types
     * Any pre-existing functions are cleared, and new ones are added as
     * member objects and to {functions}.
     * 
     * @param {String[]} names   An array of names of groupings to be made
     * @param {Mixed} types   An associative array of the function types of
     *                        the names given in names. This may also be taken
     *                        in as a String, to be converted to an Object.
     */
    setGroupNames(names: string[], types: string | any): void {
        var scope: GroupHoldr = this,
            typeFunc: any,
            typeName: any;

        if (!(names instanceof Array)) {
            throw new Error("groupNames is not an Array");
        }

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
            this.groupNames.forEach(function (name: string): void {
                scope.groupTypes[name] = scope.getTypeFunction(types[name]);
                scope.groupTypeNames[name] = scope.getTypeName(types[name]);
            });
        } else {
            // Otherwise assume everything uses the same one, such as from a String
            typeFunc = this.getTypeFunction(types);
            typeName = this.getTypeName(types);

            this.groupNames.forEach(function (name: string): void {
                scope.groupTypes[name] = typeFunc;
                scope.groupTypeNames[name] = typeName;
            });
        }

        // Create the containers, and set the modifying functions
        this.setGroups();
        this.setFunctions();
    }

    /**
     * Removes any pre-existing "set", "get", etc. functions.
     */
    clearFunctions(): void {
        this.groupNames.forEach(function (name: string): void {
            // Delete member variable functions
            delete this["set" + name + "Group"];
            delete this["get" + name + "Group"];
            delete this["set" + name];
            delete this["get" + name];
            delete this["add" + name];
            delete this["delete" + name];

            // Delete functions under .functions by making each type a new {}
            this.functions.setGroup = {};
            this.functions.getGroup = {};
            this.functions.set = {};
            this.functions.get = {};
            this.functions.add = {};
            this.functions.delete = {};
        });
    }

    /**
     * Resets groups to an empty object, and fills it with a new groupType for
     * each name in groupNames
     */
    setGroups(): void {
        var scope: GroupHoldr = this;

        this.groups = {};
        this.groupNames.forEach(function (name: string): void {
            scope.groups[name] = new scope.groupTypes[name]();
        });
    }

    /**
     * Calls the function setters for each name in groupNames
     * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
     */
    setFunctions(): void {
        var scope: GroupHoldr = this;

        this.groupNames.forEach(function (name: string): void {
            scope.createFunctionSetGroup(name);
            scope.createFunctionGetGroup(name);
            scope.createFunctionSet(name);
            scope.createFunctionGet(name);
            scope.createFunctionAdd(name);
            scope.createFunctionDelete(name);
        });
    }


    /* Function generators
    */

    /**
     * Creates a getGroup function under this and functions.getGroup.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    createFunctionGetGroup(name: string): void {
        var scope: GroupHoldr = this;

        /**
         * @param {String} key   The String key that references the group.
         * @return {Mixed}   The group referenced by the given key.
         */
        this.functions.getGroup[name] = (<any>this)["get" + name + "Group"] = function (): void {
            return scope.groups[name];
        };
    }

    /**
     * Creates a setGroup function under this and functions.setGroup.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    createFunctionSetGroup(name: string): void {
        var scope: GroupHoldr = this;

        /**
         * Sets the value of the group referenced by the name.
         * 
         * @param {Mixed} value   The new value for the group, which should be 
         *                        the same type as the group (Array or Object).
         */
        this.functions.setGroup[name] = (<any>this)["set" + name + "Group"] = function (value: any): void {
            scope.groups[name] = value;
        };
    }

    /**
     * Creates a set function under this and functions.set.
     * 
     * @param {String} name   The name of the group, from groupNames.
     */
    createFunctionSet(name: string): void {
        /**
         * Sets a value contained within the group.
         * 
         * @param {Mixed} key   The key referencing the value to obtain. This 
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @param {Mixed} value
         */
        this.functions.set[name] = (<any>this)["set" + name] = function (key: string | number, value: any): void {
            this.groups[name][<string>key] = value;
        };
    }

    /**
     * Creates a get<type> function under this and functions.get
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    createFunctionGet(name: string): void {
        /**
         * Gets the value within a group referenced by the given key.
         * 
         * @param {Mixed} key   The key referencing the value to obtain. This 
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @return {Mixed} value
         */
        this.functions.get[<string>name] = this["get" + name] = function (key: string | number): void {
            return this.groups[name][<string>key];
        };
    }

    /**
     * Creates an add function under this and functions.add.
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    createFunctionAdd(name: string): void {
        var group: any = this.groups[name];

        if (this.groupTypes[name] === Object) {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param {String} key   The String key to reference the value to be
             *                       added.
             * @param value
             */
            this.functions.add[name] = this["add" + name] = function (key: string, value: any): void {
                group[key] = value;
            };
        } else {
            /**
             * Adds a value to the group, referenced by the given key.
             * 
             * @param {String} value
             */
            this.functions.add[name] = this["add" + name] = function (value: any): void {
                group.push(value);
            };
        }
    }

    /**
     * Creates a del (delete) function under this and functions.delete.
     * 
     * @param {String} name   The name of the group, from groupNames
     */
    createFunctionDelete(name: string): void {
        var group: any = this.groups[name];

        if (this.groupTypes[name] === Object) {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param {String} key   The String key to reference the value to be
             *                       deleted.
             */
            this.functions.delete[name] = this["delete" + name] = function (key: string): void {
                delete group[key];
            };
        } else {
            /**
             * Deletes a value from the group, referenced by the given key.
             * 
             * @param {Number} key   The String key to reference the value to be
             *                       deleted.
             */
            this.functions.delete[name] = this["delete" + name] = function (key: string): void {
                group.splice(group.indexOf(key), 1);
            };
        }
    }


    /* Utilities
    */

    /**
     * Returns the name of a type specified by a string ("Array" or "Object").
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {String}
     * @remarks The type is determined by the str[0]; if it exists and is "o",
     *          the outcome is "Object", otherwise it's "Array".
     */
    getTypeName(str: string): string {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return "Object";
        }
        return "Array";
    }

    /**
     * Returns function specified by a string (Array or Object).
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {Function}
     * @remarks The type is determined by the str[0]; if it exists and is "o",
     *          the outcome is Object, otherwise it's Array.
     */
    getTypeFunction(str: string): any {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return Object;
        }
        return Array;
    }
}
