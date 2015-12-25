// @echo '/// <reference path="ObjectMakr-0.2.2.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ObjectMakr-0.2.2.ts" />
/// <reference path="MapsCreatr.d.ts" />
/// <reference path="PreThing.ts" />
// @endif

// @include ../Source/MapsCreatr.d.ts
// @include ../Source/PreThing.ts

module MapsCreatr {
    "use strict";

    /**
     * Storage container and lazy loader for GameStartr maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved. 
     */
    export class MapsCreatr {
        /**
         * ObjectMakr factory used to create Maps, Areas, Locations, and Things.
         */
        private ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * Raw map objects passed to this.createMap, keyed by name.
         */
        private mapsRaw: {
            [i: string]: IMapsCreatrMapRaw;
        };

        /**
         * Map objects created by this.createMap, keyed by name.
         */
        private maps: {
            [i: string]: IMapsCreatrMap
        };

        /**
         * The possible group types processed PreThings may be placed in.
         */
        private groupTypes: string[];

        /**
         * Macro functions to create PreThings, keyed by String alias.
         */
        private macros: {
            [i: string]: IMapsCreatrMacro;
        };

        /**
         * String key under which Things store their group.
         */
        private keyGroupType: string;

        /**
         * String key under which Things may store that they are a Location entrance.
         */
        private keyEntrance: string;

        /**
         * Allowed entrance Functions, keyed by string alias.
         */
        private entrances: {
            [i: string]: IMapsCreatrEntrance;
        };

        /**
         * Whether an entrance is required on all Locations.
         */
        private requireEntrance: boolean;

        /**
         * An optional scope to pass to macros as an argument after maps, instead
         * of this MapsCreatr.
         */
        private scope: any;

        /**
         * Initializes a new instance of the MapsCreatr class.
         * 
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IMapsCreatrSettings) {
            if (!settings) {
                throw new Error("No settings object given to MapsCreatr.");
            }
            if (!settings.ObjectMaker) {
                throw new Error("No ObjectMakr given to MapsCreatr.");
            }
            if (typeof settings.ObjectMaker.getFullProperties() === "undefined") {
                throw new Error("MapsCreatr's ObjectMaker must store full properties.");
            }
            if (!settings.groupTypes) {
                throw new Error("No groupTypes given to MapsCreatr.");
            }

            this.ObjectMaker = settings.ObjectMaker;
            this.groupTypes = settings.groupTypes;

            this.keyGroupType = settings.keyGroupType || "groupType";
            this.keyEntrance = settings.keyEntrance || "entrance";

            this.macros = settings.macros || {};
            this.scope = settings.scope || this;

            this.entrances = settings.entrances;
            this.requireEntrance = settings.requireEntrance;

            this.mapsRaw = {};
            this.maps = {};
            if (settings.maps) {
                this.storeMaps(settings.maps);
            }
        }


        /* Simple gets
        */

        /**
         * @returns The internal ObjectMakr.
         */
        getObjectMaker(): ObjectMakr.IObjectMakr {
            return this.ObjectMaker;
        }

        /**
         * @returns The allowed group types.
         */
        getGroupTypes(): string[] {
            return this.groupTypes;
        }

        /**
         * @returns The key under which Things are to store their group.
         */
        getKeyGroupType(): string {
            return this.keyGroupType;
        }

        /**
         * @returns The key under which Things declare themselves an entrance.
         */
        getKeyEntrance(): string {
            return this.keyEntrance;
        }

        /**
         * @returns The allowed macro Functions.
         */
        getMacros(): { [i: string]: IMapsCreatrMacro; } {
            return this.macros;
        }

        /**
         * @returns The scope to give as a last parameter to macros.
         */
        getScope(): any {
            return this.scope;
        }

        /**
         * @returns Whether Locations must have an entrance Function.
         */
        getRequireEntrance(): boolean {
            return this.requireEntrance;
        }

        /**
         * @returns The Object storing raw maps, keyed by name.
         */
        getMapsRaw(): { [i: string]: IMapsCreatrMapRaw } {
            return this.mapsRaw;
        }

        /**
         * @returns The Object storing maps, keyed by name.
         */
        getMaps(): { [i: string]: IMapsCreatrMap } {
            return this.maps;
        }

        /**
         * @param name   A key to find the map under.
         * @returns The raw map keyed by the given name.
         */
        getMapRaw(name: string): IMapsCreatrMapRaw {
            var mapRaw: IMapsCreatrMapRaw = this.mapsRaw[name];
            if (!mapRaw) {
                throw new Error("No map found under: " + name);
            }

            return mapRaw;
        }

        /**
         * Getter for a map under the maps container. If the map has not yet been
         * initialized that is done here as lazy loading.
         * 
         * @param name   A key to find the map under.
         * @returns The parsed map keyed by the given name.
         */
        getMap(name: string): IMapsCreatrMap {
            var map: IMapsCreatrMap = this.maps[name];
            if (!map) {
                throw new Error("No map found under: " + name);
            }

            if (!map.initialized) {
                this.initializeMap(map);
            }

            return map;
        }

        /**
         * Creates and stores a set of new maps based on the key/value pairs in a 
         * given Object. These will be stored as maps by their string keys via 
         * this.storeMap.
         * 
         * @param maps   Raw maps keyed by their storage key.
         */
        storeMaps(maps: { [i: string]: IMapsCreatrMapRaw }): void {
            var i: string;

            for (i in maps) {
                if (maps.hasOwnProperty(i)) {
                    this.storeMap(i, maps[i]);
                }
            }
        }

        /**
         * Creates and stores a new map. The internal ObjectMaker factory is used to
         * auto-generate it based on a given settings object. The actual loading of
         * Areas and Locations is deferred to this.getMap.
         * 
         * @param name   A name under which the map should be stored.
         * @param mapRaw   A raw map to be stored.
         * @returns A Map object created by the internal ObjectMakr using the raw map.
         */
        storeMap(name: string, mapRaw: IMapsCreatrMapRaw): IMapsCreatrMap {
            if (!name) {
                throw new Error("Maps cannot be created with no name.");
            }

            var map: IMapsCreatrMap = this.ObjectMaker.make("Map", mapRaw);

            this.mapsRaw[name] = mapRaw;

            if (!map.areas) {
                throw new Error("Maps cannot be used with no areas: " + name);
            }

            if (!map.locations) {
                throw new Error("Maps cannot be used with no locations: " + name);
            }

            this.maps[name] = map;
            return map;
        }


        /* Area setup (PreThing analysis)
        */

        /**
         * Given a Area, this processes and returns the PreThings that are to 
         * inhabit the Area per its creation instructions.
         * 
         * @returns A container with the parsed PreThings.
         */
        getPreThings(area: IMapsCreatrArea): IPreThingsContainers {
            var map: IMapsCreatrMap = area.map,
                creation: any = area.creation,
                prethings: IPreThingsRawContainer = this.createObjectFromStringArray(this.groupTypes),
                i: number;

            area.collections = {};

            for (i = 0; i < creation.length; i += 1) {
                this.analyzePreSwitch(creation[i], prethings, area, map);
            }

            return this.processPreThingsArrays(prethings);
        }

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
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any {
            // Case: macro (unless it's undefined)
            if (reference.macro) {
                return this.analyzePreMacro(reference, prethings, area, map);
            } else {
                // Case: default (a regular PreThing)
                return this.analyzePreThing(reference, prethings, area, map);
            }
        }

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
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any[] | any {
            var macro: any = this.macros[reference.macro],
                outputs: any[] | any,
                i: number;

            if (!macro) {
                throw new Error("A non-existent macro is referenced: '" + reference.macro + "'.");
            }

            // Avoid modifying the original macro by creating a new object in its
            // place, while submissively proliferating any default macro settings
            outputs = macro(reference, prethings, area, map, this.scope);

            // If there is any output, recurse on all components of it, Array or not
            if (outputs) {
                if (outputs instanceof Array) {
                    for (i = 0; i < outputs.length; i += 1) {
                        this.analyzePreSwitch(outputs[i], prethings, area, map);
                    }
                } else {
                    this.analyzePreSwitch(outputs, prethings, area, map);
                }
            }

            return outputs;
        }

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
            map: IMapsCreatrMap | IMapsCreatrMapRaw): any {
            var title: string = reference.thing,
                thing: IThing,
                prething: PreThing;

            if (!this.ObjectMaker.hasFunction(title)) {
                throw new Error("A non-existent Thing type is referenced: '" + title + "'.");
            }

            prething = new PreThing(this.ObjectMaker.make(title, reference), reference, this.ObjectMaker);
            thing = prething.thing;

            if (!prething.thing[this.keyGroupType]) {
                throw new Error("A Thing of type '" + title + "' does not contain a " + this.keyGroupType + ".");
            }

            if (this.groupTypes.indexOf(prething.thing[this.keyGroupType]) === -1) {
                throw new Error("A Thing of type '" + title + "' contains an unknown " + this.keyGroupType + ".");
            }

            prethings[prething.thing[this.keyGroupType]].push(prething);
            if (!thing.noBoundaryStretch && (<IMapsCreatrArea>area).boundaries) {
                this.stretchAreaBoundaries(prething, <IMapsCreatrArea>area);
            }

            // If a Thing is an entrance, then the entrance's location must know the Thing.
            if (thing[this.keyEntrance] !== undefined && typeof thing[this.keyEntrance] !== "object") {
                if (typeof map.locations[thing[this.keyEntrance]] !== "undefined") {
                    if (typeof map.locations[thing[this.keyEntrance]].xloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].xloc = prething.left;
                    }
                    if (typeof map.locations[thing[this.keyEntrance]].yloc === "undefined") {
                        map.locations[thing[this.keyEntrance]].yloc = prething.top;
                    }

                    map.locations[thing[this.keyEntrance]].entrance = prething.thing;
                }
            }

            if (reference.collectionName && (<IMapsCreatrArea>area).collections) {
                this.ensureThingCollection(
                    thing,
                    reference.collectionName,
                    reference.collectionKey,
                    <IMapsCreatrArea>area
                );
            }

            return prething;
        }


        /* Map initialization
        */

        /**
         * Parses the Areas and Locations in a map to make it ready for use.
         * 
         * @param map   A map to be initialized.
         */
        private initializeMap(map: IMapsCreatrMap): void {
            // Set the one-to-many Map->Area relationships within the Map
            this.setMapAreas(map);

            // Set the one-to-many Area->Location relationships within the Map
            this.setMapLocations(map);

            map.initialized = true;
        }

        /**
         * Converts the raw area settings in a Map into Area objects.
         * 
         * @param map   A map whose area settings should be parsed.
         */
        private setMapAreas(map: IMapsCreatrMap): void {
            var areasRaw: any = map.areas,
                locationsRaw: any = map.locations,
                // The parsed containers should be the same types as the originals
                areasParsed: any = new areasRaw.constructor(),
                locationsParsed: any = new locationsRaw.constructor(),
                area: IMapsCreatrArea,
                location: IMapsCreatrLocation,
                i: string;

            // Parse all the Area objects (works for both Arrays and Objects)
            for (i in areasRaw) {
                if (areasRaw.hasOwnProperty(i)) {
                    area = this.ObjectMaker.make("Area", areasRaw[i]);
                    areasParsed[i] = area;

                    area.map = map;
                    area.name = i;

                    area.boundaries = {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    };
                }
            }

            // Parse all the Location objects (works for both Arrays and Objects)
            for (i in locationsRaw) {
                if (locationsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locationsRaw[i]);
                    locationsParsed[i] = location;

                    location.entryRaw = locationsRaw[i].entry;
                    location.name = i;
                    location.area = locationsRaw[i].area || 0;

                    if (this.requireEntrance) {
                        if (!this.entrances.hasOwnProperty(location.entryRaw)) {
                            throw new Error("Location " + i + " has unknown entry string: " + location.entryRaw);
                        }
                    }

                    if (this.entrances && location.entryRaw) {
                        location.entry = this.entrances[location.entryRaw];
                    } else if (location.entry && location.entry.constructor === String) {
                        location.entry = this.entrances[String(location.entry)];
                    }
                }
            }

            // Store the output object in the Map, and keep the raw settings for the
            // sake of debugging / user interest
            map.areas = areasParsed;
            map.locations = locationsParsed;
        }

        /**
         * Converts the raw location settings in a Map into Location objects.
         * 
         * @param {Map} map
         */
        private setMapLocations(map: IMapsCreatrMap): void {
            var locationsRaw: any = map.locations,
                // The parsed container should be the same type as the original
                locationsParsed: any = new locationsRaw.constructor(),
                location: IMapsCreatrLocation,
                i: string;

            // Parse all the keys in locasRaw (works for both Arrays and Objects)
            for (i in locationsRaw) {
                if (locationsRaw.hasOwnProperty(i)) {
                    location = this.ObjectMaker.make("Location", locationsRaw[i]);
                    locationsParsed[i] = location;

                    // The area should be an object reference, under the Map's areas
                    location.area = map.areas[locationsRaw[i].area || 0];
                    if (!locationsParsed[i].area) {
                        throw new Error("Location " + i + " references an invalid area:" + locationsRaw[i].area);
                    }
                }
            }

            // Store the output object in the Map, and keep the old settings for the
            // sake of debugging / user interest
            map.locations = locationsParsed;
        }

        /**
         * "Stretches" an Area's boundaries based on a PreThing. For each direction,
         * if the PreThing has a more extreme version of it (higher top, etc.), the
         * boundary is updated.
         * 
         * @param prething   The PreThing stretching the Area's boundaries.
         * @param area   An Area containing the PreThing.
         */
        private stretchAreaBoundaries(prething: PreThing, area: IMapsCreatrArea): void {
            var boundaries: any = area.boundaries;

            boundaries.top = Math.min(prething.top, boundaries.top);
            boundaries.right = Math.max(prething.right, boundaries.right);
            boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
            boundaries.left = Math.min(prething.left, boundaries.left);
        }

        /**
         * Adds a Thing to the specified collection in the Map's Area. If the collection
         * doesn't exist yet, it's created.
         * 
         * @param thing   The thing that has specified a collection.
         * @param collectionName   The name of the collection.
         * @param collectionKey   The key under which the collection should store 
         *                        the Thing.
         * @param area   The Area containing the collection.
         */
        private ensureThingCollection(thing: IThing, collectionName: string, collectionKey: string, area: IMapsCreatrArea): void {
            var collection: any = area.collections[collectionName];

            if (!collection) {
                collection = area.collections[collectionName] = {};
            }

            thing.collection = collection;
            collection[collectionKey] = thing;
        }

        /**
         * Creates an Object wrapper around a PreThings Object with versions of each 
         * child PreThing[] sorted by xloc and yloc, in increasing and decreasing order.
         * 
         * @param prethings   A raw container of PreThings.
         * @returns A PreThing wrapper with the keys "xInc", "xDec", "yInc", and "yDec".
         */
        private processPreThingsArrays(prethings: IPreThingsRawContainer): IPreThingsContainers {
            var output: IPreThingsContainers = {},
                i: string;

            for (i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    var children: IPreThing[] = prethings[i],
                        array: IPreThingsContainer = {
                            "xInc": this.getArraySorted(children, this.sortPreThingsXInc),
                            "xDec": this.getArraySorted(children, this.sortPreThingsXDec),
                            "yInc": this.getArraySorted(children, this.sortPreThingsYInc),
                            "yDec": this.getArraySorted(children, this.sortPreThingsYDec),
                            "push": (prething: IPreThing): void => {
                                this.addArraySorted(array.xInc, prething, this.sortPreThingsXInc);
                                this.addArraySorted(array.xDec, prething, this.sortPreThingsXDec);
                                this.addArraySorted(array.yInc, prething, this.sortPreThingsYInc);
                                this.addArraySorted(array.yDec, prething, this.sortPreThingsYDec);
                            }
                        };

                    output[i] = array;
                }
            }

            return output;
        }


        /* Utilities
        */

        /**
         * Creates an Object pre-populated with one key for each of the Strings in
         * the input Array, each pointing to a new Array. 
         * 
         * @param array   An Array listing the keys to be made into an Object.
         * @returns An Object with the keys listed in the Array.
         */
        private createObjectFromStringArray(array: string[]): any {
            var output: any = {},
                i: number;

            for (i = 0; i < array.length; i += 1) {
                output[array[i]] = [];
            }

            return output;
        }

        /**
         * Returns a shallow copy of an Array, in sorted order based on a given
         * sorter Function.
         * 
         * @param array   An Array to be sorted.
         * @param sorter   A standard sorter Function.
         * @returns A copy of the original Array, sorted.
         */
        private getArraySorted(array: any[], sorter?: (a: any, b: any) => number): any[] {
            var copy: any[] = array.slice();
            copy.sort(sorter);
            return copy;
        }

        /**
         * Adds an element into an Array using a binary search with a sorter Function. 
         * 
         * @param array   An Array to insert the element into.
         * @param element   An element to insert into the Array.
         * @param sorter   A standard sorter Function.
         */
        private addArraySorted(array: any, element: any, sorter: (a: any, b: any) => number): void {
            var lower: number = 0,
                upper: number = array.length,
                index: number;

            while (lower !== upper) {
                index = ((lower + upper) / 2) | 0;

                // Case: element is less than the index
                if (sorter(element, array[index]) < 0) {
                    upper = index;
                } else {
                    // Case: element is higher than the index
                    lower = index + 1;
                }
            }

            if (lower === upper) {
                array.splice(lower, 0, element);
                return;
            }
        }

        /**
         * Sorter for PreThings that results in increasing horizontal order.
         * 
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsXInc(a: PreThing, b: PreThing): number {
            return a.left === b.left ? a.top - b.top : a.left - b.left;
        }

        /**
         * Sorter for PreThings that results in decreasing horizontal order.
         * 
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsXDec(a: PreThing, b: PreThing): number {
            return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
        }

        /**
         * Sorter for PreThings that results in increasing vertical order.
         * 
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsYInc(a: PreThing, b: PreThing): number {
            return a.top === b.top ? a.left - b.left : a.top - b.top;
        }

        /**
         * Sorter for PreThings that results in decreasing vertical order.
         * 
         * @param a   A PreThing.
         * @param b   A PreThing.
         */
        private sortPreThingsYDec(a: PreThing, b: PreThing): number {
            return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
        }
    }
}
