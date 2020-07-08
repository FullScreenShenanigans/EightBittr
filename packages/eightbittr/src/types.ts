import { IAreaSpawnrSettings } from "areaspawnr";
import { IFpsAnalyzrSettings } from "fpsanalyzr";
import { IFrameTickrSettings } from "frametickr";
import { IGroupHoldrSettings, IThing as IGroupHoldrThing } from "groupholdr";
import { IInputWritrSettings } from "inputwritr";
import { IItemsHoldrSettings } from "itemsholdr";
import {
    IAreaRaw as IMapsCreatrIAreaRaw,
    IMapRaw as IMapsCreatrIMapRaw,
    IMapsCreatrSettings,
    IThing as IMapsCreatrThing,
} from "mapscreatr";
import { IMapScreenrSettings } from "mapscreenr";
import { IObjectMakrSettings } from "objectmakr";
import { IPixelDrawrSettings, IThing as IPixelDrawrThing } from "pixeldrawr";
import { IPixelRendrSettings } from "pixelrendr";
import { IQuadrant, IQuadsKeeprSettings, IThing as IQuadsKeeprThing } from "quadskeepr";
import { IThing as IThingHittrThing, IThingHittrSettings } from "thinghittr";
import { ITimeHandlrSettings } from "timehandlr";

/**
 * Settings to initialize a new EightBittr.
 */
export interface IEightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components?: Partial<IComponentSettings>;

    /**
     * How many pixels tall the game area should be.
     */
    height: number;

    /**
     * How many pixels wide the game area should be.
     */
    width: number;
}

/**
 * Filled-out settings to initialize a new EightBittr.
 */
export type IEightBittrSettings = Required<IEightBittrConstructorSettings>;

/**
 * Settings to generate components.
 */
export interface IComponentSettings {
    /**
     * Settings for map area spawning, particularly for an AreaSpawnr.
     */
    areaSpawner?: Partial<IAreaSpawnrSettings>;

    /**
     * Settings for FPS analysis, particularly for an FpsAnalyzr.
     */
    fpsAnalyzer?: Partial<IFpsAnalyzrSettings>;

    /**
     * Settings for timed upkeep running, particularly for a FrameTickr.
     */
    frameTicker?: Partial<IFrameTickrSettings>;

    /**
     * Settings for in-memory Thing groups, particularly for a GroupHoldr.
     */
    groupHolder?: Partial<IGroupHoldrSettings<{ [i: string]: IThing }>>;

    /**
     * Settings for keyboard and mouse inputs, particularly for a InputWritr.
     */
    inputWriter?: Partial<IInputWritrSettings>;

    /**
     * Settings for locally stored items, particularly for a ItemsHoldr.
     */
    itemsHolder?: Partial<IItemsHoldrSettings>;

    /**
     * Settings for stored maps, particularly for a MapsCreatr.
     */
    mapsCreator?: Partial<IMapsCreatrSettings>;

    /**
     * Settings for screen attributes, particularly for a MapScreenr.
     */
    mapScreener?: Partial<IMapScreenrSettings>;

    /**
     * Settings for in-game object generation, particularly for a ObjectMakr.
     */
    objectMaker?: Partial<IObjectMakrSettings>;

    /**
     * Settings for Thing sprite drawing, particularly for a PixelDrawr.
     */
    pixelDrawer?: Partial<IPixelDrawrSettings>;

    /**
     * Settings for Thing sprite generation, particularly for a PixelRendr.
     */
    pixelRender?: Partial<IPixelRendrSettings>;

    /**
     * Settings for screen quadrants, particularly for a QuadsKeepr.
     */
    quadsKeeper?: Partial<IQuadsKeeprSettings>;

    /**
     * Settings for timed events, particularly for a TimeHandlr.
     */
    timeHandler?: Partial<ITimeHandlrSettings>;

    /**
     * Settings for collision detection, particularily for a ThingHittr.
     */
    thingHitter?: Partial<IThingHittrSettings>;
}

export interface IGameWindow {
    /**
     * Adds an event listener to the window.
     */
    addEventListener: typeof window.addEventListener;

    /**
     * Reference to the window document.
     */
    document: {
        /**
         * Adds an event listener to the document.
         */
        addEventListener: typeof document.addEventListener;
    };

    /**
     * Removes an event listener from the window.
     */
    removeEventListener: typeof window.removeEventListener;
}

/**
 * A raw JSON-friendly description of a map.
 */
export interface IMapRaw extends IMapsCreatrIMapRaw {
    /**
     * A default location to spawn into.
     */
    locationDefault: number | string;

    /**
     * Descriptions of areas within the map.
     */
    areas: {
        [i: string]: IAreaRaw;
    };
}

/**
 * A raw JSON-friendly description of a map area.
 */
export interface IAreaRaw extends IMapsCreatrIAreaRaw {
    /**
     * A background color for the area, if not the default for the setting.
     */
    background?: string;
}

/**
 * A standard in-game thing, with size, velocity, position, and other information.
 */
export interface IThing
    extends IGroupHoldrThing,
        IMapsCreatrThing,
        IPixelDrawrThing,
        IQuadsKeeprThing,
        IThingHittrThing {
    /**
     * A summary of this Thing's current visual representation.
     */
    className: string;

    /**
     * How rapidly this is moving horizontally.
     */
    xvel: number;

    /**
     * How rapidly this is moving vertically.
     */
    yvel: number;

    /**
     * The maximum number of quadrants this can be a part of, based on size.
     */
    maxquads: number;

    /**
     * An additional name to add to the Thing's .className.
     */
    name?: string;

    /**
     * Whether this has been placed into the game.
     */
    placed?: boolean;

    /**
     * Whether this should be excluded from the game.
     */
    removed?: boolean;

    /**
     * A storage container for Quadrants this Thing may be in.
     */
    quadrants: IQuadrant<IThing>[];

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before sizing is set.
     */
    onThingMake?(thing: IThing): void;

    /**
     * What to call when this is added to the active pool of Things.
     */
    onThingAdded?(thing: IThing): void;

    /**
     * What to call when this is deleted from its Things group.
     */
    onDelete?(thing: IThing): void;
}
