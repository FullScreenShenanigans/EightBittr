/**
 * A tree representing class inheritances, where each key represents
 * a class, and its children inherit from that class.
 */
export interface IClassInheritance {
    [i: string]: IClassInheritance;
}

/**
 * Properties for a class prototype, which may be of any type.
 */
export interface IClassProperties {
    [i: string]: any;
}

/**
 * Listing of class Functions, keyed by name.
 */
export interface IClassFunctions {
    [i: string]: IClassFunction;
}

/**
 * Root abstract definition for class Functions.
 */
export interface IClassFunction {
    new (): any;
}

/**
 * Member callback for when an output onMake is a Function.
 */
export interface IOnMakeFunction {
    (output: any, name: string, settings: any, defaults: any): any;
}

/**
 * Settings to initialize a new IObjectMakr.
 */
export interface IObjectMakrSettings {
    /**
     * A sketch of class inheritance.
     */
    inheritance: IClassInheritance;

    /**
     * Properties for each class.
     */
    properties?: IClassProperties;

    /**
     * Whether a full property mapping should be made for each type.
     */
    doPropertiesFull?: boolean;

    /**
     * How propperties can be mapped from an Array to indices.
     */
    indexMap?: any[];

    /**
     * Optionally, a String index for each generated Object's Function to
     * be run when made.
     */
    onMake?: string;

    /**
     * Optionally, existing classes that can be passed in instead of using auto-generated ones.
     */
    functions?: IClassFunctions;

    /**
     * A scope to call onMake functions in, if not this IObjectMakr.
     */
    scope?: any;
}

/**
 * A abstract factory for dynamic attribute-based JavaScript classes.
 */
export interface IObjectMakr {
    /**
     * @returns The complete inheritance mapping.
     */
    getInheritance(): any;

    /**
     * @returns The complete properties mapping.
     */
    getProperties(): any;

    /**
     * @returns The properties for a particular class.
     */
    getPropertiesOf(title: string): any;

    /**
     * @returns Full properties, if doPropertiesFull is true.
     */
    getFullProperties(): any;

    /**
     * @returns Full properties for a particular class, if
     *          doPropertiesFull is true.
     */
    getFullPropertiesOf(title: string): any;

    /**
     * @returns The full mapping of class constructors.
     */
    getFunctions(): IClassFunctions;

    /**
     * @param name   The name of a class to retrieve.
     * @returns The constructor for the given class.
     */
    getFunction(name: string): IClassFunction;

    /**
     * @param type   The name of a class to check for.
     * @returns Whether that class exists.
     */
    hasFunction(name: string): boolean;

    /**
     * @returns The scope onMake functions are called in, if not this.
     */
    getScope(): any;

    /**
     * @returns The optional mapping of indices.
     */
    getIndexMap(): any[];

    /**
     * Creates a new instance of the specified type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     * 
     * @param name   The name of the type to initialize a new instance of.
     * @param [settings]   Additional attributes to add to the new instance.
     * @returns A newly created instance of the specified type.
     */
    make(name: string, settings?: any): any;
}
