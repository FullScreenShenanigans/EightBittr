/**
 * A tree representing class inheritances, where keys are class names.
 */
export interface IClassInheritance {
    [i: string]: IClassInheritance;
}

/**
 * Properties for each class, keyed by class name.
 */
export interface IClassProperties {
    [i: string]: any;
}

/**
 * Generated classes, keyed by name.
 */
export interface IClassFunctions {
    [i: string]: IClass;
}

/**
 * Parent names for each class.
 */
export interface IClassParentNames {
    [i: string]: string;
}

/**
 * Root abstract definition for generated classes.
 */
export interface IClass {
    new (): any;
}

/**
 * Member callback for when an output onMake is a Function.
 *
 * @param output   Generated class instance.
 * @param name   Name of the class.
 * @param settings   Settings used to instantiate this instance.
 * @param defaults   Defaults for the class.
 * @type T   Type of the generated class instance.
 */
export interface IOnMakeFunction<T> {
    (this: T, output: T, name: string, settings: any, defaults: any): any;
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
 * An abstract factory for dynamic attribute-based classes.
 */
export interface IObjectMakr {

    /**
     * @param name   Name of a class.
     * @returns The properties for a the class.
     */
    getPropertiesOf(name: string): any;

    /**
     * @param name   Name of a class.
     * @returns Full properties for a the class, if doPropertiesFull is true.
     */
    getFullPropertiesOf(name: string): any;

    /**
     * @param name   Name of a class.
     * @returns The class.
     */
    getClass(name: string): IClass;

    /**
     * @param name   Name of a class.
     * @returns Whether that class exists.
     */
    hasClass(name: string): boolean;

    /**
     * Creates a new instance of the specified class.
     *
     * @param name   Name of the class.
     * @param settings   Additional attributes to deep copy onto the new instance.
     * @type T   Type of class being created.
     * @returns A newly created instance of the specified class.
     */
    make<T extends any>(name: string, settings?: any): T;
}
