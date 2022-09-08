import { factory, member } from "autofieldr";
import { Actor, EightBittr, EightBittrConstructorSettings } from "eightbittr";
import { GroupHoldr } from "groupholdr";
import { WorldSeedr } from "worldseedr";

import { createWorldSeeder } from "./creators/createWorldSeeder";
import { Graphics } from "./sections/Graphics";
import { Groups } from "./sections/Groups";
import { Objects } from "./sections/Objects";

/**
 * Example game with EightBittr tooling
 */
export class InfiniteContributionsCalendar extends EightBittr {
    /**
     * Stores the visual appearance of Actors.
     */
    @member(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Collection settings for Actor group names.
     */
    @member(Groups)
    public readonly groups: Groups<this>;

    /**
     * General storage abstraction for keyed containers of items.
     */
    public readonly groupHolder: GroupHoldr<{
        Squares: Actor;
        Players: Actor;
        Text: Actor;
    }>;

    /**
     * Raw ObjectMakr factory settings.
     */
    @member(Objects)
    public readonly objects: Objects<this>;

    /**
     * Schema-driven pseudorandom recursive generation of possibilities.
     */
    @factory(createWorldSeeder)
    public readonly worldSeeder: WorldSeedr;

    /**
     * Initializes a new instance of the InfiniteContributionsCalendar class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: EightBittrConstructorSettings) {
        super(settings);

        this.quadsKeeper.resetQuadrants();

        const height = roundUpTo(settings.height, 12);
        const width = roundUpTo(settings.width, 12);

        const results = this.worldSeeder.generate("Area", {
            bottom: 0,
            left: 0,
            right: width,
            top: height,
        });

        for (const result of results) {
            this.actors.add(result.title, result.area.left, height - result.area.top);
        }
    }
}

function roundUpTo(amount: number, rounder: number) {
    return Math.ceil(amount / rounder) * rounder;
}
