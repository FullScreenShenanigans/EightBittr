var ObjectMakr;
(function (_ObjectMakr) {
    "use strict";
    /**
     * ObjectMakr
     *
     * An Abstract Factory for JavaScript classes that automates the process of
     * setting constructors' prototypal inheritance. A sketch of class inheritance
     * and a listing of properties for each class is taken in, and dynamically
     * accessible function constructors are made available.
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var ObjectMakr = (function () {
        /**
         * Resets the ObjectMakr.
         *
         * @constructor
         *
         * @param {Object} inheritance   The sketch of class inheritance, keyed by
         *                               name.
         * @param {Object} properties   Type properties for each Function.
         * @param {Boolean} [doPropertiesFull]   Whether a full property mapping
         *                                       should be made for each type (by
         *                                       default, false).
         * @param {Mixed} [indexMap]   Alternative aliases for properties as
         *                              shorthand.
         * @param {String} [onMake]   A String index for each generated Object's
         *                            Function to be run when made.
         */
        function ObjectMakr(settings) {
            if (typeof settings.inheritance === "undefined") {
                throw new Error("No inheritance mapping given to ObjectMakr.");
            }
            this.inheritance = settings.inheritance;
            this.properties = settings.properties || {};
            this.doPropertiesFull = settings.doPropertiesFull;
            this.indexMap = settings.indexMap;
            this.onMake = settings.onMake;
            this.functions = {};
            if (this.doPropertiesFull) {
                this.propertiesFull = {};
            }
            if (this.indexMap) {
                this.processProperties(this.properties);
            }
            this.processFunctions(this.inheritance, Object, "Object");
        }
        /* Simple gets
        */
        /**
         * @return {Object} The complete inheritance mapping Object.
         */
        ObjectMakr.prototype.getInheritance = function () {
            return this.inheritance;
        };
        /**
         * @return {Object} The complete properties mapping Object.
         */
        ObjectMakr.prototype.getProperties = function () {
            return this.properties;
        };
        /**
         * @return {Object} The properties Object for a particular class.
         */
        ObjectMakr.prototype.getPropertiesOf = function (title) {
            return this.properties[title];
        };
        /**
         * @return {Object} The full properties Object, if doPropertiesFull is on.
         */
        ObjectMakr.prototype.getFullProperties = function () {
            return this.propertiesFull;
        };
        /**
         * @return {Object} The full properties Object for a particular class, if
         *                  doPropertiesFull is on.
         */
        ObjectMakr.prototype.getFullPropertiesOf = function (title) {
            return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
        };
        /**
         * @return {Object} The full mapping of class constructors.
         */
        ObjectMakr.prototype.getFunctions = function () {
            return this.functions;
        };
        /**
         * @param {String} type   The name of a class to retrieve.
         * @return {Function}   The constructor for the given class.
         */
        ObjectMakr.prototype.getFunction = function (type) {
            return this.functions[type];
        };
        /**
         * @param {String} type   The name of a class to check for.
         * @return {Boolean} Whether that class exists.
         */
        ObjectMakr.prototype.hasFunction = function (type) {
            return this.functions.hasOwnProperty(type);
        };
        /**
         * @return {Mixed} The optional mapping of indices.
         */
        ObjectMakr.prototype.getIndexMap = function () {
            return this.indexMap;
        };
        /* Core usage
        */
        /**
         * Creates a new instance of the given type and returns it.
         * If desired, any settings are applied to it (deep copy using proliferate).
         * @param {String} type   The type for which a new object of is being made.
         * @param {Objetct} [settings]   Additional attributes to add to the newly
         *                               created Object.
         * @return {Mixed}
         */
        ObjectMakr.prototype.make = function (type, settings) {
            if (settings === void 0) { settings = undefined; }
            var output;
            // Make sure the type actually exists in functions
            if (!this.functions.hasOwnProperty(type)) {
                throw new Error("Unknown type given to ObjectMakr: " + type);
            }
            // Create the new object, copying any given settings
            output = new this.functions[type]();
            if (settings) {
                this.proliferate(output, settings);
            }
            // onMake triggers are handled respecting doPropertiesFull.
            if (this.onMake && output[this.onMake]) {
                if (this.doPropertiesFull) {
                    output[this.onMake](output, type, this.properties[type], this.propertiesFull[type]);
                }
                else {
                    output[this.onMake](output, type, this.properties[type], this.functions[type].prototype);
                }
            }
            return output;
        };
        /* Core parsing
        */
        /**
         * Parser that calls processPropertyArray on all properties given as arrays
         * @param {Object} properties   The object of function properties
         * @remarks Only call this if indexMap is given as an array
         */
        ObjectMakr.prototype.processProperties = function (properties) {
            var name;
            for (name in properties) {
                if (this.properties.hasOwnProperty(name)) {
                    // If it's an array, replace it with a mapped version
                    if (this.properties[name] instanceof Array) {
                        this.properties[name] = this.processPropertyArray(this.properties[name]);
                    }
                }
            }
        };
        /**
         * Creates an output properties object with the mapping shown in indexMap
         * @param {Array} properties   An array with indiced versions of properties
         * @example indexMap = ["width", "height"];
         *          properties = [7, 14];
         *          output = processPropertyArray(properties);
         *          // output is now { "width": 7, "height": 14 }
         */
        ObjectMakr.prototype.processPropertyArray = function (properties) {
            var output = {}, i;
            for (i = properties.length - 1; i >= 0; --i) {
                output[this.indexMap[i]] = properties[i];
            }
            return output;
        };
        /**
         * Recursive parser to generate each function, starting from the base.
         * @param {Object} base   An object whose keys are the names of functions to
         *                        made, and whose values are objects whose keys are
         *                        for children that inherit from these functions
         * @param {Function} parent   The parent function of the functions about to
         *                            be made
         * @param {String} parentName   The name of the parent Function to be
         *                              inherited from.
         * @remarks This may use eval, which is evil and almost never a good idea,
         *          but here it's the only way to make functions with dynamic names.
         */
        ObjectMakr.prototype.processFunctions = function (base, parent, parentName) {
            var name, ref;
            for (name in base) {
                if (base.hasOwnProperty(name)) {
                    this.functions[name] = new Function();
                    // This sets the function as inheriting from the parent
                    this.functions[name].prototype = new parent();
                    this.functions[name].prototype.constructor = this.functions[name];
                    for (ref in this.properties[name]) {
                        if (this.properties[name].hasOwnProperty(ref)) {
                            this.functions[name].prototype[ref] = this.properties[name][ref];
                        }
                    }
                    // If the entire property tree is being mapped, copy everything
                    // from both this and its parent to its equivalent
                    if (this.doPropertiesFull) {
                        this.propertiesFull[name] = {};
                        if (parentName) {
                            for (ref in this.propertiesFull[parentName]) {
                                if (this.propertiesFull[parentName].hasOwnProperty(ref)) {
                                    this.propertiesFull[name][ref] = this.propertiesFull[parentName][ref];
                                }
                            }
                        }
                        for (ref in this.properties[name]) {
                            if (this.properties[name].hasOwnProperty(ref)) {
                                this.propertiesFull[name][ref] = this.properties[name][ref];
                            }
                        }
                    }
                    this.processFunctions(base[name], this.functions[name], name);
                }
            }
        };
        /* Utilities
        */
        /**
         * Proliferates all members of the donor to the recipient recursively. This
         * is therefore a deep copy.
         * @param {Object} recipient   An object receiving the donor's members.
         * @param {Object} donor   An object whose members are copied to recipient.
         * @param {Boolean} noOverride   If recipient properties may be overriden.
         */
        ObjectMakr.prototype.proliferate = function (recipient, donor, noOverride) {
            if (noOverride === void 0) { noOverride = false; }
            var setting, i;
            for (i in donor) {
                // If noOverride is specified, don't override if it already exists
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
                }
                else {
                    // Regular primitives are easy to copy otherwise
                    recipient[i] = setting;
                }
            }
            return recipient;
        };
        return ObjectMakr;
    })();
    _ObjectMakr.ObjectMakr = ObjectMakr;
})(ObjectMakr || (ObjectMakr = {}));
