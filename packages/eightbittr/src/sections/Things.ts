import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

import { Section } from "./Section";

/**
 * Adds and processes new Things into the game.
 */
export class Things<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Adds a new Thing to the game at a given position, relative to the top
     * left corner of the screen.
     *
     * @param thingRaw   What type of Thing to add.
     * @param left   The horizontal point to place the Thing's left at (by default, 0).
     * @param top   The vertical point to place the Thing's top at (by default, 0).
     */
    public add(thingRaw: string | IThing | [string, any], left = 0, top = 0): IThing {
        let thing: IThing;

        if (typeof thingRaw === "string" || thingRaw instanceof String) {
            thing = this.game.objectMaker.make<IThing>(thingRaw as string);
        } else if (thingRaw.constructor === Array) {
            thing = this.game.objectMaker.make<IThing>(
                (thingRaw as [string, any])[0],
                (thingRaw as [string, any])[1]
            );
        } else {
            thing = thingRaw as IThing;
        }

        if (arguments.length > 2) {
            this.game.physics.setLeft(thing, left);
            this.game.physics.setTop(thing, top);
        } else if (arguments.length > 1) {
            this.game.physics.setLeft(thing, left);
        }

        this.game.groupHolder.addToGroup(thing, thing.groupType);
        thing.placed = true;

        if (thing.onThingAdd) {
            thing.onThingAdd.call(this, thing);
        }

        if (thing.onThingAdded) {
            thing.onThingAdded.call(this, thing);
        }

        this.game.modAttacher.fireEvent("onAddThing", thing, left, top);

        return thing;
    }

    /**
     * Processes a Thing so that it is ready to be placed in gameplay.
     *
     * @param thing   The Thing being processed.
     * @param title   What type Thing this is (the name of the class).
     * @param settings   Additional settings to be given to the Thing.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    public process(thing: IThing, title: string): void {
        thing.title = thing.title || title;

        const defaults = this.game.objectMaker.getPrototypeOf<IThing>(title);

        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }
        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }

        thing.spriteheight = thing.spriteheight || thing.height;
        thing.spritewidth = thing.spritewidth || thing.width;

        thing.maxquads = this.getMaxOccupiedQuadrants(thing);
        thing.quadrants = new Array(thing.maxquads);

        if (thing.opacity !== 1) {
            this.game.graphics.opacity.setOpacity(thing, thing.opacity);
        }

        if (thing.attributes) {
            this.processAttributes(thing, thing.attributes);
        }

        if (thing.onThingMake) {
            thing.onThingMake.call(this, thing);
        }

        // Initial class / sprite setting
        this.game.physics.setSize(thing, thing.width, thing.height);
        this.game.graphics.classes.setClassInitial(thing, thing.name || thing.title);

        // Sprite cycles
        let cycle: any;
        if ((cycle = thing.spriteCycle)) {
            this.game.classCycler.addClassCycle(thing, cycle[0], cycle[1], cycle[2]);
        }
        if ((cycle = thing.spriteCycleSynched)) {
            this.game.classCycler.addClassCycleSynched(thing, cycle[0], cycle[1], cycle[2]);
        }
        /* tslint:enable */

        if (thing.flipHoriz) {
            this.game.graphics.flipping.flipHoriz(thing);
        }
        if (thing.flipVert) {
            this.game.graphics.flipping.flipVert(thing);
        }

        this.game.modAttacher.fireEvent("onThingMake", this, thing, title);
    }

    /**
     * Processes additional Thing attributes. For each attribute the Thing's
     * class says it may have, if it has it, the attribute's key is appeneded to
     * the Thing's name and the attribute value proliferated onto the Thing.
     *
     * @param thing
     * @param attributes   A lookup of attributes that may be added to the Thing's class.
     */
    private processAttributes(thing: IThing, attributes: { [i: string]: string }): void {
        for (const attribute in attributes) {
            if ((thing as any)[attribute]) {
                this.game.utilities.proliferate(thing, attributes[attribute]);

                if (thing.name) {
                    thing.name += " " + attribute;
                } else {
                    thing.name = thing.title + " " + attribute;
                }
            }
        }
    }

    /**
     * Determines how many quadrants a Thing can occupy at most.
     *
     * @param thing
     * @returns How many quadrants the Thing can occupy at most.
     */
    private getMaxOccupiedQuadrants(thing: IThing): number {
        const maxHoriz: number =
            Math.ceil(thing.width / this.game.quadsKeeper.getQuadrantWidth()) + 1;
        const maxVert: number =
            Math.ceil(thing.height / this.game.quadsKeeper.getQuadrantHeight()) + 1;

        return maxHoriz * maxVert;
    }
}
