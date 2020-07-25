import { ObjectMakr } from "objectmakr";

import { PreActorLike, PreActorSettings } from "./PreActorLike";

/**
 * A raw JSON-friendly description of a map.
 */
export interface MapRaw {
    /**
     * The name of the map.
     */
    name: string;

    /**
     * Descriptions of locations in the map.
     */
    locations: {
        [i: string]: LocationRaw;
        [i: number]: LocationRaw;
    };

    /**
     * Descriptions of areas in the map.
     */
    areas: {
        [i: string]: AreaRaw;
        [i: number]: AreaRaw;
    };
}

/**
 * A raw JSON-friendly description of a map area.
 */
export interface AreaRaw {
    /**
     * Commands to place PreActorLikes in the area.
     */
    creation: any[];
}

/**
 * A raw JSON-friendly description of a map location.
 */
export interface LocationRaw {
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
export interface Map {
    /**
     * Whether the Map has had its areas and locations set.
     */
    initialized: boolean;

    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: string]: Area;
        [i: number]: Area;
    };

    /**
     * A listing of locations in the Map, keyed by name.
     */
    locations: any;
}

/**
 * An Area parsed from a raw JSON-friendly Map description.
 */
export interface Area {
    /**
     * The user-friendly label for this Area.
     */
    name: string;

    /**
     * The Map this Area is a part of.
     */
    map: Map;

    /**
     * A list of PreActorLike and macro commands to build this area from scratch.
     */
    creation: any[];

    /**
     * Groups that may be requested by creation commands to store generated
     * Actors, so they may reference each other during gameplay.
     */
    collections?: any;

    /**
     * The boundaries for the map; these all start at 0 and are stretched by
     * PreActorLikes placed inside.
     */
    boundaries: Boundaries;

    /**
     * Optional listing of Actors to provide to place at the end of the Area.
     */
    afters?: (string | PreActorSettings)[];

    /**
     * Optional listing of Actors to provide to stretch across the Area.
     */
    stretches?: (string | PreActorSettings)[];
}

/**
 * A bounding box around an area.
 */
export interface Boundaries {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * A Location parsed from a raw JSON-friendly Map description.
 */
export interface Location {
    /**
     * The user-friendly label for this Location.
     */
    name: string;

    /**
     * The Area this Location is a part of.
     */
    area: Area;

    /**
     * The source name for the keyed entry Function used for this Location.
     */
    entryRaw?: string;

    /**
     * The entrance function used to enter this Location.
     */
    entry?: Entrance;
}

/**
 * Parsed PreActorLikes from an Area's creation's command analysis.
 */
export interface PreActorsRawContainer {
    [i: string]: PreActorLike[];
}

/**
 * A collection of PreActorLikes sorted in all four directions.
 */
export interface PreActorsContainer {
    /**
     * PreActorLikes sorted in increasing horizontal order.
     */
    xInc: PreActorLike[];

    /**
     * PreActorLikes sorted in decreasing horizontal order.
     */
    xDec: PreActorLike[];

    /**
     * PreActorLikes sorted in increasing vertical order.
     */
    yInc: PreActorLike[];

    /**
     * PreActorLikes sorted in decreasing vertical order.
     */
    yDec: PreActorLike[];

    /**
     * Adds a PreActorLike to each sorted collection.
     *
     * @param preactorLike   A PreactorLike to add.
     */
    push(preactorLike: PreActorLike): void;
}

/**
 * A collection of PreActorLike containers, keyed by group name.
 */
export interface PreActorsContainers {
    [i: string]: PreActorsContainer;
}

/**
 * Containers that may be passed into analysis Functions.
 */
export type AnalysisContainer = PreActorsContainers | PreActorsRawContainer;

/**
 * A Function used to enter a Map Location.
 *
 * @param location   The Location within an Area being entered.
 */
export type Entrance = (location: Location) => void;

/**
 * Available macros, keyed by name.
 */
export interface Macros {
    [i: string]: Macro;
}

/**
 * A Function to automate placing other PreActorLikes or macros in an Area.
 *
 * @param reference   The JSON-friendly reference causing the macro.
 * @param preactorLikes   The container of PreActorLikes this is adding to.
 * @param area   The container Area containing the PreActorLikes.
 * @param map   The container Map containing the Area.
 * @returns A single PreActorLike or macro descriptor, or Array thereof.
 */
export type Macro = (
    reference: any,
    preactorLikes: AnalysisContainer,
    area: Area | AreaRaw,
    map: Map | MapRaw
) => PreActorLike | PreActorLike[] | any;

/**
 * Settings to initialize a new MapsCreatr.
 */
export interface MapsCreatrSettings {
    /**
     * An ObjectMakr used to create Maps and Actors. Note that it must store
     * full properties of Actors, for quick size lookups.
     */
    objectMaker: ObjectMakr;

    /**
     * The names of groups Actors may be in.
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
