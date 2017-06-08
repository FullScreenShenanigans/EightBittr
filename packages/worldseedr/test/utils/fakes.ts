import { IWorldSeedr, IWorldSeedrSettings } from "../../src/IWorldSeedr";
import { WorldSeedr } from "../../src/WorldSeedr";

/**
 *
 */
export function mockWorldSeedr(settings: IWorldSeedrSettings): IWorldSeedr {
    return new WorldSeedr(settings);
}
