import { ICommandAdder } from "areaspawnr";
import { ILocation, IMap, IPreThing } from "mapscreatr";

import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Enters and spawns map areas.
 */
export class Maps<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * Function to add an Area provides an "afters" command to add PreThings
     * to the end of an Area.
     */
    public readonly addAfter?: ICommandAdder;

    /**
     * Function for when a PreThing's Thing should be spawned.
     */
    public readonly addPreThing?: (prething: IPreThing) => void;

    /**
     * Entrance Functions that may be used as the openings for Locations.
     */
    public readonly entrances?: any;

    /**
     * Macros that can be used to automate common operations.
     */
    public readonly macros?: any;

    /**
     * Maps that should be immediately stored via a storeMaps call, keyed by name.
     */
    public readonly maps?: any;

    /**
     * Property names to copy from Areas to the MapScreenr during setLocation.
     */
    public readonly screenAttributes?: string[];

    /**
     * Sets the current map.
     *
     * @param name   Name of the new map, if not the current one.
     * @param location   Name of a location in the map to go to.
     * @returns The newly set map.
     */
    public setMap(name?: string, location?: string): ILocation {
        if (!name) {
            name = this.eightBitter.areaSpawner.getMapName();
        }

        const map: IMap = this.eightBitter.areaSpawner.setMap(name);

        if (location) {
            return this.setLocation(location);
        }

        for (const locationName in map.locations) {
            if ({}.hasOwnProperty.call(map.locations, locationName)) {
                return this.setLocation(locationName);
            }
        }

        throw new Error(`Map '${name}' has no locations.`);
    }

    /**
     * Sets the current location.
     *
     * @param name   Name of the new location.
     * @returns The newly set location.
     */
    public setLocation(name: string): ILocation {
        this.eightBitter.mapScreener.clearScreen();
        this.eightBitter.quadsKeeper.resetQuadrants();

        return this.eightBitter.areaSpawner.setLocation(name);
    }

    /**
     * Spawns all Things within a given area that should be there.
     *
     * @param direction   The direction spawning comes from.
     * @param top   A top boundary to spawn within.
     * @param right   A right boundary to spawn within.
     * @param bottom   A bottom boundary to spawn within.
     * @param left   A left boundary to spawn within.
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    public onAreaSpawn(
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number
    ): void {
        this.eightBitter.areaSpawner.spawnArea(
            direction,
            top + this.eightBitter.mapScreener.top,
            right + this.eightBitter.mapScreener.left,
            bottom + this.eightBitter.mapScreener.top,
            left + this.eightBitter.mapScreener.left
        );
    }

    /**
     * "Unspawns" all Things within a given area that should be gone by marking
     * their PreThings as not in game.
     *
     * @param direction   The direction spawning comes from.
     * @param top   A top boundary to spawn within.
     * @param right   A right boundary to spawn within.
     * @param bottom   A bottom boundary to spawn within.
     * @param left   A left boundary to spawn within.
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    public onAreaUnspawn(
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number
    ): void {
        this.eightBitter.areaSpawner.unspawnArea(
            direction,
            top + this.eightBitter.mapScreener.top,
            right + this.eightBitter.mapScreener.left,
            bottom + this.eightBitter.mapScreener.top,
            left + this.eightBitter.mapScreener.left
        );
    }
}
