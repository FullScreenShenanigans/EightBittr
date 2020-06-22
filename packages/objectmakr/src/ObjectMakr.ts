import {
    IClass,
    IClassFunctions,
    IClassInheritance,
    IClassParentNames,
    IClassProperties,
    IObjectMakr,
    IObjectMakrSettings,
    IOnMakeFunction,
} from "./IObjectMakr";

/**
 * Deep copies all members of the donor to the recipient recursively.
 *
 * @param recipient   An object receiving the donor's members.
 * @param donor   An object whose members are copied to recipient.
 */
const shallowCopy = <T extends unknown>(
    recipient: T,
    donor: Partial<T>
): void => {
    for (const i in donor) {
        if ({}.hasOwnProperty.call(donor, i)) {
            (recipient as any)[i] = donor[i];
        }
    }
};

/**
 * An abstract factory for dynamic attribute-based classes.
 */
export class ObjectMakr implements IObjectMakr {
    /**
     * Class inheritances, where keys are class names.
     */
    private readonly inheritance: IClassInheritance;

    /**
     * Properties for each class, keyed by class name.
     */
    private readonly properties: IClassProperties;

    /**
     * Generated classes, keyed by name.
     */
    private readonly classes: IClassFunctions;

    /**
     * Parent names for each class.
     */
    private readonly classParentNames: IClassParentNames;

    /**
     * How properties can be mapped from an array to indices.
     */
    private readonly indexMap: string[];

    /**
     * Member name for a function on instances to be called upon creation.
     */
    private readonly onMake?: string;

    /**
     * Initializes a new instance of the ObjectMakr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IObjectMakrSettings = {}) {
        this.inheritance = settings.inheritance || {};
        this.properties = settings.properties || {};
        this.indexMap =
            settings.indexMap === undefined ? [] : settings.indexMap;
        this.onMake = settings.onMake;

        this.classes = { Object };
        this.classParentNames = {};
        this.generateClassParentNames(this.inheritance, "Object");
    }

    /**
     * Gets the prototype of a class, which contains its base properties.
     *
     * @template T   Type of class properties being retrieved.
     * @param name   Name of a class.
     * @returns Base properties for the class.
     */
    public getPrototypeOf<T extends any>(name: string): T {
        this.ensureClassExists(name);
        return this.classes[name].prototype;
    }

    /**
     * Gets whether a class exists.
     *
     * @param name   Name of a class.
     * @returns Whether that class exists.
     */
    public hasClass(name: string): boolean {
        return name in this.classes || name in this.classParentNames;
    }

    /**
     * Creates a new instance of a class.
     *
     * @template T   Type of class being created.
     * @param name   Name of the class.
     * @param settings   Additional attributes to deep copy onto the new instance.
     * @returns A newly created instance of the specified class.
     */
    public make<T extends any>(name: string, settings?: Partial<T>): T {
        this.ensureClassExists(name);

        const instance: T = new this.classes[name]();
        if (settings !== undefined) {
            shallowCopy(instance, settings);
        }

        if (this.onMake && (instance as any)[this.onMake] !== undefined) {
            ((instance as any)[this.onMake] as IOnMakeFunction<T>).call(
                instance,
                instance,
                name
            );
        }

        return instance;
    }

    /**
     * Creates a class from the recorded properties.
     *
     * @param name   Name of the class.
     * @returns The newly created class.
     */
    private createClass(name: string): IClass {
        const newClass: IClass = class {};
        const parentName: string | undefined = this.classParentNames[name];

        if (parentName) {
            this.extendClass(newClass, parentName);
        }

        if (this.indexMap && this.properties[name] instanceof Array) {
            this.properties[name] = this.processIndexMappedProperties(
                this.properties[name]
            );
        }

        for (const i in this.properties[name]) {
            newClass.prototype[i] = this.properties[name][i];
        }

        return newClass;
    }

    /**
     * Extends a class from a parent.
     *
     * @param newClass   Child class being created.
     * @param name   Name of the child class.
     * @param parentName   Name of the parent class.
     */
    private extendClass(newClass: IClass, parentName: string): void {
        const parentClass: IClass = this.classes[parentName]
            ? this.classes[parentName]
            : this.createClass(parentName);

        newClass.prototype = new parentClass();
        newClass.prototype.constructor = newClass;
    }

    /**
     * Creates an output properties object with the mapping shown in indexMap
     *
     * @param properties   An array with indiced versions of properties.
     */
    private processIndexMappedProperties(shorthandProperties: string[]): any {
        const output: any = {};

        for (let i = 0; i < shorthandProperties.length; i += 1) {
            output[this.indexMap[i]] = shorthandProperties[i];
        }

        return output;
    }

    /**
     * Recursively records the parent names for classes in an inheritance.
     *
     * @param inheritance   A tree representing class inheritances.
     * @param parentClassName   Parent class of the current iteration.
     */
    private generateClassParentNames(
        inheritance: IClassInheritance,
        parentClassName: string
    ): void {
        for (const i in inheritance) {
            this.classParentNames[i] = parentClassName;
            this.generateClassParentNames(inheritance[i], i);
        }
    }

    /**
     * Ensures a class exists.
     *
     * @param name   Name of the class.
     */
    private ensureClassExists(name: string): void {
        if (!(name in this.classes)) {
            if (!(name in this.classParentNames)) {
                throw new Error(`Unknown class name: '${name}'.`);
            }

            this.classes[name] = this.createClass(name);
        }
    }
}
