/// <reference path="../typings/EightBittr.d.ts" />

import { IThing } from "./IGameStartr";
import { GameStartr } from "./GameStartr";

/**
 * Graphics functions used by GameStartr instances.
 */
export class Graphics<TIEightBittr extends GameStartr> extends EightBittr.Component<TIEightBittr> {
    /**
     * Generates a key for a Thing based off the Thing's basic attributes. 
     * This key should be used for PixelRender.get calls, to cache the Thing's
     * sprite.
     * 
     * @param thing
     * @returns A key that to identify the Thing's sprite.
     */
    public generateThingKey(thing: IThing): string {
        return thing.groupType + " " + thing.title + " " + thing.className;
    }

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
        this.EightBitter.PixelDrawer.setThingSprite(thing);
        this.EightBitter.physics.markChanged(thing);
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
        this.EightBitter.PixelDrawer.setThingSprite(thing);
        this.EightBitter.physics.markChanged(thing);
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
            if (classNames.constructor === String || typeof classNames === "string") {
                classNames = (classNames as string).split(" ");
            }

            for (const className of classNames as string[]) {
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

        thing.className = thing.className.replace(new RegExp(" " + className, "gm"), "");
        this.EightBitter.physics.markChanged(thing);
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
    public removeClasses(thing: IThing, ...classes: (string | string[])[]): void {
        for (let classNames of classes) {
            if (classNames.constructor === String || typeof classNames === "string") {
                classNames = (classNames as string).split(" ");
            }

            for (const className of classNames as string[]) {
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
    public switchClass(thing: IThing, classNameOut: string, classNameIn: string): void {
        this.removeClass(thing, classNameOut);
        this.addClass(thing, classNameIn);
    }

    /**
     * Marks a Thing as being flipped horizontally by setting its .flipHoriz
     * attribute to true and giving it a "flipped" class.
     * 
     * @param thing
     */
    public flipHoriz(thing: IThing): void {
        thing.flipHoriz = true;
        this.addClass(thing, "flipped");
    }

    /**
     * Marks a Thing as being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param thing
     */
    public flipVert(thing: IThing): void {
        thing.flipVert = true;
        this.addClass(thing, "flip-vert");
    }

    /**
     * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
     * attribute to false and giving it a "flipped" class.
     * 
     * @param thing
     */
    public unflipHoriz(thing: IThing): void {
        thing.flipHoriz = false;
        this.removeClass(thing, "flipped");
    }

    /**
     * Marks a Thing as not being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param thing
     */
    public unflipVert(thing: IThing): void {
        thing.flipVert = false;
        this.removeClass(thing, "flip-vert");
    }

    /**
     * Sets the opacity of the Thing and marks its appearance as changed.
     * 
     * @param thing
     * @param opacity   A number in [0,1].
     */
    public setOpacity(thing: IThing, opacity: number): void {
        thing.opacity = opacity;
        this.EightBitter.physics.markChanged(thing);
    }
}
