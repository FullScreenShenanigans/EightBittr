import { EightBittr } from "../../EightBittr";
import { IThing } from "../../IEightBittr";
import { GeneralComponent } from "../GeneralComponent";

/**
 * Adds and removes visual classes for Things.
 */
export class Classes<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * Sets the class of a Thing, sets the new sprite for it, and marks it as
     * having changed appearance. The class is stored in the Thing's internal
     * .className attribute.
     *
     * @param thing
     * @param className   A new .className for the Thing.
     */
    public setClass(thing: IThing, className: string): void {
        thing.className = className;
    }

    /**
     * A version of setClass to be used before the Thing's sprite attributes
     * have been set. This just sets the internal .className.
     *
     * @param thing
     * @param className   A new .className for the Thing.
     */
    public setClassInitial(thing: IThing, className: string): void {
        thing.className = className;
    }

    /**
     * Adds a string to a Thing's class after a " ", updates the Thing's
     * sprite, and marks it as having changed appearance.
     *
     * @param thing
     * @param className   A class to add to the Thing.
     */
    public addClass(thing: IThing, className: string): void {
        thing.className += " " + className;
    }

    /**
     * Adds multiple strings to a Thing's class after a " ", updates the Thing's
     * sprite, and marks it as having changed appearance. Strings may be given
     * as Arrays or Strings; Strings will be split on " ". Any number of
     * additional arguments may be given.
     *
     * @param thing
     * @param classes   Any number of classes to add to the Thing.
     */
    public addClasses(thing: IThing, ...classes: (string | string[])[]): void {
        for (let classNames of classes) {
            if (
                classNames.constructor === String ||
                typeof classNames === "string"
            ) {
                classNames = classNames.split(" ");
            }

            for (const className of classNames) {
                this.addClass(thing, className);
            }
        }
    }

    /**
     * Removes a string from a Thing's class, updates the Thing's sprite, and
     * marks it as having changed appearance.
     *
     * @param thing
     * @param className   A class to remove from the Thing.
     */
    public removeClass(thing: IThing, className: string): void {
        if (!className) {
            return;
        }
        if (className.indexOf(" ") !== -1) {
            this.removeClasses(thing, className);
        }

        thing.className = thing.className.replace(
            new RegExp(" " + className, "gm"),
            ""
        );
    }

    /**
     * Removes multiple strings from a Thing's class, updates the Thing's
     * sprite, and marks it as having changed appearance. Strings may be given
     * as Arrays or Strings; Strings will be split on " ". Any number of
     * additional arguments may be given.
     *
     * @param thing
     * @param classes   Any number of classes to remove from the Thing.
     */
    public removeClasses(
        thing: IThing,
        ...classes: (string | string[])[]
    ): void {
        for (let classNames of classes) {
            if (typeof classNames === "string") {
                classNames = classNames.split(" ");
            }

            for (const className of classNames) {
                this.removeClass(thing, className);
            }
        }
    }

    /**
     * @param thing
     * @param className   A class to check for in the Thing.
     * @returns  Whether the Thing's class contains the class.
     */
    public hasClass(thing: IThing, className: string): boolean {
        return thing.className.indexOf(className) !== -1;
    }

    /**
     * Removes the first class from a Thing and adds the second. All typical
     * sprite updates are called.
     *
     * @param thing
     * @param classNameOut   A class to remove from the Thing.
     * @param classNameIn   A class to add to the thing.
     */
    public switchClass(
        thing: IThing,
        classNameOut: string,
        classNameIn: string
    ): void {
        this.removeClass(thing, classNameOut);
        this.addClass(thing, classNameIn);
    }
}
