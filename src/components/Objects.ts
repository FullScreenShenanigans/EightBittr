import { IClassInheritance, IClassProperties } from "objectmakr";

import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Raw ObjectMakr factory settings.
 */
export class Objects<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * How properties can be mapped from an Array to indices.
     */
    public readonly indexMap?: string[];

    /**
     * A tree representing class inheritances, where keys are class names.
     */
    public readonly inheritance?: IClassInheritance;

    /**
     * Member name for a function on Thing instances to be called upon creation.
     */
    public readonly onMake?: string;

    /**
     * Properties for each class.
     */
    public readonly properties?: IClassProperties;
}
