import {
    IArea, ILocation, IMap, IMapsCreatr, IPreThingsContainers
} from "mapscreatr/lib/imapscreatr";
import { IPreThing, IPreThingSettings } from "mapscreatr/lib/iprething";
import { IMapScreenr } from "mapscreenr/lib/imapscreenr";

/**
 * A Function to add a map command, such as an after or stretch.
 * 
 * @param thing   The raw command to create a Thing, as either a title
 *                or a JSON object.
 * @param index   Which command this is, as per Array.forEach.
 */
export interface ICommandAdder {
    (thing: string | IPreThingSettings, index: number): void;
}

/**
 * Settings to initialize a new IAreaSpawnr.
 */
export interface IAreaSpawnrSettings {
    /**
     * A MapsCreatr used to store and lazily initialize Maps.
     */
    MapsCreator: IMapsCreatr;

    /**
     * A MapScreenr used to store attributes of Areas.
     */
    MapScreener: IMapScreenr;

    /**
     * Function for when a PreThing's Thing should be spawned.
     */
    onSpawn?: (prething: IPreThing) => void;

    /**
     * Function for when a PreThing's Thing should be un-spawned.
     */
    onUnspawn?: (prething: IPreThing) => void;

    /**
     * Any property names to copy from Areas to the MapScreenr during setLocation.
     */
    screenAttributes?: string[];

    /**
     * Function to add an Area's provided "stretches" commands to stretch
     * across an Area.
     */
    stretchAdd?: ICommandAdder;

    /**
     * Function to add an Area provides an "afters" command to add PreThings
     * to the end of an Area.
     */
    afterAdd?: ICommandAdder;

    /**
     * An optional scope to call stretchAdd and afterAdd on, if not this.
     */
    commandScope?: any;
}

/**
 * Loads GameStartr maps to spawn and unspawn areas on demand.
 */
export interface IAreaSpawnr {
    /**
     * @returns The internal MapsCreator.
     */
    getMapsCreator(): IMapsCreatr;

    /**
     * @returns The internal MapScreener.
     */
    getMapScreener(): IMapScreenr;

    /**
     * @returns The attribute names to be copied to MapScreener.
     */
    getScreenAttributes(): string[];

    /**
     * @returns The key by which the current Map is indexed.
     */
    getMapName(): string;

    /**
     * Gets the map listed under the given name. If no name is provided, the
     * mapCurrent is returned instead.
     * 
     * @param name   An optional key to find the map under.
     * @returns A Map under the given name, or the current map if none given.
     */
    getMap(name?: string): IMap;

    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     * 
     * @returns A listing of maps, keyed by their names.
     */
    getMaps(): { [i: string]: IMap };

    /**
     * @returns The current Area.
     */
    getArea(): IArea;

    /**
     * @returns The name of the current Area.
     */
    getAreaName(): string;

    /**
     * @param location   The key of the Location to return.
     * @returns A Location within the current Map.
     */
    getLocation(location: string): ILocation;

    /**
     * @returns The most recently entered Location in the current Area.
     */
    getLocationEntered(): ILocation;

    /**
     * Simple getter function for the internal prethings object. This will be
     * undefined before the first call to setMap.
     * 
     * @returns A listing of the current area's Prethings.
     */
    getPreThings(): IPreThingsContainers;

    /**
     * Sets the scope to run PreThing commands in.
     * 
     * @param commandScope   A scope to run PreThing commands in.
     */
    setCommandScope(commandScope: any): any;

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
    setMap(name: string, location?: string): IMap;

    /**
     * Goes to a particular location in the given map. Area attributes are 
     * copied to the MapScreener, PreThings are loaded, and stretches and afters
     * are checked.
     * 
     * @param name   The key of the Location to start in.
     */
    setLocation(name: string): void;

    /**
     * Applies the stretchAdd Function to each given "stretch" command and
     * stores the commands in stretches.
     * 
     * @param stretchesRaw   Raw descriptions of the stretches.
     */
    setStretches(stretchesRaw: (string | IPreThingSettings)[]): void;

    /**
     * Applies the afterAdd Function to each given "after" command and stores
     * the commands in afters.
     * 
     * @param aftersRaw   Raw descriptions of the afters.
     */
    setAfters(aftersRaw: (string | IPreThingSettings)[]): void;

    /**
     * Calls onSpawn on every PreThing touched by the given bounding box, 
     * determined in order of the given direction. This is a simple wrapper 
     * around applySpawnAction that also gives it true as the status.
     * 
     * @param direction   The direction by which to order PreThings, as "xInc",
     *                    "xDec", "yInc", or "yDec".
     * @param top   The upper-most bound to spawn within.
     * @param right   The right-most bound to spawn within.
     * @param bottom    The bottom-most bound to spawn within.
     * @param left    The left-most bound to spawn within.
     */
    spawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;

    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it false as the status.
     * 
     * @param direction   The direction by which to order PreThings, as "xInc",
     *                    "xDec", "yInc", or "yDec".
     * @param top   The upper-most bound to spawn within.
     * @param right   The right-most bound to spawn within.
     * @param bottom    The bottom-most bound to spawn within.
     * @param left    The left-most bound to spawn within.
     */
    unspawnArea(direction: string, top: number, right: number, bottom: number, left: number): void;
}
