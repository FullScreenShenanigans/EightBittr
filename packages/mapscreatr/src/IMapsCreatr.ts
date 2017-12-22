import { IObjectMakr } from "objectmakr";

import { IPreThing, IPreThingSettings } from "./IPreThing";

/**
 * A raw JSON-friendly description of a map.
 */
export interface IMapRaw {
    /**
     * The name of the map.
     */
    name: string;

    /**
     * Descriptions of locations in the map.
     */
    locations: {
        [i: string]: ILocationRaw;
        [i: number]: ILocationRaw;
    };

    /**
     * Descriptions of areas in the map.
     */
    areas: {
        [i: string]: IAreaRaw;
        [i: number]: IAreaRaw;
    };
}

/**
 * A raw JSON-friendly description of a map area.
 */
export interface IAreaRaw {
    /**
     * Commands to place PreThings in the area.
     */
    creation: any[];
}

/**
 * A raw JSON-friendly description of a map location.
 */
export interface ILocationRaw {
    /**
     * The entrance method used to enter the location.
     */
    entry?: string;

    /**
     * Which area this location is a part of.
     */
    area?: number | string;
}

/**
 * A Map parsed from its raw JSON-friendly description.
 */
export interface IMap {
    /**
     * Whether the Map has had its areas and locations set.
     */
    initialized: boolean;

    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: string]: IArea;
        [i: number]: IArea;
    };

    /**
     * A listing of locations in the Map, keyed by name.
     */
    locations: any;
}

/**
 * An Area parsed from a raw JSON-friendly Map description.
 */
export interface IArea {
    /**
     * The user-friendly label for this Area.
     */
    name: string;

    /**
     * The Map this Area is a part of.
     */
    map: IMap;

    /**
     * A list of PreThing and macro commands to build this area from scratch.
     */
    creation: any[];

    /**
     * Groups that may be requested by creation commands to store generated
     * Things, so they may reference each other during gameplay.
     */
    collections?: any;

    /**
     * The boundaries for the map; these all start at 0 and are stretched by
     * PreThings placed inside.
     */
    boundaries: IBoundaries;

    /**
     * Optional listing of Things to provide to place at the end of the Area.
     */
    afters?: (string | IPreThingSettings)[];

    /**
     * Optional listing of Things to provide to stretch across the Area.
     */
    stretches?: (string | IPreThingSettings)[];
}

/**
 * A bounding box around an area.
 */
export interface IBoundaries {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * A Location parsed from a raw JSON-friendly Map description.
 */
export interface ILocation {
    /**
     * The user-friendly label for this Location.
     */
    name: string;

    /**
     * The Area this Location is a part of.
     */
    area: IArea;

    /**
     * The source name for the keyed entry Function used for this Location.
     */
    entryRaw?: string;

    /**
     * The entrance Function used to enter this Location.
     */
    entry?: Function;
}

/**
 * Parsed PreThings from an Area's creation's command analysis.
 */
export interface IPreThingsRawContainer {
    [i: string]: IPreThing[];
}

/**
 * A collection of PreThings sorted in all four directions.
 */
export interface IPreThingsContainer {
    /**
     * PreThings sorted in increasing horizontal order.
     */
    xInc: IPreThing[];

    /**
     * PreThings sorted in decreasing horizontal order.
     */
    xDec: IPreThing[];

    /**
     * PreThings sorted in increasing vertical order.
     */
    yInc: IPreThing[];

    /**
     * PreThings sorted in decreasing vertical order.
     */
    yDec: IPreThing[];

    /**
     * Adds a PreThing to each sorted collection.
     *
     * @param prething   A Prething to add.
     */
    push(prething: IPreThing): void;
}

/**
 * A collection of PreThing containers, keyed by group name.
 */
export interface IPreThingsContainers {
    [i: string]: IPreThingsContainer;
}

/**
 * Containers that may be passed into analysis Functions.
 */
export type IAnalysisContainer = IPreThingsContainers | IPreThingsRawContainer;

/**
 * A Function used to enter a Map Location.
 *
 * @param location   The Location within an Area being entered.
 */
export interface IEntrance {
    (location: ILocation): void;
}

/**
 * Available macros, keyed by name.
 */
export interface IMacros {
    [i: string]: IMacro;
}

/**
 * A Function to automate placing other PreThings or macros in an Area.
 *
 * @param reference   The JSON-friendly reference causing the macro.
 * @param prethings   The container of PreThings this is adding to.
 * @param area   The container Area containing the PreThings.
 * @param map   The container Map containing the Area.
 * @returns A single PreThing or macro descriptor, or Array thereof.
 */
export interface IMacro {
    (reference: any, prethings: IPreThingsContainers, area: IArea | IAreaRaw, map: IMap | IAreaRaw): IPreThing | IPreThing[] | any;
}

/**
 * Settings to initialize a new IMapsCreatr.
 */
export interface IMapsCreatrSettings {
    /**
     * An ObjectMakr used to create Maps and Things. Note that it must store
     * full properties of Things, for quick size lookups.
     */
    objectMaker: IObjectMakr;

    /**
     * The names of groups Things may be in.
     */
    groupTypes?: string[];

    /**
     * A listing of macros that can be used to automate common operations.
     */
    macros?: any;

    /**
     * Optional entrance Functions that may be used as the openings for
     * Locations.
     */
    entrances?: any;

    /**
     * Whether Locations must have an entrance Function defined by "entry" (by
     * default, false).
     */
    requireEntrance?: boolean;

    /**
     * Any maps that should be immediately stored via a storeMaps call, keyed
     * by name.
     */
    maps?: any;
}

/**
 * Storage container and lazy loader for GameStartr maps.
 */
export interface IMapsCreatr {
    /**
     * @returns The internal ObjectMakr.
     */
    getObjectMaker(): IObjectMakr;

    /**
     * @returns The allowed group types.
     */
    getGroupTypes(): string[];

    /**
     * @returns The allowed macro Functions.
     */
    getMacros(): {
        [i: string]: IMacro;
    };

    /**
     * @returns Whether Locations must have an entrance Function.
     */
    getRequireEntrance(): boolean;

    /**
     * @returns The Object storing raw maps, keyed by name.
     */
    getMapsRaw(): {
        [i: string]: IMapRaw;
    };

    /**
     * @returns The Object storing maps, keyed by name.
     */
    getMaps(): {
        [i: string]: IMap;
    };

    /**
     * @param name   A key to find the map under.
     * @returns The raw map keyed by the given name.
     */
    getMapRaw(name: string): IMapRaw;

    /**
     * Getter for a map under the maps container. If the map has not yet been
     * initialized that is done here as lazy loading.
     *
     * @param name   A key to find the map under.
     * @returns The parsed map keyed by the given name.
     */
    getMap(name: string): IMap;

    /**
     * Creates and stores a set of new maps based on the key/value pairs in a
     * given Object. These will be stored as maps by their string keys via
     * this.storeMap.
     *
     * @param maps   Raw maps keyed by their storage key.
     */
    storeMaps(maps: { [i: string]: IMapRaw }): void;

    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object. The actual loading of
     * Areas and Locations is deferred to this.getMap.
     *
     * @param name   A name under which the map should be stored.
     * @param mapRaw   A raw map to be stored.
     * @returns A Map object created by the internal ObjectMakr using the raw map.
     */
    storeMap(name: string, mapRaw: IMapRaw): IMap;

    /**
     * Given a Area, this processes and returns the PreThings that are to
     * inhabit the Area per its creation instructions.
     *
     * @returns A container with the parsed PreThings.
     */
    getPreThings(area: IArea): IPreThingsContainers;

    /**
     * PreThing switcher: Given a JSON representation of a PreThing, this
     * determines what to do with it. It may be a location setter (to switch the
     * x- and y- location offset), a macro (to repeat some number of actions),
     * or a raw PreThing.
     *
     * @param reference   A JSON mapping of some number of PreThings.
     * @param preThings   The PreThing containers within the Area.
     * @param {Area} area   The Area to be populated.
     * @param {Map} map   The Map containing the Area.
     * @returns The results of analyzePreMacro or analyzePreThing.
     */
    analyzePreSwitch(
        reference: any,
        prethings: IPreThingsContainers | IPreThingsRawContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw): any;

    /**
     * PreThing case: Macro instruction. This calls the macro on the same input,
     * captures the output, and recursively repeats the analyzePreSwitch driver
     * function on the output(s).
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param preThings   The PreThing containers within the Area.
     * @param {Area} area   The Area to be populated.
     * @param {Map} map   The Map containing the Area.
     */
    analyzePreMacro(
        reference: any,
        prethings: IPreThingsContainers | IPreThingsRawContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw): any[] | any;

    /**
     * Macro case: PreThing instruction. This creates a PreThing from the
     * given reference and adds it to its respective group in PreThings (based
     * on the PreThing's [keyGroupType] variable).
     *
     * @param reference   A JSON mapping of some number of PreThings.
     * @param preThings   The PreThing containers within the Area.
     * @param area   The Area to be populated by these PreThings.
     * @param map   The Map containing the Area.
     */
    analyzePreThing(
        reference: any,
        prethings: IPreThingsContainers | IPreThingsRawContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw): any;
}
