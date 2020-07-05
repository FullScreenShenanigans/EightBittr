import { EightBittr } from "../EightBittr";
import { IThing } from "../types";
import { Section } from "./Section";

/**
 * TODO EXPLAIN
 *
 * @returns Whether to remove the Thing from its group.
 */
export type IThingMaintainer = (thing: IThing) => boolean | undefined | void;

/**
 * Update logic for Things in game ticks.
 */
export class Maintenance<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    public readonly maintainers: [string, IThingMaintainer][] = [];

    public maintainGroup(things: IThing[], maintainer: IThingMaintainer) {
        for (let i = 0; i < things.length; i += 1) {
            const thing = things[i];

            if (thing.removed || maintainer(thing)) {
                this.game.utilities.arrayDeleteThing(thing, things, i);
                i -= 1;
            }
        }
    }
}
