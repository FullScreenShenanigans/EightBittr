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
 * @template T   Type of the generated class instance.
 * @param output   Generated class instance.
 * @param name   Name of the class.
 * @param settings   Settings used to instantiate this instance.
 * @param defaults   Defaults for the class.
 */
export type IOnMakeFunction<T> = (this: T, output: T, name: string) => void;

/**
 * Settings to initialize a new IObjectMakr.
 */
export interface IObjectMakrSettings {
    /**
     * A tree representing class inheritances, where keys are class names.
     */
    inheritance?: IClassInheritance;

    /**
     * Properties for each class.
     */
    properties?: IClassProperties;

    /**
     * How properties can be mapped from an Array to indices.
     */
    indexMap?: string[];

    /**
     * Member name for a function on instances to be called upon creation.
     */
    onMake?: string;
}

/**
 * An abstract factory for dynamic attribute-based classes.
 */
export interface IObjectMakr {
    /**
     * Gets the prototype of a class, which contains its base properties.
     *
     * @template T   Type of class properties being retrieved.
     * @param name   Name of a class.
     * @returns Base properties for the class.
     */
    getPrototypeOf<T extends {}>(name: string): T;

    /**
     * Gets whether a class exists.
     *
     * @param name   Name of a class.
     * @returns Whether that class exists.
     */
    hasClass(name: string): boolean;

    /**
     * Creates a new instance of a class.
     *
     * @template T   Type of class being created.
     * @param name   Name of the class.
     * @param settings   Additional attributes to deep copy onto the new instance.
     * @returns A newly created instance of the specified class.
     */
    make<T extends {}>(name: string, settings?: Partial<T>): T;
}
