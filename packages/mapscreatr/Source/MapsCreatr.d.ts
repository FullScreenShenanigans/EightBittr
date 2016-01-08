declare module MapsCreatr {
    /**
     * A raw JSON-friendly description of a map.
     */
    export interface IMapsCreatrMapRaw {
        /**
         * The name of the map.
         */
        name: string;

        /**
         * Descriptions of locations in the map.
         */
        locations: {
            [i: string]: IMapsCreatrLocationRaw;
            [i: number]: IMapsCreatrLocationRaw;
        };

        /**
         * Descriptions of areas in the map.
         */
        areas: {
            [i: string]: IMapsCreatrAreaRaw;
            [i: number]: IMapsCreatrAreaRaw;
        };
    }

    /**
     * A raw JSON-friendly description of a map area.
     */
    export interface IMapsCreatrAreaRaw {
        /**
         * Commands to place PreThings in the area.
         */
        creation: any[];
    }

    /**
     * A raw JSON-friendly description of a map location.
     */
    export interface IMapsCreatrLocationRaw {
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
    export interface IMapsCreatrMap {
        /**
         * Whether the Map has had its areas and locations set.
         */
        initialized: boolean;

        /**
         * A listing of areas in the Map, keyed by name.
         */
        areas: {
            [i: string]: IMapsCreatrArea;
            [i: number]: IMapsCreatrArea;
        };

        /**
         * A listing of locations in the Map, keyed by name.
         */
        locations: any;
    }

    /**
     * An Area parsed from a raw JSON-friendly Map description.
     */
    export interface IMapsCreatrArea {
        /**
         * The user-friendly label for this Area.
         */
        name: string;

        /**
         * The Map this Area is a part of.
         */
        map: IMapsCreatrMap;

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
        boundaries: {
            "top": number;
            "right": number;
            "bottom": number;
            "left": number;
        };

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
     * A Location parsed from a raw JSON-friendly Map description.
     */
    export interface IMapsCreatrLocation {
        /**
         * The user-friendly label for this Location.
         */
        name: string;

        /**
         * The Area this Location is a part of.
         */
        area: IMapsCreatrArea;

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
     * Settings to create an IPreThing.
     */
    export interface IPreThingSettings {
        /**
         * The horizontal starting location of the Thing (by default, 0).
         */
        x?: number;

        /**
         * The vertical starting location of the Thing (by default, 0).
         */
        y?: number;

        /**
         * How wide the Thing is (by default, the Thing's prototype's width from
         * ObjectMaker.getFullPropertiesOf).
         */
        width?: number;

        /**
         * How tall the Thing is (by default, the Thing's prototype's height from
         * ObjectMaker.getFullPropertiesOf).
         */
        height?: number;

        /**
         * An optional immediate modifier instruction for where the Thing should be
         * in its GroupHoldr group (either "beginning", "end", or undefined).
         */
        position?: string;

        /**
         * PreThings may pass any settings onto their created Things.
         */
        [i: string]: any;
    }

    /**
     * A position holder around an in-game Thing.
     */
    export interface IPreThing {
        /**
         * The in-game Thing.
         */
        thing: IThing;

        /**
         * What type the Thing is.
         */
        title: any;

        /**
         * The raw JSON-friendly settings that created this.
         */
        reference: IPreThingSettings;

        /**
         * Whether the Thing has been placed in the container Map.
         */
        spawned: boolean;

        /**
         * The top edge of the Thing's bounding box.
         */
        top: number;

        /**
         * The right edge of the Thing's bounding box.
         */
        right: number;

        /**
         * The bottom edge of the Thing's bounding box.
         */
        bottom: number;

        /**
         * The left edge of the Thing's bounding box.
         */
        left: number;

        /**
         * What part of the in-game container group to move this to, if needed.
         */
        position?: string;
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
     * An in-game object created from an IPreThing.
     */
    export interface IThing {
        /**
         * The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
         */
        title: string;

        /**
         * An optional group for the Thing to be in, keyed by its id.
         */
        collection?: any;

        /**
         * The key of the collection to place this Thing in, if collection isn't undefined.
         */
        collectionKey?: string;

        /**
         * The name this is referred to in its collection, if collection isn't undefined.
         */
        collectionName?: string;

        /**
         * Whether this should skip stretching the boundaries of an area
         */
        noBoundaryStretch?: boolean;
    }

    /**
     * A Function used to enter a Map Location.
     * 
     * @param scope   The container scope causing the entrance.
     * @param location   The Location within an Area being entered.
     */
    export interface IMapsCreatrEntrance {
        (scope: any, location: IMapsCreatrLocation): void;
    }

    /**
     * A Function to automate placing other PreThings or macros in an Area.
     * 
     * @param reference   The JSON-friendly reference causing the macro.
     * @param prethings   The container of PreThings this is adding to.
     * @param area   The container Area containing the PreThings.
     * @param map   The container Map containing the Area.
     * @param scope   The container scope running the macro.
     * @returns A single PreThing or macro descriptor, or Array thereof.
     */
    export interface IMapsCreatrMacro {
        (
            reference: any,
            prethings: IPreThingsContainers,
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrAreaRaw,
            scope: any
        ): IPreThing | IPreThing[] | any;
    }

    /**
     * Settings to initialize a new IMapsCreatr.
     */
    export interface IMapsCreatrSettings {
        /**
         * An ObjectMakr used to create Maps and Things.Note that it must store 
         * full properties of Things, for quick size lookups.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * The names of groups Things may be in.
         */
        groupTypes: string[];

        /**
         * The key for Things to determine what group they belong to (by default,
         * "groupType").
         */
        keyGroupType?: string;

        /**
         * The key for Things to determine what, if any, Location they act as an
         * entrance for (by default, "entrance").
         */
        keyEntrance?: string;

        /**
         * A listing of macros that can be used to automate common operations.
         */
        macros?: any;

        /**
         * A scope to give as a last parameter to macro Functions (by default, the
         * calling MapsCreatr).
         */
        scope?: any;

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
     * Storage container and lazy loader for GameStartr maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved. 
     */
    export interface IMapsCreatr {
        /**
         * @returns The internal ObjectMakr.
         */
        getObjectMaker(): ObjectMakr.IObjectMakr;

        /**
         * @returns The allowed group types.
         */
        getGroupTypes(): string[];

        /**
         * @returns The key under which Things are to store their group.
         */
        getKeyGroupType(): string;

        /**
         * @returns The key under which Things declare themselves an entrance.
         */
        getKeyEntrance(): string;

        /**
         * @returns The allowed macro Functions.
         */
        getMacros(): { [i: string]: IMapsCreatrMacro; };

        /**
         * @returns The scope to give as a last parameter to macros.
         */
        getScope(): any;

        /**
         * @returns Whether Locations must have an entrance Function.
         */
        getRequireEntrance(): boolean;

        /**
         * @returns The Object storing raw maps, keyed by name.
         */
        getMapsRaw(): { [i: string]: IMapsCreatrMapRaw };

        /**
         * @returns The Object storing maps, keyed by name.
         */
        getMaps(): { [i: string]: IMapsCreatrMap };

        /**
         * @param name   A key to find the map under.
         * @returns The raw map keyed by the given name.
         */
        getMapRaw(name: string): IMapsCreatrMapRaw;

        /**
         * Getter for a map under the maps container. If the map has not yet been
         * initialized that is done here as lazy loading.
         * 
         * @param name   A key to find the map under.
         * @returns The parsed map keyed by the given name.
         */
        getMap(name: string): IMapsCreatrMap;

        /**
         * Creates and stores a set of new maps based on the key/value pairs in a 
         * given Object. These will be stored as maps by their string keys via 
         * this.storeMap.
         * 
         * @param maps   Raw maps keyed by their storage key.
         */
        storeMaps(maps: { [i: string]: IMapsCreatrMapRaw }): void;

        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         * 
         * @param name   A name under which the map should be stored.
         * @param mapRaw   A raw map to be stored.
         * @returns A Map object created by the internal ObjectMakr using the raw map.
         */
        storeMap(name: string, mapRaw: IMapsCreatrMapRaw): IMapsCreatrMap;

        /**
         * Given a Area, this processes and returns the PreThings that are to 
         * inhabit the Area per its creation instructions.
         * 
         * @returns A container with the parsed PreThings.
         */
        getPreThings(area: IMapsCreatrArea): IPreThingsContainers;

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
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any;

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
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[] | any;

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
            area: IMapsCreatrArea | IMapsCreatrAreaRaw,
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any;
    }
}
