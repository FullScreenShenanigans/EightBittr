/// <reference path="MapsCreatr/MapsCreatr.ts" />
/// <reference path="MapsCreatr/MapsCreatrObjects.d.ts" />
/// <reference path="MapScreenr/MapScreenr.ts" />

interface IMapsHandlrSettings {
    // A MapsCreatr used to store and lazily initialize Maps.
    MapsCreator: MapsCreatr;

    // A MapScreenr used to store attributes of Areas.
    MapScreener: MapScreenr;

    // A callback for when a PreThing should be spawned.
    onSpawn: (prething: PreThing) => void;

    // A callback for when a PreThing should be un-spawned.
    onUnspawn: (prething: PreThing) => void;

    // The property names to copy from Areas to MapScreenr (by default, []).
    screenAttributes?: string[];

    // A callback for when an Area provides an "afters" command to add PreThings
    // to the end of an Area.
    afterAdd: (title: string, index: number) => void;

    // A callback for when an Area provides a "stretch" command to add PreThings
    // to stretch across an Area.
    stretchAdd: (title: string, index: number) => void;
}

/**
 * MapsHandlr.js
 * 
 * Map manipulator and spawner for GameStarter maps that is the front-end
 * counterpart to MapsCreatr. PreThing listings are loaded from Maps stored in a
 * MapsCreatr and added or removed from user input. Area properties are given to
 * a MapScreenr when a new Area is loaded.
 * 
 * Examples are not available for MapsHandlr, as the required code would be very
 * substantial. Instead see GameStartr.js and its map manipulation code.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class MapsHandlr {
    // Directional equivalents for converting from directions to keys
    public static directionKeys: any = {
        "xInc": "left",
        "xDec": "right",
        "yInc": "top",
        "yDec": "bottom"
    };

    // Opposite directions for when finding descending order Arrays
    public static directionOpposites: any = {
        "xInc": "xDec",
        "xDec": "xInc",
        "yInc": "yDec",
        "yDec": "yInc"
    };

    // MapsCreatr container for Maps from which this obtains Thing settings.
    private MapsCreator: MapsCreatr;

    // MapScreenr container for attributes copied from Areas.
    private MapScreener: MapScreenr;

    // An Array of Strings representing the names of attributes to be copied
    // to the MapScreener during this.setLocation.
    private screenAttributes: string[];

    // The currently referenced Map from MapsCreator, set by this.setMap.
    private mapCurrent: IMapsCreatrMap;

    // The currently referenced Area, set by this.setLocation.
    private areaCurrent: IMapsCreatrArea;

    // The currently referenced Location, set by this.setLocation.
    private locationCurrent: IMapsCreatrLocation;

    // The name of the currently edited Map, set by this.setMap.
    private mapName: string;

    // The current area's listing of PreThings that are to be added in order
    // during this.spawnMap.
    private prethings: {
        [i: string]: PreThing[]
    };

    // When a prething is to be spawned, this Function should spawn it.
    private onSpawn: (prething: PreThing) => void;

    // When a prething is to be unspawned, this Function should unspawn it.
    private onUnspawn: (prething: PreThing) => void;

    // Optionally, an Array of Thing titles to stretch across the map.
    private stretches: IPreThingSettings[];

    // If stretches exists, the Function to call to add one to the map.
    private stretchAdd: (title: string, index: number) => void;

    // Optionally, an Array of Things to place at the end of the map.
    private afters: IPreThingSettings[];

    // If afters exists, the Function to call to add one to the map.
    private afterAdd: (title: string, index: number) => void;

    /**
     * @param {IMapsHandlrSettings} settings
     */
    constructor(settings: IMapsHandlrSettings) {
        if (!settings) {
            throw new Error("No settings given to MapsHandlr.");
        }

        // Maps themselves should have been created in the MapsCreator object
        if (!settings.MapsCreator) {
            throw new Error("No MapsCreator provided to MapsHandlr.");
        }
        this.MapsCreator = settings.MapsCreator;

        // Map/Area attributes will need to be stored in a MapScreenr object
        if (!settings.MapScreener) {
            throw new Error("No MapScreener provided to MapsHandlr.");
        }
        this.MapScreener = settings.MapScreener;

        this.onSpawn = settings.onSpawn;
        this.onUnspawn = settings.onUnspawn;

        this.screenAttributes = settings.screenAttributes || [];
        this.stretchAdd = settings.stretchAdd;
        this.afterAdd = settings.afterAdd;
    }


    /* Simple gets
    */

    /**
     * @return {MapsCreatr}   The internal MapsCreator.
     */
    getMapsCreator(): MapsCreatr {
        return this.MapsCreator;
    }

    /**
     * @return {MapScreenr}   The internal MapScreener.
     */
    getMapScreener(): MapScreenr {
        return this.MapScreener;
    }

    /**
     * @return {String[]}   The attribute names to be copied to MapScreener.
     */
    getScreenAttributes(): string[] {
        return this.screenAttributes;
    }

    /**
     * @return {String}   The key by which the current Map is indexed.
     */
    getMapName(): string {
        return this.mapName;
    }

    /** 
     * Gets the map listed under the given name. If no name is provided, the
     * mapCurrent is returned instead.
     * 
     * @param {String} [name]   An optional key to find the map under.
     * @return {Map}
     */
    getMap(name: string = undefined): IMapsCreatrMap {
        if (typeof name !== "undefined") {
            return this.MapsCreator.getMap(name);
        } else {
            return this.mapCurrent;
        }
    }

    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     * 
     * @return {Object<Map>}   A listing of maps, keyed by their names.
     */
    getMaps(): any {
        return this.MapsCreator.getMaps();
    }

    /**
     * @return {Area} The current Area.
     */
    getArea(): IMapsCreatrArea {
        return this.areaCurrent;
    }

    /**
     * @return {String} The name of the current Area.
     */
    getAreaName(): string {
        return this.areaCurrent.name;
    }

    /**
     * @param {String} location   The key of the Location to return.
     * @return {Location} A Location within the current Map.
     */
    getLocation(location: string): IMapsCreatrLocation {
        return this.areaCurrent.map.locations[location];
    }

    /**
     * Simple getter function for the internal prethings object. This will be
     * undefined before the first call to setMap.
     * 
     * @return {Object} A listing of the current area's Prethings.
     */
    getPreThings(): any {
        return this.prethings;
    }


    /* Map / location setting
    */

    /**
     * Sets the currently manipulated Map in the handler to be the one under a
     * given name. Note that this will do very little unless a location is 
     * provided.
     * 
     * @param {String} name   A key to find the map under.
     * @param {Mixed} [location]   An optional key for a location to immediately
     *                              start the map in (if not provided, ignored). 
     *                          
     */
    setMap(name: string, location: string = undefined): IMapsCreatrMap {
        // Get the newly current map from this.getMap normally
        this.mapCurrent = this.getMap(name);
        if (!this.mapCurrent) {
            throw new Error("Unknown Map in setMap: '" + name + "'.");
        }

        this.mapName = name;

        // Most of the work is done by setLocation (by default, the map's first)
        if (arguments.length > 1) {
            this.setLocation(location);
        }

        return this.mapCurrent;
    }

    /**
     * Goes to a particular location in the given map. Area attributes are 
     * copied to the MapScreener, PreThings are loaded, and stretches and afters
     * are checked.
     * 
     * @param {String} name   The key of the Location to start in.
     */
    setLocation(name: string): void {
        var location: IMapsCreatrLocation,
            attribute: string,
            i: number;

        // Query the location from the current map and ensure it exists
        location = this.mapCurrent.locations[name];
        if (!location) {
            throw new Error("Unknown location in setLocation: '" + name + "'.");
        }

        // Since the location is valid, mark it as current (with its area)
        this.locationCurrent = location;
        this.areaCurrent = location.area;
        this.areaCurrent.boundaries = {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
        };

        // Copy all the settings from that area into the MapScreenr container
        for (i = 0; i < this.screenAttributes.length; i += 1) {
            attribute = this.screenAttributes[i];
            this.MapScreener[attribute] = this.areaCurrent[attribute];
        }

        // Reset the prethings object, enabling it to be used as a fresh start
        // for the new Area/Location placements
        this.prethings = this.MapsCreator.getPreThings(location.area);

        // Optional: set stretch commands
        if (this.areaCurrent.stretches) {
            this.setStretches(this.areaCurrent.stretches);
        } else {
            this.stretches = undefined;
        }

        // Optional: set after commands
        if (this.areaCurrent.afters) {
            this.setAfters(this.areaCurrent.afters);
        } else {
            this.afters = undefined;
        }
    }

    /**
     * Applies the stretchAdd Function to each given "stretch" command and  
     * stores the commands in stretches.
     * 
     * @param {Object[]} stretchesRaw
     */
    setStretches(stretchesRaw: IPreThingSettings[]): void {
        this.stretches = stretchesRaw;
        this.stretches.forEach(this.stretchAdd);
    }

    /**
     * Applies the afterAdd Function to each given "after" command and stores
     * the commands in afters.
     * 
     * @param {Object[]} aftersRaw
     */
    setAfters(aftersRaw: IPreThingSettings[]): void {
        this.afters = aftersRaw;
        this.afters.forEach(this.afterAdd);
    }

    /**
     * Calls onSpawn on every PreThing touched by the given bounding box, 
     * determined in order of the given direction. This is a simple wrapper 
     * around applySpawnAction that also gives it true as the status.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to spawn within.
     * @param {Number} right   The right-most bound to spawn within.
     * @param {Number} bottom    The bottom-most bound to spawn within.
     * @param {Number} left    The left-most bound to spawn within.
     */
    spawnMap(direction: string, top: number, right: number, bottom: number, left: number): void {
        if (this.onSpawn) {
            this.applySpawnAction(this.onSpawn, true, direction, top, right, bottom, left);
        }
    }

    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it false as the status.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to spawn within.
     * @param {Number} right   The right-most bound to spawn within.
     * @param {Number} bottom    The bottom-most bound to spawn within.
     * @param {Number} left    The left-most bound to spawn within.
     */
    unspawnMap(direction: string, top: number, right: number, bottom: number, left: number): void {
        if (this.onUnspawn) {
            this.applySpawnAction(this.onUnspawn, false, direction, top, right, bottom, left);
        }
    }

    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is used both to spawn
     * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
     * status is used as a filter: all PreThings that already have the status
     * (generally true or false as spawned or unspawned, respectively) will have
     * the callback called on them.
     * 
     * @param {Function} callback   The callback to be run whenever a matching
     *                              matching PreThing is found.
     * @param {Boolean} status   The spawn status to match PreThings against.
     *                           Only PreThings with .spawned === status will 
     *                           have the callback applied to them.
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @todo This will almost certainly present problems when different 
     *       directions are used. For Pokemon/Zelda style games, the system
     *       will probably need to be adapted to use a Quadrants approach
     *       instead of plain Arrays.
     */
    private applySpawnAction(
        callback: (prething: PreThing) => void,
        status: boolean,
        direction: string,
        top: number,
        right: number,
        bottom: number,
        left: number): void {
        var name: string,
            group: PreThing[],
            prething: PreThing,
            mid: number,
            start: number,
            end: number,
            i: number;

        // For each group of PreThings currently able to spawn...
        for (name in this.prethings) {
            if (!this.prethings.hasOwnProperty(name)) {
                continue;
            }

            // Don't bother trying to spawn the group if it has no members
            group = this.prethings[name][direction];
            if (group.length === 0) {
                continue;
            }

            // Find the start and end points within the PreThings Array
            // Ex. if direction="xInc", go from .left >= left to .left <= right
            mid = (group.length / 2) | 0;
            start = this.findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
            end = this.findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);

            // Loop through all the directionally valid PreThings, spawning if 
            // they're within the bounding box
            for (i = start; i <= end; i += 1) {
                prething = group[i];

                // For example: if status is true (spawned), don't spawn again
                if (prething.spawned !== status) {
                    prething.spawned = status;
                    callback(prething);
                }
            }
        }
    }

    /**
     * Finds the index from which PreThings should stop having an action 
     * applied to them in applySpawnAction. This is less efficient than the 
     * unused version below, but is more reliable for slightly unsorted groups.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {PreThing[]} group   The group to find a PreThing index within.
     * @param {Number} mid   The middle of the group. This is currently unused.
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    private findPreThingsSpawnStart(
        direction: string,
        group: PreThing[],
        mid: number,
        top: number,
        right: number,
        bottom: number,
        left: number): number {
        var directionKey: string = MapsHandlr.directionKeys[direction],
            directionEnd: number = this.getDirectionEnd(directionKey, top, right, bottom, left),
            i: number;

        for (i = 0; i < group.length; i += 1) {
            if (group[i][directionKey] >= directionEnd) {
                return i;
            }
        }

        return i;
    }

    /**
     * Finds the index from which PreThings should stop having an action 
     * applied to them in applySpawnAction. This is less efficient than the 
     * unused version below, but is more reliable for slightly unsorted groups.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {PreThing[]} group   The group to find a PreThing index within.
     * @param {Number} mid   The middle of the group. This is currently unused.
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    private findPreThingsSpawnEnd(
        direction: string,
        group: PreThing[],
        mid: number,
        top: number,
        right: number,
        bottom: number,
        left: number): number {
        var directionKey: string = MapsHandlr.directionKeys[direction],
            directionKeyOpposite: string = MapsHandlr.directionKeys[MapsHandlr.directionOpposites[direction]],
            directionEnd: number = this.getDirectionEnd(directionKeyOpposite, top, right, bottom, left),
            i: number;

        for (i = group.length - 1; i >= 0; i -= 1) {
            if (group[i][directionKey] <= directionEnd) {
                return i;
            }
        }

        return i;
    }

    /**
     * Conditionally returns a measurement based on what direction String is
     * given. This is useful for generically finding boundaries when the 
     * direction isn't known, such as in findPreThingsSpawnStart and -End.
     * 
     * @param {String} direction   The direction by which to order PreThings: 
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number} top, right, bottom, or left, depending on direction.
     */
    private getDirectionEnd(directionKey: string, top: number, right: number, bottom: number, left: number): number {
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
                throw new Error("Unknown directionKey: " + directionKey);
        }
    }
}
