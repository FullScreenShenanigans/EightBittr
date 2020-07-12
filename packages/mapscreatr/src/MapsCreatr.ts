import { IObjectMakr } from "objectmakr";

import {
    IAnalysisContainer,
    IArea,
    IAreaRaw,
    IBoundaries,
    IEntrance,
    ILocation,
    IMacro,
    IMap,
    IMapRaw,
    IMapsCreatrSettings,
    IPreThingsContainer,
    IPreThingsContainers,
    IPreThingsRawContainer,
} from "./types";
import { IPreThing } from "./IPreThing";
import { IThing } from "./IThing";
import { PreThing } from "./PreThing";

/**
 * Storage container and lazy loader for EightBittr maps.
 */
export class MapsCreatr {
    /**
     * ObjectMakr factory used to create Maps, Areas, Locations, and Things.
     */
    private readonly objectMaker: IObjectMakr;

    /**
     * Raw map objects passed to this.createMap, keyed by name.
     */
    private readonly mapsRaw: {
        [i: string]: IMapRaw;
    };

    /**
     * Map objects created by this.createMap, keyed by name.
     */
    private readonly maps: {
        [i: string]: IMap;
    };

    /**
     * The possible group types processed PreThings may be placed in.
     */
    private readonly groupTypes: string[];

    /**
     * Macro functions to create PreThings, keyed by String alias.
     */
    private readonly macros: {
        [i: string]: IMacro;
    };

    /**
     * Allowed entrance Functions, keyed by string alias.
     */
    private readonly entrances: {
        [i: string]: IEntrance;
    };

    /**
     * Whether an entrance is required on all Locations.
     */
    private readonly requireEntrance: boolean;

    /**
     * Initializes a new instance of the MapsCreatr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IMapsCreatrSettings) {
        if (!settings) {
            throw new Error("No settings object given to MapsCreatr.");
        }
        if (!settings.objectMaker) {
            throw new Error("No ObjectMakr given to MapsCreatr.");
        }

        this.objectMaker = settings.objectMaker;
        this.groupTypes = settings.groupTypes || [];

        this.macros = settings.macros || {};

        this.entrances = settings.entrances;
        this.requireEntrance = !!settings.requireEntrance;

        this.mapsRaw = {};
        this.maps = {};

        if (settings.maps) {
            this.storeMaps(settings.maps);
        }
    }

    /**
     * @returns The internal ObjectMakr.
     */
    public getObjectMaker(): IObjectMakr {
        return this.objectMaker;
    }

    /**
     * @returns The allowed group types.
     */
    public getGroupTypes(): string[] {
        return this.groupTypes;
    }

    /**
     * @returns The allowed macro Functions.
     */
    public getMacros(): { [i: string]: IMacro } {
        return this.macros;
    }

    /**
     * @returns Whether Locations must have an entrance Function.
     */
    public getRequireEntrance(): boolean {
        return this.requireEntrance;
    }

    /**
     * @returns The Object storing raw maps, keyed by name.
     */
    public getMapsRaw(): { [i: string]: IMapRaw } {
        return this.mapsRaw;
    }

    /**
     * @returns The Object storing maps, keyed by name.
     */
    public getMaps(): { [i: string]: IMap } {
        return this.maps;
    }

    /**
     * @param name   A key to find the map under.
     * @returns The raw map keyed by the given name.
     */
    public getMapRaw(name: string): IMapRaw {
        const mapRaw: IMapRaw = this.mapsRaw[name];
        if (!mapRaw) {
            throw new Error(`No map found under '${name}'.`);
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
    public getMap(name: string): IMap {
        if (!{}.hasOwnProperty.call(this.maps, name)) {
            throw new Error(`No map found under '${name}'.`);
        }

        const map = this.maps[name];

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
    public storeMaps(maps: { [i: string]: IMapRaw }): void {
        for (const i in maps) {
            if ({}.hasOwnProperty.call(maps, i)) {
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
    public storeMap(name: string, mapRaw: IMapRaw): IMap {
        const map: IMap = this.objectMaker.make<IMap>("Map", mapRaw as any);

        this.mapsRaw[name] = mapRaw;
        this.maps[name] = map;

        return map;
    }

    /**
     * Given a Area, this processes and returns the PreThings that are to
     * inhabit the Area per its creation instructions.
     *
     * @returns A container with the parsed PreThings.
     */
    public getPreThings(area: IArea): IPreThingsContainers {
        const map: IMap = area.map;
        const creation: any[] = area.creation;
        const prethings: IPreThingsRawContainer = this.createObjectFromStringArray(
            this.groupTypes
        );

        area.collections = {};

        for (const instruction of creation) {
            this.analyzePreSwitch(instruction, prethings, area, map);
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
     * @param area   The Area to be populated.
     * @param map   The Map containing the Area.
     * @returns The results of analyzePreMacro or analyzePreThing.
     */
    public analyzePreSwitch(
        reference: any,
        prethings: IAnalysisContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw
    ): any {
        // Case: macro
        if (reference.macro) {
            return this.analyzePreMacro(reference, prethings, area, map);
        }

        // Case: default (a regular PreThing)
        return this.analyzePreThing(reference, prethings, area, map);
    }

    /**
     * PreThing case: Macro instruction. This calls the macro on the same input,
     * captures the output, and recursively repeats the analyzePreSwitch driver
     * function on the output(s).
     *
     * @param reference   A JSON mapping of some number of PreThings.
     * @param preThings   The PreThing containers within the Area.
     * @param area   The Area to be populated.
     * @param map   The Map containing the Area.
     */
    public analyzePreMacro(
        reference: any,
        prethings: IAnalysisContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw
    ): any[] | any {
        if (!{}.hasOwnProperty.call(this.macros, reference.macro)) {
            throw new Error(`A non-existent macro is referenced: '${reference.macro}'.`);
        }

        const macro = this.macros[reference.macro];
        const outputs = macro(reference, prethings, area, map);

        // If there is any output, recurse on all components of it, Array or not
        if (outputs) {
            if (outputs instanceof Array) {
                for (const instruction of outputs) {
                    this.analyzePreSwitch(instruction, prethings, area, map);
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
    public analyzePreThing(
        reference: any,
        prethings: IAnalysisContainer,
        area: IArea | IAreaRaw,
        map: IMap | IMapRaw
    ): any {
        const title: string = reference.thing;
        if (!this.objectMaker.hasClass(title)) {
            throw new Error(`A non-existent Thing type is referenced: '${title}'.`);
        }

        const prething: IPreThing = new PreThing(
            this.objectMaker.make<IThing>(title, reference),
            reference,
            this.objectMaker
        );
        const thing: IThing = prething.thing;

        if (!prething.thing.groupType) {
            throw new Error(`A Thing of title '${title}' does not contain a groupType.`);
        }

        if (this.groupTypes.indexOf(prething.thing.groupType) === -1) {
            throw new Error(
                `A Thing of title '${title}' contains an unknown groupType: '${prething.thing.groupType}.`
            );
        }

        prethings[prething.thing.groupType].push(prething);
        if (!thing.noBoundaryStretch && (area as IArea).boundaries) {
            this.stretchAreaBoundaries(prething, area as IArea);
        }

        // If a Thing is an entrance, then the entrance's location must know the Thing.
        if (thing.entrance !== undefined) {
            if (typeof map.locations[thing.entrance] !== "undefined") {
                if (typeof map.locations[thing.entrance].xloc === "undefined") {
                    map.locations[thing.entrance].xloc = prething.left;
                }
                if (typeof map.locations[thing.entrance].yloc === "undefined") {
                    map.locations[thing.entrance].yloc = prething.top;
                }

                map.locations[thing.entrance].entrance = prething.thing;
            }
        }

        if (reference.collectionName && (area as IArea).collections) {
            this.ensureThingCollection(
                thing,
                reference.collectionName,
                reference.collectionKey,
                area as IArea
            );
        }

        return prething;
    }

    /**
     * Parses the Areas and Locations in a map to make it ready for use.
     *
     * @param map   A map to be initialized.
     */
    private initializeMap(map: IMap): void {
        // Set the one-to-many Map->Area relationships within the Map
        this.setMapAreas(map);

        // Set the one-to-many Area->Location relationships within the Map
        this.setMapLocations(map);

        map.initialized = true;
    }

    /**
     * Converts the raw area settings in a Map into Area objects.
     *
     * @param map   A map whose areas should be parsed.
     */
    private setMapAreas(map: IMap): void {
        const areasRaw: any = map.areas;
        const locationsRaw: any = map.locations;

        // The parsed containers should be the same types as the originals
        const areasParsed: any = new areasRaw.constructor();
        const locationsParsed: any = new locationsRaw.constructor();

        // Parse all the Area objects (works for both Arrays and Objects)
        for (const i in areasRaw) {
            if (!{}.hasOwnProperty.call(areasRaw, i)) {
                continue;
            }

            const area: IArea = this.objectMaker.make<IArea>("Area", areasRaw[i]);
            areasParsed[i] = area;

            area.map = map;
            area.name = i;

            area.boundaries = {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
            };
        }

        // Parse all the Location objects (works for both Arrays and Objects)
        for (const i in locationsRaw) {
            if (!{}.hasOwnProperty.call(locationsRaw, i)) {
                continue;
            }

            const location: ILocation = this.objectMaker.make<ILocation>(
                "Location",
                locationsRaw[i]
            );
            locationsParsed[i] = location;

            location.entryRaw = locationsRaw[i].entry;
            location.name = i;
            location.area = locationsRaw[i].area || 0;

            if (this.requireEntrance) {
                if (
                    location.entryRaw === undefined ||
                    !{}.hasOwnProperty.call(this.entrances, location.entryRaw)
                ) {
                    throw new Error(
                        `Location ${i} has unknown entry string: '${location.entryRaw}'.`
                    );
                }
            }

            if (this.entrances && location.entryRaw) {
                location.entry = this.entrances[location.entryRaw];
            } else if (location.entry && location.entry.constructor === String) {
                location.entry = this.entrances[String(location.entry)];
            }
        }

        map.areas = areasParsed;
        map.locations = locationsParsed;
    }

    /**
     * Converts the raw location settings in a Map into Location objects.
     *
     * @param map   A map whose locations should be parsed.
     */
    private setMapLocations(map: IMap): void {
        // The parsed container should be the same type as the original
        const locationsRaw: any = map.locations;
        const locationsParsed: any = new locationsRaw.constructor();

        // Parse all the keys in locationsRaw (works for both Arrays and Objects)
        for (const i in locationsRaw) {
            if (!{}.hasOwnProperty.call(locationsRaw, i)) {
                continue;
            }

            const location: ILocation = this.objectMaker.make<ILocation>(
                "Location",
                locationsRaw[i]
            );
            locationsParsed[i] = location;

            // The area should be an object reference, under the Map's areas
            location.area = map.areas[locationsRaw[i].area || 0];
            if (!locationsParsed[i].area) {
                throw new Error(
                    `Location '${i}'' references an invalid area: '${locationsRaw[i].area}'.`
                );
            }
        }

        // Store the output object in the Map, and keep the old settings for the
        // Sake of debugging / user interest
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
    private stretchAreaBoundaries(prething: IPreThing, area: IArea): void {
        const boundaries: IBoundaries = area.boundaries;

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
    private ensureThingCollection(
        thing: IThing,
        collectionName: string,
        collectionKey: string,
        area: IArea
    ): void {
        let collection: any = area.collections[collectionName];

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
        const output: IPreThingsContainers = {};

        for (const i in prethings) {
            const children: IPreThing[] = prethings[i];
            const array: IPreThingsContainer = {
                push: (prething: IPreThing): void => {
                    this.addArraySorted(array.xInc, prething, this.sortPreThingsXInc);
                    this.addArraySorted(array.xDec, prething, this.sortPreThingsXDec);
                    this.addArraySorted(array.yInc, prething, this.sortPreThingsYInc);
                    this.addArraySorted(array.yDec, prething, this.sortPreThingsYDec);
                },
                xDec: this.getArraySorted(children, this.sortPreThingsXDec),
                xInc: this.getArraySorted(children, this.sortPreThingsXInc),
                yDec: this.getArraySorted(children, this.sortPreThingsYDec),
                yInc: this.getArraySorted(children, this.sortPreThingsYInc),
            };

            output[i] = array;
        }

        return output;
    }

    /**
     * Creates an Object pre-populated with one key for each of the Strings in
     * the input Array, each pointing to a new Array.
     *
     * @param array   An Array listing the keys to be made into an Object.
     * @returns An Object with the keys listed in the Array.
     */
    private createObjectFromStringArray(array: string[]): any {
        const output: any = {};

        for (const member of array) {
            output[member] = [];
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
        const copy: any[] = array.slice();
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
        let lower = 0;
        let upper: number = array.length;

        while (lower !== upper) {
            const index: number = ((lower + upper) / 2) | 0;

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
