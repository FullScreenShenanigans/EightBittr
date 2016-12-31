import {
    IClass, IClassFunctions, IClassInheritance, IClassParentNames, IClassProperties,
    IObjectMakr, IObjectMakrSettings, IOnMakeFunction
} from "./IObjectMakr";

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
     * If requested, each class' entire prototype chain of properties.
     */
    private readonly propertiesFull?: IClassProperties;

    /**
     * Generated classes, keyed by name.
     */
    private readonly classes: IClassFunctions;

    /**
     * Parent names for each class.
     */
    private readonly classParentNames: IClassParentNames;

    /**
     * How properties can be mapped from an Array to indices.
     */
    private readonly indexMap?: string[];

    /**
     * An index for each generated Object's Function to be run when made.
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
        this.indexMap = settings.indexMap;
        this.onMake = settings.onMake;

        this.classes = { Object };
        this.classParentNames = {};
        this.generateClassParentNames(this.inheritance, "Object");

        if (settings.doPropertiesFull) {
            this.propertiesFull = {};
        }
    }

    /**
     * @param name   Name of a class.
     * @returns The properties for a the class.
     */
    public getPropertiesOf(name: string): any {
        return this.properties[name];
    }

    /**
     * @param name   Name of a class.
     * @returns Full properties for a the class, if doPropertiesFull is true.
     */
    public getFullPropertiesOf(name: string): any {
        return this.propertiesFull ? this.propertiesFull[name] : undefined;
    }

    /**
     * @param name   Name of a class.
     * @returns The class.
     */
    public getClass(name: string): IClass {
        return this.classes[name];
    }

    /**
     * @param name   Name of a class.
     * @returns Whether that class exists.
     */
    public hasClass(name: string): boolean {
        return name in this.classes;
    }

    /**
     * Creates a new instance of the specified class.
     * 
     * @param name   Name of the class.
     * @param settings   Additional attributes to deep copy onto the new instance.
     * @type T   Type of class being created.
     * @returns A newly created instance of the specified class.
     */
    public make<T extends any>(name: string, settings?: any): T {
        if (!(name in this.classes)) {
            if (!(name in this.classParentNames)) {
                throw new Error(`Unknown type given to ObjectMakr: '${name}'.`);
            }

            this.classes[name] = this.createClass(name);
        }

        const output: T = new this.classes[name]();
        if (settings) {
            this.proliferate(output, settings);
        }

        if (this.onMake && output[this.onMake]) {
            (output[this.onMake] as IOnMakeFunction<T>).call(
                output,
                output,
                name,
                settings,
                (this.propertiesFull ? this.propertiesFull! : this.properties)[name]);
        }

        return output;
    }

    /**
     * Creates a class from the recorded properties.
     * 
     * @param name   Name of the class.
     * @returns The newly created class.
     */
    private createClass(name: string): IClass {
        const newClass: IClass = class { };
        const parentName: string | undefined = this.classParentNames[name];

        if (this.propertiesFull) {
            this.propertiesFull[name] = {};
        }

        if (parentName) {
            this.extendClass(newClass, name, parentName);
        }

        if (this.indexMap && this.properties[name] instanceof Array) {
            this.properties[name] = this.processIndexMappedProperties(this.properties[name]);
        }

        for (const i in this.properties[name]) {
            newClass.prototype[i] = this.properties[name][i];
        }

        if (this.propertiesFull) {
            for (const i in this.properties[name]) {
                this.propertiesFull[name][i] = this.properties[name][i];
            }
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
    private extendClass(newClass: IClass, name: string, parentName: string): void {
        const parentClass: IClass = this.classes[parentName]
            ? this.classes[parentName]
            : this.createClass(parentName);

        newClass.prototype = new parentClass();
        newClass.prototype.constructor = newClass;

        if (this.propertiesFull) {
            for (const i in this.propertiesFull[parentName]) {
                this.propertiesFull[name][i] = this.propertiesFull[parentName][i];
            }
        }
    }

    /**
     * Creates an output properties object with the mapping shown in indexMap
     * 
     * @param properties   An Array with indiced versions of properties.
     */
    private processIndexMappedProperties(indexMap: string[]): any {
        const output: any = {};

        for (let i: number = 0; i < indexMap.length; i += 1) {
            output[this.indexMap![i]] = indexMap[i];
        }

        return output;
    }

    /**
     * Recursively records the parent names for classes in an inheritance.
     * 
     * @param inheritance   A tree representing class inheritances.
     * @param parentClassName   Parent class of the current iteration.
     */
    private generateClassParentNames(inheritance: IClassInheritance, parentClassName: string): void {
        for (const i in inheritance) {
            this.classParentNames[i] = parentClassName;
            this.generateClassParentNames(inheritance[i], i);
        }
    }

    /**
     * Deep copies all members of the donor to the recipient recursively.
     * 
     * @param recipient   An object receiving the donor's members.
     * @param donor   An object whose members are copied to recipient.
     */
    private proliferate(recipient: any, donor: any): void {
        for (const i in donor) {
            const setting: any = donor[i];

            if (typeof setting === "object") {
                if (!this.hasOwnProperty.call(recipient, i)) {
                    recipient[i] = new setting.constructor();
                }

                this.proliferate(recipient[i], setting);
            } else {
                recipient[i] = setting;
            }
        }
    }
}
