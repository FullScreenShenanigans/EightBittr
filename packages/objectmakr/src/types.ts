/**
 * A tree representing class inheritances, where keys are class names.
 */
export interface ClassInheritance {
    [i: string]: ClassInheritance;
}

/**
 * Properties for each class, keyed by class name.
 */
export type ClassProperties = Record<string, any>;

/**
 * Generated classes, keyed by name.
 */
export type ClassFunctions = Record<string, Class>;

/**
 * Parent names for each class.
 */
export type ClassParentNames = Record<string, string>;

/**
 * Root abstract definition for generated classes.
 */
export type Class = new () => any;

/**
 * Member callback for when an output onMake is a Function.
 *
 * @template T   Type of the generated class instance.
 * @param output   Generated class instance.
 * @param name   Name of the class.
 * @param settings   Settings used to instantiate this instance.
 * @param defaults   Defaults for the class.
 */
export type OnMakeFunction<T> = (this: T, output: T, name: string) => void;

/**
 * Settings to initialize a new IObjectMakr.
 */
export interface ObjectMakrSettings {
    /**
     * A tree representing class inheritances, where keys are class names.
     */
    inheritance?: ClassInheritance;

    /**
     * Properties for each class.
     */
    properties?: ClassProperties;

    /**
     * How properties can be mapped from an Array to indices.
     */
    indexMap?: string[];

    /**
     * Member name for a function on instances to be called upon creation.
     */
    onMake?: string;
}
