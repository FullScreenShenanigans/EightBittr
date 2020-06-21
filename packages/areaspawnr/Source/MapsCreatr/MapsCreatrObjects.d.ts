interface IMapsCreatrMap {
    // Whether the Map has had its areas and locations set in getMap.
    initialized: boolean;

    // A listing of areas in the Map, keyed by name.
    areas: any;

    // The source JSON for the areas, keyed by name.
    areasRaw: any;

    // A listing of locations in the Map, keyed by name.
    locations: any;

    // The source JSON for the locations, keyed by name.
    locationsRaw: any;
}

interface IMapsCreatrArea {
    // The user-friendly label for this Area.
    name: string;

    // The Map this Area is a part of.
    map: IMapsCreatrMap;

    // A list of PreThing and macro commands to build this area from scratch.
    creation: any[];

    // Groups that may be requested by creation commands to store generated
    // Things, so they may reference each other during gameplay.
    collections?: any;

    // The boundaries for the map; these all start at 0 and are stretched by
    // PreThings placed inside.
    boundaries: {
        "top": number;
        "right": number;
        "bottom": number;
        "left": number;
    };

    // Optional listing of Things to provide to place at the end of the Area
    afters?: IPreThingSettings[];

    // Optional listing of Things to provide to stretch across the Area
    stretches?: string[];
}

interface IMapsCreatrLocation {
    // The user-friendly label for this Location.
    name: string;

    // The Area this Location is a part of.
    area: IMapsCreatrArea;

    // The source name for the keyed entry Function used for this Location.
    entryRaw?: string;

    // The entrance Function used to enter this Location.
    entry?: Function;
}

/**
 * 
 */
interface IPreThingSettings {
    // The title of the Thing to be placed, if not a macro.
    thing?: string;

    // The title of the macro to be evaulated, if not a PreThing.
    macro?: string;

    // The horizontal starting location of the Thing (by default, 0).
    x?: number;

    // The vertical starting location of the Thing (by default, 0).
    y?: number;

    // How wide the Thing is (by default, the Thing's prototype's width from
    // ObjectMaker.getFullPropertiesOf).
    width?: number;

    // How tall the Thing is (by default, the Thing's prototype's height from
    // ObjectMaker.getFullPropertiesOf).
    height?: number;

    // An optional immediate modifier instruction for where the Thing should be
    // in its GroupHoldr group (either "beginning", "end", or undefined).
    position?: string;

    // An optional group for the Thing to be in, keyed by its id.
    collection?: any;

    // Whether this should skip stretching the boundaries of an area
    noBoundaryStretch?: boolean;
}

/**
 * 
 */
interface IThing extends IPreThingSettings {
    // The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
    title: string;
}