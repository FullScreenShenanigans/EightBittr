import { IGroupHoldr } from "groupholdr/lib/IGroupHoldr";
import { IModAttachr } from "modattachr/lib/IModAttachr";
import { IObjectMakr } from "objectmakr/lib/IObjectMakr";
import { IPixelDrawr } from "pixeldrawr/lib/IPixelDrawr";
import { IQuadsKeepr } from "quadskeepr/lib/IQuadsKeepr";
import { ITimeHandlr } from "timehandlr/lib/ITimeHandlr";

import { IThing } from "../IGameStartr";
import { Graphics } from "./Graphics";
import { Physics } from "./Physics";
import { Utilities } from "./Utilities";

export interface IThingsSettings {
    /**
     * Graphics functions used by GameStartr instances.
     */
    graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    groupHolder: IGroupHoldr;

    /**
     * Hookups for extensible triggered mod events.
     */
    modAttacher: IModAttachr;

    /**
     * Physics functions used by GameStartr instances.
     */
    physics: Physics;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    objectMaker: IObjectMakr;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    pixelDrawer: IPixelDrawr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    timeHandler: ITimeHandlr;

    /**
     * Miscellaneous utility functions used by GameStartr instances.
     */
    utilities: Utilities;
}

/**
 * Thing manipulation functions used by IGameStartr instances.
 */
export class Things {
    /**
     * Graphics functions used by GameStartr instances.
     */
    private readonly graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    private readonly groupHolder: IGroupHoldr;

    /**
     * Hookups for extensible triggered mod events.
     */
    private readonly modAttacher: IModAttachr;

    /**
     * Physics functions used by GameStartr instances.
     */
    private readonly physics: Physics;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    private readonly objectMaker: IObjectMakr;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    private readonly pixelDrawer: IPixelDrawr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    private readonly quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    private readonly timeHandler: ITimeHandlr;

    /**
     * Miscellaneous utility functions used by GameStartr instances.
     */
    private readonly utilities: Utilities;

    /**
     * Initializes a new instance of the Things class.
     * 
     * @param settings   Settings to intialize a new instance of the Things class.
     */
    public constructor(settings: IThingsSettings) {
        this.graphics = settings.graphics;
        this.groupHolder = settings.groupHolder;
        this.modAttacher = settings.modAttacher;
        this.physics = settings.physics;
        this.objectMaker = settings.objectMaker;
        this.pixelDrawer = settings.pixelDrawer;
        this.quadsKeeper = settings.quadsKeeper;
        this.timeHandler = settings.timeHandler;
        this.utilities = settings.utilities;
    }

    /**
     * Adds a new Thing to the game at a given position, relative to the top
     * left corner of the screen. 
     * 
     * @param thingRaw   What type of Thing to add.
     * @param left   The horizontal point to place the Thing's left at (by default, 0).
     * @param top   The vertical point to place the Thing's top at (by default, 0).
     */
    public add(thingRaw: string | IThing | [string, any], left: number = 0, top: number = 0): IThing {
        let thing: IThing;

        if (typeof thingRaw === "string" || thingRaw instanceof String) {
            thing = this.objectMaker.make(thingRaw as string);
        } else if (thingRaw.constructor === Array) {
            thing = this.objectMaker.make((thingRaw as [string, any])[0], (thingRaw as [string, any])[1]);
        } else {
            thing = thingRaw as IThing;
        }

        if (arguments.length > 2) {
            this.physics.setLeft(thing, left);
            this.physics.setTop(thing, top);
        } else if (arguments.length > 1) {
            this.physics.setLeft(thing, left);
        }

        this.physics.updateSize(thing);

        this.groupHolder.getFunctions().add[thing.groupType](thing);
        thing.placed = true;

        if (thing.onThingAdd) {
            thing.onThingAdd.call(this, thing);
        }

        this.pixelDrawer.setThingSprite(thing);

        if (thing.onThingAdded) {
            thing.onThingAdded.call(this, thing);
        }

        this.modAttacher.fireEvent("onAddThing", thing, left, top);

        return thing;
    }

    /**
     * Processes a Thing so that it is ready to be placed in gameplay.
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
        let numQuads: number = Math.floor(thing.width * (this.quadsKeeper.getQuadrantWidth()));

        if (numQuads > 0) {
            maxQuads += ((numQuads + 1) * maxQuads / 2);
        }
        numQuads = Math.floor(thing.height * this.quadsKeeper.getQuadrantHeight());
        if (numQuads > 0) {
            maxQuads += ((numQuads + 1) * maxQuads / 2);
        }
        thing.maxquads = maxQuads;
        thing.quadrants = new Array(maxQuads);

        // Basic sprite information
        thing.spritewidth = thing.spritewidth || thing.width;
        thing.spriteheight = thing.spriteheight || thing.height;

        // Canvas, context
        thing.canvas = this.utilities.createCanvas(thing.spritewidth, thing.spriteheight);
        thing.context = thing.canvas.getContext("2d")!;

        if (thing.opacity !== 1) {
            this.graphics.setOpacity(thing, thing.opacity);
        }

        // Attributes, such as Koopa.smart
        if (thing.attributes) {
            this.processAttributes(thing, thing.attributes);
        }

        // Important custom functions
        if (thing.onThingMake) {
            thing.onThingMake.call(this, thing, settings);
        }

        // Initial class / sprite setting
        this.physics.setSize(thing, thing.width, thing.height);
        this.graphics.setClassInitial(thing, thing.name || thing.title);

        // Sprite cycles
        /* tslint:disable no-conditional-assignment */
        let cycle: any;
        if (cycle = thing.spriteCycle) {
            this.timeHandler.addClassCycle(thing, cycle[0], cycle[1] || undefined, cycle[2] || undefined);
        }
        if (cycle = thing.spriteCycleSynched) {
            this.timeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || undefined, cycle[2] || undefined);
        }
        /* tslint:enable */

        if (thing.flipHoriz) {
            this.graphics.flipHoriz(thing);
        }
        if (thing.flipVert) {
            this.graphics.flipVert(thing);
        }

        this.modAttacher.fireEvent("onThingMake", this, thing, title, settings, defaults);
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
        for (const attribute in attributes) {
            if ((thing as any)[attribute]) {
                this.utilities.proliferate(thing, attributes[attribute]);

                if (thing.name) {
                    thing.name += " " + attribute;
                } else {
                    thing.name = thing.title + " " + attribute;
                }
            }
        }
    }
}
