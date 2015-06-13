declare module MapsHandlr {
    export interface IMapsHandlrSettings {
        /**
         * A MapsCreatr used to store and lazily initialize Maps.
         */
        MapsCreator: MapsCreatr.IMapsCreatr;

        /**
         * A MapScreenr used to store attributes of Areas.
         */
        MapScreener: MapScreenr.IMapScreenr;

        /**
         * Function for when a PreThing's Thing should be spawned.
         */
        onSpawn?: (prething: MapsCreatr.IPreThing) => void;

        /**
         * Function for when a PreThing's Thing should be un-spawned.
         */
        onUnspawn?: (prething: MapsCreatr.IPreThing) => void;

        /**
         * Any property names to copy from Areas to MapScreenr.
         */
        screenAttributes?: string[];

        /**
         * Function to add an Area's provided "stretches" commands to stretch
         * across an Area.
         */
        stretchAdd?: (title: string, index: number) => void;

        /**
         * Function to add an Area provides an "afters" command to add PreThings
         * to the end of an Area.
         */
        afterAdd?: (title: string, index: number) => void;
    }

    export interface IMapsHandlr {
        getMapsCreator(): MapsCreatr.IMapsCreatr;
        getMapScreener(): MapScreenr.IMapScreenr;
        getScreenAttributes(): string[];
        getMapName(): string;
        getMap(name?: string): MapsCreatr.IMapsCreatrMap;
        getMaps(): { [i: string]: MapsCreatr.IMapsCreatrMap };
        getArea(): MapsCreatr.IMapsCreatrArea;
        getAreaName(): string;
        getLocation(location: string): MapsCreatr.IMapsCreatrLocation;
        getPreThings(): { [i: string]: MapsCreatr.IPreThing[] };
        setMap(name: string, location?: string): MapsCreatr.IMapsCreatrMap;
        setLocation(name: string): void;
        setStretches(stretchesRaw: MapsCreatr.IPreThingSettings[]): void;
        setAfters(aftersRaw: MapsCreatr.IPreThingSettings[]): void;
        spawnMap(direction: string, top: number, right: number, bottom: number, left: number): void;
        unspawnMap(direction: string, top: number, right: number, bottom: number, left: number): void;
    }
}
