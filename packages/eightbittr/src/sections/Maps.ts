import { CommandAdder } from "areaspawnr";
import { Location, Map, PreActorLike } from "mapscreatr";

import { EightBittr } from "../EightBittr";
import { Section } from "./Section";

/**
 * Enters and spawns map areas.
 */
export class Maps<Game extends EightBittr> extends Section<Game> {
    /**
     * Function to add an Area provides an "afters" command to add PreActors
     * to the end of an Area.
     */
    public readonly addAfter?: CommandAdder;

    /**
     * Function for when a PreActor's Actor should be spawned.
     */
    public readonly addPreActor?: (preActor: PreActorLike) => void;

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
    public setMap(name?: string, location?: string): Location {
        if (!name) {
            name = this.game.areaSpawner.getMapName();
        }

        const map: Map = this.game.areaSpawner.setMap(name);

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
    public setLocation(name: string): Location {
        this.game.mapScreener.clearScreen();
        this.game.quadsKeeper.resetQuadrants();

        return this.game.areaSpawner.setLocation(name);
    }

    /**
     * Spawns all Actors within a given area that should be there.
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
        this.game.areaSpawner.spawnArea(
            direction,
            top + this.game.mapScreener.top,
            right + this.game.mapScreener.left,
            bottom + this.game.mapScreener.top,
            left + this.game.mapScreener.left
        );
    }

    /**
     * "Unspawns" all Actors within a given area that should be gone by marking
     * their PreActors as not in game.
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
        this.game.areaSpawner.unspawnArea(
            direction,
            top + this.game.mapScreener.top,
            right + this.game.mapScreener.left,
            bottom + this.game.mapScreener.top,
            left + this.game.mapScreener.left
        );
    }
}
