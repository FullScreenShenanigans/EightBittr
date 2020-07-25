import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

import { Section } from "./Section";

/**
 * Adds and processes new Actors into the game.
 */
export class Actors<Game extends EightBittr> extends Section<Game> {
    /**
     * Adds a new Actor to the game at a given position, relative to the top
     * left corner of the screen.
     *
     * @param actorRaw   What type of Actor to add.
     * @param left   The horizontal point to place the Actor's left at (by default, 0).
     * @param top   The vertical point to place the Actor's top at (by default, 0).
     */
    public add(actorRaw: string | Actor | [string, any], left = 0, top = 0): Actor {
        let actor: Actor;

        if (typeof actorRaw === "string") {
            actor = this.game.objectMaker.make<Actor>(actorRaw);
        } else if (actorRaw.constructor === Array) {
            actor = this.game.objectMaker.make<Actor>(actorRaw[0], actorRaw[1]);
        } else {
            actor = actorRaw as Actor;
        }

        if (arguments.length > 2) {
            this.game.physics.setLeft(actor, left);
            this.game.physics.setTop(actor, top);
        } else if (arguments.length > 1) {
            this.game.physics.setLeft(actor, left);
        }

        this.game.groupHolder.addToGroup(actor, actor.groupType);
        this.game.actorHitter.cacheChecksForType(actor.groupType, actor.title);

        actor.placed = true;
        actor.onActorAdded?.call(this, actor);

        return actor;
    }

    /**
     * Processes a Actor so that it is ready to be placed in gameplay.
     *
     * @param actor   The Actor being processed.
     * @param title   What type Actor this is (the name of the class).
     * @param settings   Additional settings to be given to the Actor.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    public process(actor: Actor, title: string): void {
        actor.title = actor.title || title;

        const defaults = this.game.objectMaker.getPrototypeOf<Actor>(title);

        if (actor.height && !actor.spriteheight) {
            actor.spriteheight = defaults.spriteheight || defaults.height;
        }
        if (actor.width && !actor.spritewidth) {
            actor.spritewidth = defaults.spritewidth || defaults.width;
        }

        actor.spriteheight = actor.spriteheight || actor.height;
        actor.spritewidth = actor.spritewidth || actor.width;

        actor.maxquads = this.getMaxOccupiedQuadrants(actor);
        actor.quadrants = new Array(actor.maxquads);

        if (actor.opacity !== 1) {
            this.game.graphics.opacity.setOpacity(actor, actor.opacity);
        }

        actor.onActorMake?.(actor);

        // Initial class / sprite setting
        this.game.physics.setSize(actor, actor.width, actor.height);
        this.game.graphics.classes.setClassInitial(actor, actor.name || actor.title);
    }

    /**
     * Determines how many quadrants a Actor can occupy at most.
     *
     * @param actor
     * @returns How many quadrants the Actor can occupy at most.
     */
    private getMaxOccupiedQuadrants(actor: Actor): number {
        const maxHoriz: number =
            Math.ceil(actor.width / this.game.quadsKeeper.getQuadrantWidth()) + 1;
        const maxVert: number =
            Math.ceil(actor.height / this.game.quadsKeeper.getQuadrantHeight()) + 1;

        return maxHoriz * maxVert;
    }
}
