/// <reference path="MapsCreatr.ts" />

declare module MapsCreatr {
    export interface IMapsCreatrMapRaw {
        name: string;
        locations: {
            [i: string]: IMapsCreatrLocationRaw;
            [i: number]: IMapsCreatrLocationRaw;
        };
        areas: {
            [i: string]: IMapsCreatrAreaRaw;
        };
    }

    export interface IMapsCreatrAreaRaw {
        creation: any[];
    }

    export interface IMapsCreatrLocationRaw {
        entry?: string;
        area?: number | string;
    }

    export interface IMapsCreatrMap {
        // Whether the Map has had its areas and locations set in getMap.
        initialized: boolean;

        // A listing of areas in the Map, keyed by name.
        areas: {
            [i: string]: IMapsCreatrArea;
            [i: number]: IMapsCreatrArea;
        };

        // A listing of locations in the Map, keyed by name.
        locations: any;
    }

    export interface IMapsCreatrArea {
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
        afters?: string[];

        // Optional listing of Things to provide to stretch across the Area
        stretches?: string[];
    }

    export interface IMapsCreatrLocation {
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
    export interface IPreThingSettings {
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
    }

    /**
     * 
     */
    export interface IThing {
        // The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
        title: string;

        // An optional group for the Thing to be in, keyed by its id.
        collection?: any;

        // Whether this should skip stretching the boundaries of an area
        noBoundaryStretch?: boolean;
    }

    export interface IMapsCreatrEntrance {
        (scope: any, location: IMapsCreatrLocation);
    }

    export interface IMapsCreatrMacro {
        (
        reference: any,
        prethings: { [i: string]: MapsCreatr.PreThing[] },
        area: IMapsCreatrArea | IMapsCreatrAreaRaw,
        map: IMapsCreatrMap | IMapsCreatrAreaRaw,
        scope: any
        ): MapsCreatr.PreThing | MapsCreatr.PreThing[];
    }
}
