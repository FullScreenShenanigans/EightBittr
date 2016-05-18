/// <reference path="../objectmakr/ObjectMakr.d.ts" />
declare module "IThing" {
    export interface IThing {
        title: string;
        collection?: any;
        collectionKey?: string;
        collectionName?: string;
        entrance?: string;
        groupType: string;
        noBoundaryStretch?: boolean;
    }
}
declare module "IPreThing" {
    import { IThing } from "IThing";
    export interface IPreThingSettings {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        position?: string;
        [i: string]: any;
    }
    export interface IPreThing {
        thing: IThing;
        title: any;
        reference: IPreThingSettings;
        spawned: boolean;
        top: number;
        right: number;
        bottom: number;
        left: number;
        position?: string;
    }
}
declare module "IMapsCreatr" {
    import { IObjectMakr } from "IObjectMakr";
    import { IPreThing, IPreThingSettings } from "IPreThing";
    export interface IMapRaw {
        name: string;
        locations: {
            [i: string]: ILocationRaw;
            [i: number]: ILocationRaw;
        };
        areas: {
            [i: string]: IAreaRaw;
            [i: number]: IAreaRaw;
        };
    }
    export interface IAreaRaw {
        creation: any[];
    }
    export interface ILocationRaw {
        entry?: string;
        area?: number | string;
    }
    export interface IMap {
        initialized: boolean;
        areas: {
            [i: string]: IArea;
            [i: number]: IArea;
        };
        locations: any;
    }
    export interface IArea {
        name: string;
        map: IMap;
        creation: any[];
        collections?: any;
        boundaries: IBoundaries;
        afters?: (string | IPreThingSettings)[];
        stretches?: (string | IPreThingSettings)[];
    }
    export interface IBoundaries {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }
    export interface ILocation {
        name: string;
        area: IArea;
        entryRaw?: string;
        entry?: Function;
    }
    export interface IPreThingsRawContainer {
        [i: string]: IPreThing[];
    }
    export interface IPreThingsContainer {
        xInc: IPreThing[];
        xDec: IPreThing[];
        yInc: IPreThing[];
        yDec: IPreThing[];
        push(prething: IPreThing): void;
    }
    export interface IPreThingsContainers {
        [i: string]: IPreThingsContainer;
    }
    export type IAnalysisContainer = IPreThingsContainers | IPreThingsRawContainer;
    export interface IThing {
        title: string;
        collection?: any;
        collectionKey?: string;
        collectionName?: string;
        noBoundaryStretch?: boolean;
    }
    export interface IEntrance {
        (scope: any, location: ILocation): void;
    }
    export interface IMacro {
        (reference: any, prethings: IPreThingsContainers, area: IArea | IAreaRaw, map: IMap | IAreaRaw, scope: any): IPreThing | IPreThing[] | any;
    }
    export interface IMapsCreatrSettings {
        ObjectMaker: IObjectMakr;
        groupTypes: string[];
        macros?: any;
        scope?: any;
        entrances?: any;
        requireEntrance?: boolean;
        maps?: any;
    }
    export interface IMapsCreatr {
        getObjectMaker(): IObjectMakr;
        getGroupTypes(): string[];
        getMacros(): {
            [i: string]: IMacro;
        };
        getScope(): any;
        getRequireEntrance(): boolean;
        getMapsRaw(): {
            [i: string]: IMapRaw;
        };
        getMaps(): {
            [i: string]: IMap;
        };
        getMapRaw(name: string): IMapRaw;
        getMap(name: string): IMap;
        storeMaps(maps: {
            [i: string]: IMapRaw;
        }): void;
        storeMap(name: string, mapRaw: IMapRaw): IMap;
        getPreThings(area: IArea): IPreThingsContainers;
        analyzePreSwitch(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        analyzePreMacro(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any[] | any;
        analyzePreThing(reference: any, prethings: IPreThingsContainers | IPreThingsRawContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
    }
}
declare module "PreThing" {
    import { IObjectMakr } from "IObjectMakr";
    import { IPreThing, IPreThingSettings } from "IPreThing";
    import { IThing } from "IThing";
    export class PreThing implements IPreThing {
        thing: IThing;
        title: any;
        reference: any;
        spawned: boolean;
        top: number;
        right: number;
        bottom: number;
        left: number;
        position: string;
        constructor(thing: IThing, reference: IPreThingSettings, ObjectMaker: IObjectMakr);
    }
}
declare module "MapsCreatr" {
    import { IObjectMakr } from "IObjectMakr";
    import { IAnalysisContainer, IArea, IAreaRaw, IMacro, IMap, IMapRaw, IMapsCreatrSettings, IMapsCreatr, IPreThingsContainers } from "IMapsCreatr";
    export class MapsCreatr implements IMapsCreatr {
        private ObjectMaker;
        private mapsRaw;
        private maps;
        private groupTypes;
        private macros;
        private entrances;
        private requireEntrance;
        private scope;
        constructor(settings: IMapsCreatrSettings);
        getObjectMaker(): IObjectMakr;
        getGroupTypes(): string[];
        getMacros(): {
            [i: string]: IMacro;
        };
        getScope(): any;
        getRequireEntrance(): boolean;
        getMapsRaw(): {
            [i: string]: IMapRaw;
        };
        getMaps(): {
            [i: string]: IMap;
        };
        getMapRaw(name: string): IMapRaw;
        getMap(name: string): IMap;
        storeMaps(maps: {
            [i: string]: IMapRaw;
        }): void;
        storeMap(name: string, mapRaw: IMapRaw): IMap;
        getPreThings(area: IArea): IPreThingsContainers;
        analyzePreSwitch(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        analyzePreMacro(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any[] | any;
        analyzePreThing(reference: any, prethings: IAnalysisContainer, area: IArea | IAreaRaw, map: IMap | IMapRaw): any;
        private initializeMap(map);
        private setMapAreas(map);
        private setMapLocations(map);
        private stretchAreaBoundaries(prething, area);
        private ensureThingCollection(thing, collectionName, collectionKey, area);
        private processPreThingsArrays(prethings);
        private createObjectFromStringArray(array);
        private getArraySorted(array, sorter?);
        private addArraySorted(array, element, sorter);
        private sortPreThingsXInc(a, b);
        private sortPreThingsXDec(a, b);
        private sortPreThingsYInc(a, b);
        private sortPreThingsYDec(a, b);
    }
}
