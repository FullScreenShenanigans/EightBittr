import { Component } from "eightbittr/lib/Component";

import { GameStartr } from "./GameStartr";
import { IThing } from "./IGameStartr";

/**
 * Thing manipulation functions used by IGameStartr instances.
 */
export class Things<TEightBittr extends GameStartr> extends Component<TEightBittr> {
    /**
     * Adds a new Thing to the game at a given position, relative to the top
     * left corner of the screen. 
     * 
     * @param thingRaw   What type of Thing to add. This may be a String of
     *                   the class title, an Array containing the String
     *                   and an Object of settings, or an actual Thing.
     * @param left   The horizontal point to place the Thing's left at (by default, 0).
     * @param top   The vertical point to place the Thing's top at (by default, 0).
     */
    public add(thingRaw: string | IThing | [string, any], left: number = 0, top: number = 0): IThing {
        let thing: IThing;

        if (typeof thingRaw === "string" || thingRaw instanceof String) {
            thing = this.eightBitter.objectMaker.make(thingRaw as string);
        } else if (thingRaw.constructor === Array) {
            thing = this.eightBitter.objectMaker.make((thingRaw as [string, any])[0], (thingRaw as [string, any])[1]);
        } else {
            thing = thingRaw as IThing;
        }

        if (arguments.length > 2) {
            this.eightBitter.physics.setLeft(thing, left);
            this.eightBitter.physics.setTop(thing, top);
        } else if (arguments.length > 1) {
            this.eightBitter.physics.setLeft(thing, left);
        }

        this.eightBitter.physics.updateSize(thing);

        this.eightBitter.groupHolder.getFunctions().add[thing.groupType](thing);
        thing.placed = true;

        // This will typically be a TimeHandler.cycleClass call
        if (thing.onThingAdd) {
            thing.onThingAdd.call(this, thing);
        }

        this.eightBitter.pixelDrawer.setThingSprite(thing);

        // This will typically be a spawn* call
        if (thing.onThingAdded) {
            thing.onThingAdded.call(this, thing);
        }

        this.eightBitter.modAttacher.fireEvent("onAddThing", thing, left, top);

        return thing;
    }

    /**
     * Processes a Thing so that it is ready to be placed in gameplay. There are
     * a lot of steps here: width and height must be set with defaults and given
     * to spritewidth and spriteheight, a quadrants Array must be given, the 
     * sprite must be set, attributes and onThingMake called upon, and initial
     * class cycles and flipping set.
     * 
     * @param thing   The Thing being processed.
     * @param title   What type Thing this is (the name of the class).
     * @param settings   Additional settings to be given to the Thing.
     * @param defaults   The default settings for the Thing's class.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    public process(thing: IThing, title: string, settings: any, defaults: any): void {
        let maxQuads: number = 4;

        // If the Thing doesn't specify its own title, use the type by default
        thing.title = thing.title || title;

        // If a width/height is provided but no spritewidth/height,
        // use the default spritewidth/height
        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }

        // Each thing has at least 4 maximum quadrants for the QuadsKeepr
        let numQuads: number = Math.floor(
            thing.width * (
                this.eightBitter.unitsize / this.eightBitter.quadsKeeper.getQuadrantWidth()));

        if (numQuads > 0) {
            maxQuads += ((numQuads + 1) * maxQuads / 2);
        }
        numQuads = Math.floor(thing.height * this.eightBitter.unitsize / this.eightBitter.quadsKeeper.getQuadrantHeight());
        if (numQuads > 0) {
            maxQuads += ((numQuads + 1) * maxQuads / 2);
        }
        thing.maxquads = maxQuads;
        thing.quadrants = new Array(maxQuads);

        // Basic sprite information
        thing.spritewidth = thing.spritewidth || thing.width;
        thing.spriteheight = thing.spriteheight || thing.height;

        // Sprite sizing
        thing.spritewidthpixels = thing.spritewidth * this.eightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * this.eightBitter.unitsize;

        // Canvas, context
        thing.canvas = this.eightBitter.utilities.createCanvas(
            thing.spritewidthpixels, thing.spriteheightpixels
        );
        thing.context = thing.canvas.getContext("2d")!;

        if (thing.opacity !== 1) {
            this.eightBitter.graphics.setOpacity(thing, thing.opacity);
        }

        // Attributes, such as Koopa.smart
        if (thing.attributes) {
            this.eightBitter.things.processAttributes(thing, thing.attributes);
        }

        // Important custom functions
        if (thing.onThingMake) {
            thing.onThingMake.call(this, thing, settings);
        }

        // Initial class / sprite setting
        this.eightBitter.physics.setSize(thing, thing.width, thing.height);
        this.eightBitter.graphics.setClassInitial(thing, thing.name || thing.title);

        // Sprite cycles
        /* tslint:disable no-conditional-assignment */
        let cycle: any;
        if (cycle = thing.spriteCycle) {
            this.eightBitter.timeHandler.addClassCycle(thing, cycle[0], cycle[1] || undefined, cycle[2] || undefined);
        }
        if (cycle = thing.spriteCycleSynched) {
            this.eightBitter.timeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || undefined, cycle[2] || undefined);
        }
        /* tslint:enable */

        if (thing.flipHoriz) {
            this.eightBitter.graphics.flipHoriz(thing);
        }
        if (thing.flipVert) {
            this.eightBitter.graphics.flipVert(thing);
        }

        this.eightBitter.modAttacher.fireEvent("onThingMake", this, thing, title, settings, defaults);
    }

    /**
     * Processes additional Thing attributes. For each attribute the Thing's
     * class says it may have, if it has it, the attribute's key is appeneded to
     * the Thing's name and the attribute value proliferated onto the Thing.
     * 
     * @param thing
     * @param attributes   A lookup of attributes that may be added to the Thing's class.
     */
    public processAttributes(thing: IThing, attributes: { [i: string]: string }): void {
        // For each listing in the attributes...
        for (const attribute in attributes) {
            // If the thing has that attribute as true:
            if ((thing as any)[attribute]) {
                // Add the extra options
                this.eightBitter.utilities.proliferate(thing, attributes[attribute]);

                // Also add a marking to the name, which will go into the className
                if (thing.name) {
                    thing.name += " " + attribute;
                } else {
                    thing.name = thing.title + " " + attribute;
                }
            }
        }
    }
}
