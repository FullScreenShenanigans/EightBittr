import { AreaSpawnr } from "areaspawnr";
import { dependency } from "babyioc";
import { ILocation, IMap, MapsCreatr } from "mapscreatr";
import { MapScreenr } from "mapscreenr";
import { QuadsKeepr } from "quadskeepr";

import { IThing } from "../IGameStartr";

/**
 * Maps functions used by IGameStartr instances.
 */
export class Maps {
    @dependency(AreaSpawnr)
    private readonly areaSpawner: AreaSpawnr;

    @dependency(MapScreenr)
    private readonly mapScreener: MapScreenr;

    @dependency(QuadsKeepr)
    private readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * Sets the current map.
     *
     * @param name   Name of the new map, if not the current one.
     * @param location   Name of a location in the map to go to.
     * @returns The newly set map.
     */
    public setMap(name?: string, location?: string): ILocation {
        if (!name) {
            name = this.areaSpawner.getMapName();
        }

        const map: IMap = this.areaSpawner.setMap(name);

        if (location) {
            return this.setLocation(location);
        }

        for (const locationName in map.locations) {
            if (window.hasOwnProperty.call(map.locations, locationName)) {
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
        this.mapScreener.clearScreen();
        this.quadsKeeper.resetQuadrants();

        return this.areaSpawner.setLocation(name);
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
    public onAreaSpawn(direction: string, top: number, right: number, bottom: number, left: number): void {
        this.areaSpawner.spawnArea(
            direction,
            (top + this.mapScreener.top),
            (right + this.mapScreener.left),
            (bottom + this.mapScreener.top),
            (left + this.mapScreener.left),
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
    public onAreaUnspawn(direction: string, top: number, right: number, bottom: number, left: number): void {
        this.areaSpawner.unspawnArea(
            direction,
            (top + this.mapScreener.top),
            (right + this.mapScreener.left),
            (bottom + this.mapScreener.top),
            (left + this.mapScreener.left),
        );
    }
}
