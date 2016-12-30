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
    inheritance?: IClassInheritance;

    /**
     * Properties for each class.
     */
    properties?: IClassProperties;

    /**
     * Whether a full property mapping should be made for each type.
     */
    doPropertiesFull?: boolean;

    /**
     * How properties can be mapped from an Array to indices.
     */
    indexMap?: any[];

    /**
     * An index for each generated Object's Function to be run when made.
     */
    onMake?: string;

    /**
     * Optionally, existing classes that can be passed in instead of using auto-generated ones.
     */
    functions?: IClassFunctions;
}

/**
 * An abstract factory for dynamic attribute-based JavaScript classes.
 */
export interface IObjectMakr {
    /**
     * The sketch of class inheritance.
     */
    readonly inheritance: IClassInheritance;

    /**
     * Properties for each class.
     */
    readonly properties: IClassProperties;

    /**
     * The actual Functions for the classes to be made.
     */
    readonly functions: IClassFunctions;

    /**
     * Whether a full property mapping should be made for each type.
     */
    readonly doPropertiesFull: boolean;

    /**
     * If doPropertiesFull is true, a version of properties that contains the
     * sum properties for each type (rather than missing inherited ones).
     */
    readonly propertiesFull?: IClassProperties;

    /**
     * How properties can be mapped from an Array to indices.
     */
    readonly indexMap?: string[];

    /**
     * An index for each generated Object's Function to be run when made.
     */
    readonly onMake?: string;

    /**
     * @returns The properties for a particular class.
     */
    getPropertiesOf(title: string): any;

    /**
     * @returns Full properties for a particular class, if
     *          doPropertiesFull is true.
     */
    getFullPropertiesOf(title: string): any;

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
     * Creates a new instance of the specified type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     * 
     * @param name   The name of the type to initialize a new instance of.
     * @param [settings]   Additional attributes to add to the new instance.
     * @returns A newly created instance of the specified type.
     */
    make(name: string, settings?: any): any;
}
