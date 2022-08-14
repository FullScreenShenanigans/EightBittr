import { ClassInheritance, ClassProperties } from "objectmakr";

import { EightBittr } from "../EightBittr";
import { Section } from "./Section";

/**
 * Raw ObjectMakr factory settings.
 */
export class Objects<Game extends EightBittr> extends Section<Game> {
    /**
     * How properties can be mapped from an Array to indices.
     */
    public readonly indexMap?: string[];

    /**
     * A tree representing class inheritances, where keys are class names.
     */
    public readonly inheritance?: ClassInheritance;

    /**
     * Member name for a function on Actor instances to be called upon creation.
     */
    public readonly onMake?: string;

    /**
     * Properties for each class.
     */
    public readonly properties?: ClassProperties;
}
