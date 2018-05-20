import { IAreaSpawnrSettings } from "areaspawnr";
import { IAudioPlayrSettings } from "audioplayr";
import { IDeviceLayrSettings } from "devicelayr";
import { IFpsAnalyzrSettings } from "fpsanalyzr";
import { IGamesRunnrSettings } from "gamesrunnr";
import { IGroupHoldrSettings, IThing as IGroupHoldrThing } from "groupholdr";
import { IInputWritrSettings } from "inputwritr";
import { IItemsHoldrSettings } from "itemsholdr";
import {
    IAreaRaw as IMapsCreatrIAreaRaw,
    IMapRaw as IMapsCreatrIMapRaw, IMapsCreatrSettings,
    IThing as IMapsCreatrThing,
} from "mapscreatr";
import { IMapScreenrSettings } from "mapscreenr";
import { IModAttachrSettings } from "modattachr";
import { INumberMakrSettings } from "numbermakr";
import { IObjectMakrSettings } from "objectmakr";
import { IPixelDrawrSettings, IThing as IPixelDrawrThing } from "pixeldrawr";
import { IPixelRendrSettings } from "pixelrendr";
import { IQuadrant, IQuadsKeeprSettings, IThing as IQuadsKeeprThing } from "quadskeepr";
import { IScenePlayrSettings } from "sceneplayr";
import { IThing as IThingHittrThing, IThingHittrSettings } from "thinghittr";
import { IThing as ITimeHandlrThing, ITimeHandlrSettings } from "timehandlr";
import { ITouchPassrSettings } from "touchpassr";

import { ISpriteCycleSettings } from "./components/Graphics";

/**
 * SEttings to initialize a new EightBittr.
 */
export interface IEightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components?: Partial<IComponentSettings>;

    /**
     * How tall the game area should be.
     */
    height: number;

    /**
     * How wide the game area should be.
     */
    width: number;
}

/**
 * Filled-out settings to initialize a new EightBittr.
 */
export interface IEightBittrSettings extends IEightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components: Partial<IComponentSettings>;
}

/**
 * Settings to generate components.
 */
export interface IComponentSettings {
    /**
     * Settings for map area spawning, particularly for an AreaSpawnr.
     */
    areas?: Partial<IAreaSpawnrSettings>;

    /**
     * Settings for audio playback, particularily for an AudioPlayr.
     */
    audio?: Partial<IAudioPlayrSettings>;

    /**
     * Settings for collision detection, particularily for a ThingHittr.
     */
    collisions?: IThingHittrSettings;

    /**
     * Settings for device input detection, particularly for a DeviceLayr.
     */
    devices?: Partial<IDeviceLayrSettings>;

    /**
     * Settings for FPS analysis, particularly for an FpsAnalyzr.
     */
    frames?: Partial<IFpsAnalyzrSettings>;

    /**
     * Settings for in-memory Thing groups, particularly for a GroupHoldr.
     */
    groups?: Partial<IGroupHoldrSettings<any>>;

    /**
     * Settings for timed events, particularly for a TimeHandlr.
     */
    events?: Partial<ITimeHandlrSettings>;

    /**
     * Settings for keyboard and mouse inputs, particularly for a InputWritr.
     */
    input?: IInputWritrSettings;

    /**
     * Settings for locally stored items, particularly for a ItemsHoldr.
     */
    items?: Partial<IItemsHoldrSettings>;

    /**
     * Settings for random number generation, particularly for a NumberMakr.
     */
    numbers?: Partial<INumberMakrSettings>;

    /**
     * Settings for stored maps, particularly for a MapsCreatr.
     */
    maps?: Partial<IMapsCreatrSettings>;

    /**
     * Settings for mods, particularly for a ModAttachr.
     */
    mods?: Partial<IModAttachrSettings>;

    /**
     * Settings for in-game object generation, particularly for a ObjectMakr.
     */
    objects?: Partial<IObjectMakrSettings>;

    /**
     * Settings for screen quadrants, particularly for a QuadsKeepr.
     */
    quadrants?: Partial<IQuadsKeeprSettings<IThing>>;

    /**
     * Settings for Thing sprite drawing, particularly for a PixelDrawr.
     */
    drawing?: Partial<IPixelDrawrSettings>;

    /**
     * Settings for timed upkeep running, particularly for a GamesRunnr.
     */
    runner?: Partial<IGamesRunnrSettings>;

    /**
     * Settings regarded preset in-game scenes, particularly for a ScenePlayr.
     */
    scenes?: Partial<IScenePlayrSettings>;

    /**
     * Settings for screen attributes, particularly for a MapScreenr.
     */
    screen?: Partial<IMapScreenrSettings>;

    /**
     * Settings for Thing sprite generation, particularly for a PixelRendr.
     */
    sprites?: Partial<IPixelRendrSettings>;

    /**
     * Settings for touchscreen inputs, particularly for a TouchPassr.
     */
    touch?: Partial<ITouchPassrSettings>;
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
export interface IThing extends IMapsCreatrThing, IGroupHoldrThing, IPixelDrawrThing, IQuadsKeeprThing, IThingHittrThing, ITimeHandlrThing {
    /**
     * The top border of this Thing's bounding box.
     */
    top: number;

    /**
     * The top border of this Thing's bounding box.
     */
    right: number;

    /**
     * The top border of this Thing's bounding box.
     */
    bottom: number;

    /**
     * The top border of this Thing's bounding box.
     */
    left: number;

    /**
     * How wide this Thing is.
     */
    width: number;

    /**
     * How tall this Thing is.
     */
    height: number;

    /**
     * How rapidly this is moving horizontally.
     */
    xvel: number;

    /**
     * How rapidly this is moving vertically.
     */
    yvel: number;

    /**
     * Whether this is currently alive and well.
     */
    alive: boolean;

    /**
     * A search query for a PixelDrawr sprite to represent this Thing visually.
     */
    className: string;

    /**
     * Which group this Thing is a member of.
     */
    groupType: string;

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
     * A storage container for Quadrants this Thing may be in.
     */
    quadrants: IQuadrant<IThing>[];

    /**
     * Any additional attributes triggered by thingProcessAttributes.
     */
    attributes?: any;

    /**
     * A sprite cycle to start upon spawning.
     */
    spriteCycle?: ISpriteCycleSettings;

    /**
     * A synched sprite cycle to start upon spawning.
     */
    spriteCycleSynched?: ISpriteCycleSettings;

    /**
     * Scratch horizontal velocity for pausing movement.
     */
    xvelOld?: number;

    /**
     * Scratch vertical velocity for pausing movement.
     */
    yvelOld?: number;

    /**
     * A horizontal multiplier for scrolling, if not 1 (no change).
     */
    parallaxHoriz?: number;

    /**
     * A vertical multiplier for scrolling, if not 1 (no change).
     */
    parallaxVert?: number;

    /**
     * Whether this is currently flipped horizontally.
     */
    flipHoriz?: boolean;

    /**
     * Whether this is currently flipped vertically.
     */
    flipVert?: boolean;

    /**
     * Whether this is allowed to scroll horizontally.
     */
    noshiftx?: boolean;

    /**
     * Whether this is allowed to scroll vertically.
     */
    noshifty?: boolean;

    /**
     * A Function to move during an upkeep event.
     */
    movement?(thing: IThing): void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before sizing is set.
     */
    onThingMake?(thing: IThing): void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before the sprite is set.
     */
    onThingAdd?(thing: IThing): void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), after the sprite is set.
     */
    onThingAdded?(thing: IThing): void;

    /**
     * What to call when this is deleted from its Things group.
     */
    onDelete?(thing: IThing): void;
}
