import {
    IClassFunction, IClassFunctions, IClassInheritance, IClassProperties,
    IObjectMakr, IObjectMakrSettings, IOnMakeFunction
} from "./IObjectMakr";

/**
 * A abstract factory for dynamic attribute-based JavaScript classes.
 */
export class ObjectMakr implements IObjectMakr {
    /**
     * The sketch of class inheritance.
     */
    private inheritance: IClassInheritance;

    /**
     * Properties for each class.
     */
    private properties: IClassProperties;

    /**
     * The actual Functions for the classes to be made.
     */
    private functions: IClassFunctions;

    /**
     * A scope to call onMake functions in, if not this.
     */
    private scope: any;

    /**
     * Whether a full property mapping should be made for each type.
     */
    private doPropertiesFull: boolean;

    /**
     * If doPropertiesFull is true, a version of properties that contains the
     * sum properties for each type (rather than missing inherited ones).
     */
    private propertiesFull: IClassProperties;

    /**
     * How properties can be mapped from an Array to indices.
     */
    private indexMap: string[];

    /**
     * Optionally, a String index for each generated Object's Function to
     * be run when made.
     */
    private onMake: string;

    /**
     * Initializes a new instance of the ObjectMakr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IObjectMakrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to ObjectMakr.");
        }
        if (typeof settings.inheritance === "undefined") {
            throw new Error("No inheritance given to ObjectMakr.");
        }

        this.inheritance = settings.inheritance;
        this.properties = settings.properties || {};
        this.doPropertiesFull = settings.doPropertiesFull;
        this.indexMap = settings.indexMap;
        this.onMake = settings.onMake;
        this.functions = this.proliferate({}, settings.functions);
        this.scope = settings.scope;

        if (this.doPropertiesFull) {
            this.propertiesFull = {};
        }

        if (this.indexMap) {
            this.processProperties(this.properties);
        }

        this.processFunctions(this.inheritance, Object, "Object");
    }

    /**
     * @returns The complete inheritance mapping.
     */
    public getInheritance(): any {
        return this.inheritance;
    }

    /**
     * @returns The complete properties mapping.
     */
    public getProperties(): any {
        return this.properties;
    }

    /**
     * @returns The properties for a particular class.
     */
    public getPropertiesOf(title: string): any {
        return this.properties[title];
    }

    /**
     * @returns Full properties, if doPropertiesFull is true.
     */
    public getFullProperties(): any {
        return this.propertiesFull;
    }

    /**
     * @returns Full properties for a particular class, if
     *          doPropertiesFull is true.
     */
    public getFullPropertiesOf(title: string): any {
        return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
    }

    /**
     * @returns The full mapping of class constructors.
     */
    public getFunctions(): IClassFunctions {
        return this.functions;
    }

    /**
     * @param name   The name of a class to retrieve.
     * @returns The constructor for the given class.
     */
    public getFunction(name: string): IClassFunction {
        return this.functions[name];
    }

    /**
     * @returns The scope onMake functions are called in, if not this.
     */
    public getScope(): any {
        return this.scope;
    }

    /**
     * @param type   The name of a class to check for.
     * @returns Whether that class exists.
     */
    public hasFunction(name: string): boolean {
        return this.functions.hasOwnProperty(name);
    }

    /**
     * @returns The optional mapping of indices.
     */
    public getIndexMap(): string[] {
        return this.indexMap;
    }

    /**
     * Creates a new instance of the specified type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     * 
     * @param name   The name of the type to initialize a new instance of.
     * @param settings   Additional attributes to add to the new instance.
     * @returns A newly created instance of the specified type.
     */
    public make(name: string, settings?: any): any {
        // Make sure the type actually exists in Functions
        if (!this.functions.hasOwnProperty(name)) {
            throw new Error("Unknown type given to ObjectMakr: " + name);
        }

        // Create the new object, copying any given settings
        const output: any = new this.functions[name]();
        if (settings) {
            this.proliferate(output, settings);
        }

        // onMake triggers are handled respecting doPropertiesFull.
        if (this.onMake && output[this.onMake]) {
            (output[this.onMake] as IOnMakeFunction).call(
                this.scope || this,
                output,
                name,
                settings,
                (this.doPropertiesFull ? this.propertiesFull : this.properties)[name]);
        }

        return output;
    }

    /**
     * Parser that calls processPropertyArray on all properties given as arrays
     * 
     * @param properties   Type properties for classes to create.
     */
    private processProperties(properties: any): void {
        // For each of the given properties:
        for (const name in properties) {
            if (properties.hasOwnProperty(name)) {
                // If it's an Array, replace it with a mapped version
                if (properties[name] instanceof Array) {
                    properties[name] = this.processPropertyArray(properties[name]);
                }
            }
        }
    }

    /**
     * Creates an output properties object with the mapping shown in indexMap
     * 
     * @param properties   An Array with indiced versions of properties
     */
    private processPropertyArray(indexMap: string[]): any {
        const output: any = {};

        for (let i: number = 0; i < indexMap.length; i += 1) {
            output[this.indexMap[i]] = indexMap[i];
        }

        return output;
    }

    /**
     * Recursive parser to generate each Function, starting from the base.
     * 
     * @param base   An object whose keys are the names of Functions to
     *               made, and whose values are objects whose keys are
     *               for children that inherit from these Functions
     * @param parent   The parent class Function of the classes about to be made.
     * @param parentName   The name of the parent class to be inherited from,
     *                     if it is a generated one (and not Object itself).
     */
    private processFunctions(base: any, parent: IClassFunction, parentName?: string): void {
        // For each name in the current object:
        for (const name in base) {
            if (!base.hasOwnProperty(name)) {
                continue;
            }

            if (!this.functions[name]) {
                this.functions[name] = class { };

                // This sets the Function as inheriting from the parent
                this.functions[name].prototype = new parent();
                this.functions[name].prototype.constructor = this.functions[name];
            }

            // Add each property from properties to the Function prototype
            for (const ref in this.properties[name]) {
                if (this.properties[name].hasOwnProperty(ref)) {
                    this.functions[name].prototype[ref] = this.properties[name][ref];
                }
            }

            // If the entire property tree is being mapped, copy everything
            // from both this and its parent to its equivalent
            if (this.doPropertiesFull) {
                this.propertiesFull[name] = {};

                if (parentName) {
                    for (const ref in this.propertiesFull[parentName]) {
                        if (this.propertiesFull[parentName].hasOwnProperty(ref)) {
                            this.propertiesFull[name][ref] = this.propertiesFull[parentName][ref];
                        }
                    }
                }

                for (const ref in this.properties[name]) {
                    if (this.properties[name].hasOwnProperty(ref)) {
                        this.propertiesFull[name][ref] = this.properties[name][ref];
                    }
                }
            }

            this.processFunctions(base[name], this.functions[name], name);
        }
    }

    /**
     * Proliferates all members of the donor to the recipient recursively, as
     * a deep copy.
     * 
     * @param recipient   An object receiving the donor's members.
     * @param donor   An object whose members are copied to recipient.
     * @param noOverride   If recipient properties may be overriden (by default, false).
     */
    private proliferate(recipient: any, donor: any, noOverride?: boolean): any {
        // For each attribute of the donor:
        for (const i in donor) {
            // If noOverride is specified, don't override if it already exists
            if (noOverride && recipient.hasOwnProperty(i)) {
                continue;
            }

            // If it's an object, recurse on a new version of it
            const setting: any = donor[i];
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
}
