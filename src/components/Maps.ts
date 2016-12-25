import { IAreaSpawnr } from "areaspawnr/lib/IAreaSpawnr";
import { IArea, ILocation, IMap, IPreThingsContainers } from "mapscreatr/lib/IMapsCreatr";
import { IMapsCreatr } from "mapscreatr/lib/IMapsCreatr";
import { IMapScreenr } from "mapscreenr/lib/IMapScreenr";
import { IQuadsKeepr } from "quadskeepr/lib/IQuadsKeepr";
import { ICommand } from "worldseedr/lib/IWorldSeedr";

import { IThing } from "../IGameStartr";
import { Utilities } from "./utilities";

export interface IMapsSettings {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    areaSpawner: IAreaSpawnr;

    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    mapsCreatr: IMapsCreatr;

    /**
     * A flexible container for map attributes and viewport.
     */
    mapScreener: IMapScreenr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * Miscellaneous utility functions used by GameStartr instances.
     */
    utilities: Utilities;
}

/**
 * Maps functions used by IGameStartr instances.
 */
export class Maps {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    private readonly areaSpawner: IAreaSpawnr;

    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    private readonly mapsCreator: IMapsCreatr;

    /**
     * A flexible container for map attributes and viewport.
     */
    private readonly mapScreener: IMapScreenr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    private readonly quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * Miscellaneous utility functions used by GameStartr instances.
     */
    private readonly utilities: Utilities;

    /**
     * Initializes a new instance of the Maps class.
     * 
     * @param settings   Settings to intialize a new instance of the Maps class.
     */
    public constructor(settings: IMapsSettings) {
        this.areaSpawner = settings.areaSpawner;
        this.mapScreener = settings.mapScreener;
        this.quadsKeeper = settings.quadsKeeper;
        this.utilities = settings.utilities;
    }

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
            (left + this.mapScreener.left)
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
            (left + this.mapScreener.left)
        );
    }

    /**
     * Runs through commands generated by a WorldSeedr and evaluates all of 
     * to create PreThings via MapsCreator.analyzePreSwitch. 
     * 
     * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
     */
    public placeRandomCommands(generatedCommands: ICommand[]): void {
        const prethings: IPreThingsContainers = this.areaSpawner.getPreThings();
        const area: IArea = this.areaSpawner.getArea();
        const map: IMap = this.areaSpawner.getMap();

        for (const command of generatedCommands) {
            const output: any = {
                thing: command.title,
                x: command.left,
                y: command.top
            };

            if (command.arguments) {
                this.utilities.proliferateHard(output, command.arguments, true);
            }

            this.mapsCreator.analyzePreSwitch(output, prethings, area, map);
        }
    }
}
