import { EightBittr } from "../../EightBittr";
import { Actor } from "../../types";
import { Section } from "../Section";

/**
 * Adds and removes visual classes for Actors.
 */
export class Classes<Game extends EightBittr> extends Section<Game> {
    /**
     * Sets the class of a Actor, sets the new sprite for it, and marks it as
     * having changed appearance. The class is stored in the Actor's internal
     * .className attribute.
     *
     * @param actor
     * @param className   A new .className for the Actor.
     */
    public setClass(actor: Actor, className: string): void {
        actor.className = className;
    }

    /**
     * A version of setClass to be used before the Actor's sprite attributes
     * have been set. This just sets the internal .className.
     *
     * @param actor
     * @param className   A new .className for the Actor.
     */
    public setClassInitial(actor: Actor, className: string): void {
        actor.className = className;
    }

    /**
     * Adds a string to a Actor's class after a " ", updates the Actor's
     * sprite, and marks it as having changed appearance.
     *
     * @param actor
     * @param className   A class to add to the Actor.
     */
    public addClass(actor: Actor, className: string): void {
        actor.className += " " + className;
    }

    /**
     * Adds multiple strings to a Actor's class after a " ", updates the Actor's
     * sprite, and marks it as having changed appearance. Strings may be given
     * as Arrays or Strings; Strings will be split on " ". Any number of
     * additional arguments may be given.
     *
     * @param actor
     * @param classes   Any number of classes to add to the Actor.
     */
    public addClasses(actor: Actor, ...classes: (string | string[])[]): void {
        for (let classNames of classes) {
            if (classNames.constructor === String || typeof classNames === "string") {
                classNames = classNames.split(" ");
            }

            for (const className of classNames) {
                this.addClass(actor, className);
            }
        }
    }

    /**
     * Removes a string from a Actor's class, updates the Actor's sprite, and
     * marks it as having changed appearance.
     *
     * @param actor
     * @param className   A class to remove from the Actor.
     */
    public removeClass(actor: Actor, className: string): void {
        if (!className) {
            return;
        }
        if (className.indexOf(" ") !== -1) {
            this.removeClasses(actor, className);
        }

        actor.className = actor.className.replace(new RegExp(" " + className, "gm"), "");
    }

    /**
     * Removes multiple strings from a Actor's class, updates the Actor's
     * sprite, and marks it as having changed appearance. Strings may be given
     * as Arrays or Strings; Strings will be split on " ". Any number of
     * additional arguments may be given.
     *
     * @param actor
     * @param classes   Any number of classes to remove from the Actor.
     */
    public removeClasses(actor: Actor, ...classes: (string | string[])[]): void {
        for (let classNames of classes) {
            if (typeof classNames === "string") {
                classNames = classNames.split(" ");
            }

            for (const className of classNames) {
                this.removeClass(actor, className);
            }
        }
    }

    /**
     * @param actor
     * @param className   A class to check for in the Actor.
     * @returns  Whether the Actor's class contains the class.
     */
    public hasClass(actor: Actor, className: string): boolean {
        return actor.className.indexOf(className) !== -1;
    }

    /**
     * Removes the first class from a Actor and adds the second. All typical
     * sprite updates are called.
     *
     * @param actor
     * @param classNameOut   A class to remove from the Actor.
     * @param classNameIn   A class to add to the actor.
     */
    public switchClass(actor: Actor, classNameOut: string, classNameIn: string): void {
        this.removeClass(actor, classNameOut);
        this.addClass(actor, classNameIn);
    }
}
