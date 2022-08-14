/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Area,
    Location,
    Map,
    MapsCreatr,
    PreActor,
    PreActorLike,
    PreActorsContainers,
    PreActorSettings,
} from "mapscreatr";
import { MapScreenr } from "mapscreenr";

import { AreaSpawnrSettings, CommandAdder } from "./types";

/**
 * Directional equivalents for converting from directions to keys.
 */
const directionKeys: Record<string, string> = {
    xDec: "right",
    xInc: "left",
    yDec: "bottom",
    yInc: "top",
};

/**
 * Opposite directions for when finding descending order Arrays.
 */
const directionOpposites: Record<string, string> = {
    xDec: "xInc",
    xInc: "xDec",
    yDec: "yInc",
    yInc: "yDec",
};

/**
 * Conditionally returns a measurement based on what direction String is
 * given. This is useful for generically finding boundaries when the
 * direction isn't known, such as in findPreActorsSpawnStart and -End.
 *
 * @param direction   The direction by which to order PreActors, as "xInc",
 *                    "xDec", "yInc", or "yDec".
 * @param top   The upper-most bound to apply within.
 * @param right   The right-most bound to apply within.
 * @param bottom    The bottom-most bound to apply within.
 * @param left    The left-most bound to apply within.
 * @returns Either top, right, bottom, or left, depending on direction.
 */
const getDirectionEnd = (
    directionKey: string,
    top: number,
    right: number,
    bottom: number,
    left: number
) => {
    switch (directionKey) {
        case "top":
            return top;
        case "right":
            return right;
        case "bottom":
            return bottom;
        case "left":
            return left;
        default:
            throw new Error(`Unknown directionKey: '${directionKey}'.`);
    }
};

/**
 * Finds the index from which PreActors should stop having an action
 * applied to them in applySpawnAction. This is less efficient than the
 * unused version below, but is more reliable for slightly unsorted groups.
 *
 * @param direction   The direction by which to order PreActors, as "xInc",
 *                    "xDec", "yInc", or "yDec".
 * @param group   The group to find a PreActor index within.
 * @param _mid   The middle of the group. This is currently unused.
 * @param top   The upper-most bound to apply within.
 * @param right   The right-most bound to apply within.
 * @param bottom    The bottom-most bound to apply within.
 * @param left    The left-most bound to apply within.
 * @returns The index to start spawning PreActors from.
 */
const findPreActorsSpawnStart = (
    direction: string,
    group: PreActorLike[],
    top: number,
    right: number,
    bottom: number,
    left: number
) => {
    const directionKey = directionKeys[direction];
    const directionEnd = getDirectionEnd(directionKey, top, right, bottom, left);

    for (let i = 0; i < group.length; i += 1) {
        if ((group as any)[i][directionKey] >= directionEnd) {
            return i;
        }
    }

    return group.length;
};

/**
 * Finds the index from which PreActors should stop having an action
 * applied to them in applySpawnAction. This is less efficient than the
 * unused version below, but is more reliable for slightly unsorted groups.
 *
 * @param direction   The direction by which to order PreActors, as "xInc",
 *                    "xDec", "yInc", or "yDec".
 * @param group   The group to find a PreActor index within.
 * @param _mid   The middle of the group. This is currently unused.
 * @param top   The upper-most bound to apply within.
 * @param right   The right-most bound to apply within.
 * @param bottom    The bottom-most bound to apply within.
 * @param left    The left-most bound to apply within.
 * @returns The index to stop spawning PreActors from.
 */
const findPreActorsSpawnEnd = (
    direction: string,
    group: PreActorLike[],
    top: number,
    right: number,
    bottom: number,
    left: number
) => {
    const directionKey = directionKeys[direction];
    const directionKeyOpposite = directionKeys[directionOpposites[direction]];
    const directionEnd = getDirectionEnd(directionKeyOpposite, top, right, bottom, left);

    for (let i = group.length - 1; i >= 0; i -= 1) {
        if ((group[i] as any)[directionKey] <= directionEnd) {
            return i;
        }
    }

    return -1;
};

/**
 * Loads EightBittr maps to spawn and unspawn areas on demand.
 */
export class AreaSpawnr {
    /**
     * Storage container and lazy loader for EightBittr maps.
     */
    private readonly mapsCreator: MapsCreatr;

    /**
     * MapScreenr container for attributes copied from Areas.
     */
    private readonly mapScreenr: MapScreenr;

    /**
     * The names of attributes to be copied to the MapScreenr during setLocation.
     */
    private readonly screenAttributes: string[];

    /**
     * Function for when a PreActor is to be spawned.
     */
    private readonly onSpawn?: (preActor: PreActor) => void;

    /**
     * Function for when a PreActor is to be un-spawned.
     */
    private readonly onUnspawn?: (preActor: PreActor) => void;

    /**
     * If stretches exists, a Function to add stretches to an Area.
     */
    private readonly stretchAdd?: CommandAdder;

    /**
     * If afters exists, a Function to add afters to an Area.
     */
    private readonly afterAdd?: CommandAdder;

    /**
     * The name of the currently referenced Map, set by setMap.
     */
    private mapName: string;

    /**
     * The currently referenced Map, set by setMap.
     */
    private mapCurrent: Map;

    /**
     * The currently referenced Area, set by setLocation.
     */
    private areaCurrent: Area;

    /**
     * The currently referenced Location, set by setLocation.
     */
    private locationEntered: Location;

    /**
     * The current Area's listing of PreActors.
     */
    private preActors: PreActorsContainers;

    /**
     * Initializes a new instance of the AreaSpawnr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: AreaSpawnrSettings) {
        this.mapsCreator = settings.mapsCreatr;
        this.mapScreenr = settings.mapScreenr;

        this.onSpawn = settings.onSpawn;
        this.onUnspawn = settings.onUnspawn;

        this.screenAttributes = settings.screenAttributes ?? [];
        this.stretchAdd = settings.stretchAdd;
        this.afterAdd = settings.afterAdd;
    }

    /**
     * @returns The attribute names to be copied to MapScreener.
     */
    public getScreenAttributes(): string[] {
        return this.screenAttributes;
    }

    /**
     * @returns The key by which the current Map is indexed.
     */
    public getMapName(): string {
        return this.mapName;
    }

    /**
     * Gets the map listed under the given name. If no name is provided, the
     * mapCurrent is returned instead.
     *
     * @param name   An optional key to find the map under.
     * @returns A Map under the given name, or the current map if none given.
     */
    public getMap(name?: string): Map {
        return typeof name === "undefined" ? this.mapCurrent : this.mapsCreator.getMap(name);
    }

    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     *
     * @returns A listing of maps, keyed by their names.
     */
    public getMaps(): Record<string, Map> {
        return this.mapsCreator.getMaps();
    }

    /**
     * @returns The current Area.
     */
    public getArea(): Area {
        return this.areaCurrent;
    }

    /**
     * @returns The name of the current Area.
     */
    public getAreaName(): string {
        return this.areaCurrent.name;
    }

    /**
     * @param location   The key of the Location to return.
     * @returns A Location within the current Map.
     */
    public getLocation(location: string): Location {
        return this.areaCurrent.map.locations[location];
    }

    /**
     * @returns The most recently entered Location in the current Area.
     */
    public getLocationEntered(): Location {
        return this.locationEntered;
    }

    /**
     * Simple getter function for the internal preActors object. This will be
     * undefined before the first call to setMap.
     *
     * @returns A listing of the current area's PreActors.
     */
    public getPreActors(): PreActorsContainers {
        return this.preActors;
    }

    /**
     * Sets the currently manipulated Map in the handler to be the one under a
     * given name. Note that this will do very little unless a location is
     * provided.
     *
     * @param name   A key to find the map under.
     * @param location   An optional key for a location to immediately start the
     *                   map in (if not provided, ignored).
     * @returns The now-current map.
     */
    public setMap(name: string, location?: string): Map {
        // Get the newly current map from this.getMap normally
        this.mapCurrent = this.getMap(name);
        this.mapName = name;

        // Most of the work is done by setLocation (by default, the map's first)
        if (location !== undefined) {
            this.setLocation(location);
        }

        return this.mapCurrent;
    }

    /**
     * Goes to a particular location in the given map. Area attributes are
     * copied to the MapScreener, PreActors are loaded, and stretches and afters
     * are checked.
     *
     * @param name   The key of the Location to start in.
     * @returns The newly set Location.
     */
    public setLocation(name: string): Location {
        const location = this.mapCurrent.locations[name];

        this.locationEntered = location;
        this.areaCurrent = location.area;
        this.areaCurrent.boundaries = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
        };

        // Copy all the settings from that area into the MapScreenr container
        for (const attribute of this.screenAttributes) {
            this.mapScreenr.variables[attribute] = (this.areaCurrent as any)[attribute];
        }

        // Reset the preActors object, enabling it to be used as a fresh start
        // For the new Area/Location placements
        this.preActors = this.mapsCreator.getPreActors(location.area);

        // Optional: set stretch commands
        if (this.areaCurrent.stretches) {
            this.setStretches(this.areaCurrent.stretches);
        }

        // Optional: set after commands
        if (this.areaCurrent.afters) {
            this.setAfters(this.areaCurrent.afters);
        }

        return location;
    }

    /**
     * Applies the stretchAdd Function to each given "stretch" command and
     * stores the commands in stretches.
     *
     * @param stretchesRaw   Raw descriptions of the stretches.
     */
    public setStretches(stretchesRaw: (string | PreActorSettings)[]): void {
        if (!this.stretchAdd) {
            throw new Error("Cannot call setStretches without a stretchAdd.");
        }

        for (let i = 0; i < stretchesRaw.length; i += 1) {
            this.stretchAdd(stretchesRaw[i], i, stretchesRaw);
        }
    }

    /**
     * Applies the afterAdd Function to each given "after" command and stores
     * the commands in afters.
     *
     * @param aftersRaw   Raw descriptions of the afters.
     */
    public setAfters(aftersRaw: (string | PreActorSettings)[]): void {
        if (!this.afterAdd) {
            throw new Error("Cannot call setAfters without an afterAdd.");
        }

        for (let i = 0; i < aftersRaw.length; i += 1) {
            this.afterAdd(aftersRaw[i], i, aftersRaw);
        }
    }

    /**
     * Calls onSpawn on every PreActor touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it true as the status.
     *
     * @param direction   The direction by which to order PreActors, as "xInc",
     *                    "xDec", "yInc", or "yDec".
     * @param top   The upper-most bound to spawn within.
     * @param right   The right-most bound to spawn within.
     * @param bottom    The bottom-most bound to spawn within.
     * @param left    The left-most bound to spawn within.
     */
    public spawnArea(
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number
    ): void {
        if (this.onSpawn) {
            this.applySpawnAction(this.onSpawn, true, direction, top, right, bottom, left);
        }
    }

    /**
     * Calls onUnspawn on every PreActor touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it false as the status.
     *
     * @param direction   The direction by which to order PreActors, as "xInc",
     *                    "xDec", "yInc", or "yDec".
     * @param top   The upper-most bound to spawn within.
     * @param right   The right-most bound to spawn within.
     * @param bottom    The bottom-most bound to spawn within.
     * @param left    The left-most bound to spawn within.
     */
    public unspawnArea(
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number
    ): void {
        if (this.onUnspawn) {
            this.applySpawnAction(this.onUnspawn, false, direction, top, right, bottom, left);
        }
    }

    /**
     * Calls onUnspawn on every PreActor touched by the given bounding box,
     * determined in order of the given direction. This is used both to spawn
     * and un-spawn PreActors, such as during QuadsKeepr shifting. The given
     * status is used as a filter: all PreActors that already have the status
     * (generally true or false as spawned or unspawned, respectively) will have
     * the callback called on them.
     *
     * @param callback   The callback to be run whenever a matching matching
     *                   PreActor is found.
     * @param status   The spawn status to match PreActors against. Only PreActors
     *                 with .spawned === status will have the callback applied.
     * @param direction   The direction by which to order PreActors, as "xInc",
     *                    "xDec", "yInc", or "yDec".
     * @param top   The upper-most bound to apply within.
     * @param right   The right-most bound to apply within.
     * @param bottom    The bottom-most bound to apply within.
     * @param left    The left-most bound to apply within.
     */
    private applySpawnAction(
        callback: (preActor: PreActorLike) => void,
        status: boolean,
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number
    ): void {
        // For each group of PreActors currently able to spawn...
        for (const name in this.preActors) {
            if (!{}.hasOwnProperty.call(this.preActors, name)) {
                continue;
            }

            // Don't bother trying to spawn the group if it has no members
            const group: PreActorLike[] = (this.preActors as any)[name][direction];
            if (group.length === 0) {
                continue;
            }

            // Find the start and end points within the PreActors Array
            // Ex. if direction="xInc", go from .left >= left to .left <= right
            const start = findPreActorsSpawnStart(direction, group, top, right, bottom, left);
            const end = findPreActorsSpawnEnd(direction, group, top, right, bottom, left);

            // Loop through all the directionally valid PreActors, spawning if
            // They're within the bounding box
            for (let i = start; i <= end; i += 1) {
                const preActor = group[i];

                // For example: f status is true (spawned), don't spawn again
                if (preActor.spawned !== status) {
                    preActor.spawned = status;
                    callback(preActor);
                }
            }
        }
    }
}
