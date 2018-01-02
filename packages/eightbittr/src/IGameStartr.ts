import { ICommandAdder } from "areaspawnr";
import { IAudioPlayrSettings } from "audioplayr";
import { IDeviceLayrSettings } from "devicelayr";
import { IEightBittrSettings } from "eightbittr";
import { IGamesRunnrSettings } from "gamesrunnr";
import { IGroupHoldrSettings } from "groupholdr";
import { IInputWritrSettings } from "inputwritr";
import { IItemsHoldrSettings } from "itemsholdr";
import {
    IAreaRaw as IMapsCreatrIAreaRaw, IEntrance,
    IMacro, IMapRaw as IMapsCreatrIMapRaw,
    IPreThing, IThing as IMapsCreatrThing,
} from "mapscreatr";
import { IVariableFunctions } from "mapscreenr";
import { IMod } from "modattachr";
import { IObjectMakrSettings } from "objectmakr";
import { IThing as IPixelDrawrThing } from "pixeldrawr";
import { IFilterContainer, IPixel } from "pixelrendr";
import { IQuadrant, IThing as IQuadsKeeprThing } from "quadskeepr";
import { IThing as IThingHittrThing, IThingHittrSettings } from "thinghittr";
import { IThing as ITimeHandlrThing } from "timehandlr";
import { IControlSchemasContainer, IRootControlStyles } from "touchpassr";

import { ISpriteCycleSettings } from "./components/Graphics";

/**
 * Reset settings for a GameStartr.
 */
export interface IGameStartrSettings extends IEightBittrSettings {
    /**
     * Mods that should be immediately enabled.
     */
    mods?: string[];

    /**
     * Module settings overrides.
     */
    moduleSettings?: Partial<IModuleSettings>;
}

/**
 * Stored settings to generate modules.
 */
export interface IModuleSettings {
    /**
     * Settings regarding audio playback, particularly for an IAudioPlayr.
     */
    audio?: IAudioModuleSettings;

    /**
     * Settings regarding collision detection, particularily for an IThingHittr.
     */
    collisions?: IThingHittrSettings;

    /**
     * Settings regarding device input detection, particularly for an IDeviceLayr.
     */
    devices?: IDeviceModuleSettings;

    /**
     * Settings regarding in-memory Thing groups, particularly for an IGroupHoldr.
     */
    groups?: IGroupHoldrSettings;

    /**
     * Settings regarding timed events, particularly for an ITimeHandlr.
     */
    events?: IEventsModuleSettings;

    /**
     * Settings regarding keyboard and mouse inputs, particularly for an IInputWritr.
     */
    input?: IInputWritrSettings;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapScreenr, and an IMapsCreatr.
     */
    maps?: IMapsModuleSettings;

    /**
     * Settings regarding mods, particularly for an IModAttachr.
     */
    mods?: IModsModuleSettings;

    /**
     * Settings regarding in-game object generation, particularly for an IObjectMakr.
     */
    objects?: IObjectMakrSettings;

    /**
     * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
     */
    quadrants?: IQuadrantsModuleSettings;

    /**
     * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
     */
    renderer?: IRendererModuleSettings;

    /**
     * Settings regarding timed upkeep running, particularly for an IGamesRunnr.
     */
    runner?: IGamesRunnrSettings;

    /**
     * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
     */
    scenes?: {};

    /**
     * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
     */
    sprites?: ISpritesModuleSettings;

    /**
     * Settings regarding locally stored stats, particularly for an IItemsHoldr.
     */
    items?: IItemsHoldrSettings;

    /**
     * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
     */
    touch?: ITouchModuleSettings;
}

/**
 * Settings for audio, particularily for AudioPlayr.
 */
export type IAudioModuleSettings = IAudioPlayrSettings;

/**
 * Settings for device inputs, particularly for DeviceLayr.
 */
export type IDeviceModuleSettings = Partial<IDeviceLayrSettings>;

/**
 * Settings regarding maps, particularly for AreaSpawnr, MapScreenr, and MapsCreatr.
 */
export interface IMapsModuleSettings {
    /**
     * The names of groups Things may be in.
     */
    groupTypes?: string[];

    /**
     * A default map to spawn in initially.
     */
    mapDefault?: string;

    /**
     * A default map to spawn in initially.
     */
    locationDefault?: string;

    /**
     * Function for when a PreThing is to be spawned.
     *
     * @param prething   A PreThing entering the map.
     */
    onSpawn?(prething: IPreThing): void;

    /**
     * Function for when a PreThing is to be un-spawned.
     *
     * @param prething   A PreThing leaving the map.
     */
    onUnspawn?(prething: IPreThing): void;

    /**
     * Whether Locations must have an entrance Function defined by "entry" (by
     * default, false).
     */
    requireEntrance?: boolean;

    /**
     * Any property names to copy from Areas to MapScreenr.
     */
    screenAttributes?: string[];

    /**
     * A mapping of Functions to generate member variables that should be
     * recomputed on screen change, keyed by variable name.
     */
    screenVariables?: IVariableFunctions;

    /**
     * If stretches exists, a Function to add stretches to an Area.
     */
    stretchAdd?: ICommandAdder;

    /**
     * If afters exists, a Function to add afters to an Area.
     */
    afterAdd?: ICommandAdder;

    /**
     * Macro functions to create PreThings, keyed by String alias.
     */
    macros?: {
        [i: string]: IMacro;
    };

    /**
     * Allowed entrance Functions, keyed by string alias.
     */
    entrances?: {
        [i: string]: IEntrance;
    };

    /**
     * Known map Objects, keyed by name.
     */
    library?: {
        [i: string]: IMapRaw;
    };
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
 * Settings regarding mods, particularly for an IModAttachr.
 */
export interface IModsModuleSettings {
    /**
     * Descriptions of available mods.
     */
    mods?: IMod[];
}

/**
 * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
 */
export interface IRendererModuleSettings {
    /**
     * Names of groups to refill.
     */
    groupNames?: string[];

    /**
     * The maximum size of a SpriteMultiple to pre-render.
     */
    spriteCacheCutoff?: number;
}

/**
 * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
 */
export interface ISpritesModuleSettings {
    /**
     * What sub-class in decode keys should indicate a sprite is to be flipped
     * vertically (by default, "flip-vert").
     */
    flipVert?: string;

    /**
     * What sub-class in decode keys should indicate a sprite is to be flipped
     * horizontally (by default, "flip-vert").
     */
    flipHoriz?: string;

    /**
     * What key in attributions should contain sprite widths (by default,
     * "spriteWidth").
     */
    spriteWidth?: string;

    /**
     * What key in attributions should contain sprite heights (by default,
     * "spriteHeight").
     */
    spriteHeight?: string;

    /**
     * The default palette of colors to use for sprites.
     */
    paletteDefault?: IPixel[];

    /**
     * A nested library of sprites to process.
     */
    library?: any;

    /**
     * Filters that may be used by sprites in the library.
     */
    filters?: IFilterContainer;
}

/**
 * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
 */
export interface IQuadrantsModuleSettings {
    /**
     * How many QuadrantRows to keep at a time.
     */
    numRows?: number;

    /**
     * How many QuadrantCols to keep at a time.
     */
    numCols?: number;

    /**
     * The groups Things may be placed into within Quadrants.
     */
    groupNames?: string[];
}

/**
 * Settings regarding timed events, particularly for an ITimeHandlr.
 */
export interface IEventsModuleSettings {
    /**
     * The default time separation between events in cycles (by default, 1).
     */
    timingDefault?: number;

    /**
     * Whether a copy of settings should be made in setClassCycle.
     */
    copyCycleSettings?: boolean;
}

/**
 * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
 */
export interface ITouchModuleSettings {
    /**
     * Root container for styles to be added to control elements.
     */
    styles?: IRootControlStyles;

    /**
     * Container for generated controls, keyed by their name.
     */
    controls?: IControlSchemasContainer;
}

/**
 * A standard in-game thing, with size, velocity, position, and other information.
 */
export interface IThing extends IMapsCreatrThing, IPixelDrawrThing, IQuadsKeeprThing, IThingHittrThing, ITimeHandlrThing {
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
