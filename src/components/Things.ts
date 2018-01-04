import { dependency } from "babyioc";
import { GroupHoldr } from "groupholdr";
import { ModAttachr } from "modattachr";
import { ObjectMakr } from "objectmakr";
import { QuadsKeepr } from "quadskeepr";
import { TimeHandlr } from "timehandlr";

import { IThing } from "../IGameStartr";
import { Graphics } from "./Graphics";
import { Physics } from "./Physics";
import { Utilities } from "./Utilities";

/**
 * Thing manipulation functions used by IGameStartr instances.
 */
export class Things {
    @dependency(Graphics)
    private readonly graphics: Graphics;

    @dependency(GroupHoldr)
    private readonly groupHolder: GroupHoldr<any>;

    @dependency(ModAttachr)
    private readonly modAttacher: ModAttachr;

    @dependency(ObjectMakr)
    private readonly objectMaker: ObjectMakr;

    @dependency(Physics)
    private readonly physics: Physics;

    @dependency(QuadsKeepr)
    private readonly quadsKeeper: QuadsKeepr<IThing>;

    @dependency(TimeHandlr)
    private readonly timeHandler: TimeHandlr;

    @dependency(Utilities)
    private readonly utilities: Utilities;

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
            thing = this.objectMaker.make<IThing>(thingRaw as string);
        } else if (thingRaw.constructor === Array) {
            thing = this.objectMaker.make<IThing>((thingRaw as [string, any])[0], (thingRaw as [string, any])[1]);
        } else {
            thing = thingRaw as IThing;
        }

        if (arguments.length > 2) {
            this.physics.setLeft(thing, left);
            this.physics.setTop(thing, top);
        } else if (arguments.length > 1) {
            this.physics.setLeft(thing, left);
        }

        this.groupHolder.addToGroup(thing, thing.groupType);
        thing.placed = true;

        if (thing.onThingAdd) {
            thing.onThingAdd.call(this, thing);
        }

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
        thing.title = thing.title || title;

        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }

        thing.spritewidth = thing.spritewidth || thing.width;
        thing.spriteheight = thing.spriteheight || thing.height;

        thing.maxquads = this.getMaxOccupiedQuadrants(thing);
        thing.quadrants = new Array(thing.maxquads);

        if (thing.opacity !== 1) {
            this.graphics.setOpacity(thing, thing.opacity);
        }

        if (thing.attributes) {
            this.processAttributes(thing, thing.attributes);
        }

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
    protected processAttributes(thing: IThing, attributes: { [i: string]: string }): void {
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

    /**
     * Determines how many quadrants a Thing can occupy at most.
     *
     * @param thing
     * @returns How many quadrants the Thing can occupy at most.
     */
    protected getMaxOccupiedQuadrants(thing: IThing): number {
        const maxHoriz: number = ((this.quadsKeeper.getQuadrantWidth() / thing.width) | 0) + 2;
        const maxVert: number = ((this.quadsKeeper.getQuadrantHeight() / thing.height) | 0) + 2;

        return maxHoriz * maxVert;
    }
}
