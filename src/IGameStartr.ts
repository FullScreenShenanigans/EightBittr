import { ICommandAdder } from "areaspawnr/lib/IAreaSpawnr";
import { ILibrarySettings } from "audioplayr/lib/IAudioPlayr";
import { Component } from "eightbittr/lib/Component";
import { IEightBittrSettings } from "eightbittr/lib/IEightBittr";
import { IThing as IEightBittrThing } from "eightbittr/lib/IThing";
import { IGroupHoldrSettings } from "groupholdr/lib/IGroupHoldr";
import { IInputWritrSettings } from "inputwritr/lib/IInputWritr";
import { IItemsHoldrSettings } from "itemsholdr/lib/IItemsHoldr";
import {
    IAreaRaw as IMapsCreatrIAreaRaw, IEntrance, IMacro, IMapRaw as IMapsCreatrIMapRaw
} from "mapscreatr/lib/IMapsCreatr";
import { IPreThing } from "mapscreatr/lib/IPreThing";
import { IThing as IMapsCreatrThing } from "mapscreatr/lib/IThing";
import { IVariableFunctions } from "mapscreenr/lib/IMapScreenr";
import { IConstants, IEquations } from "mathdecidr/lib/IMathDecidr";
import { IMod } from "modattachr/lib/IModAttachr";
import { IObjectMakrSettings } from "objectmakr/lib/IObjectMakr";
import { IThing as IPixelDrawrThing } from "pixeldrawr/lib/IPixelDrawr";
import { IFilterContainer, IPixel } from "pixelrendr/lib/IPixelRendr";
import { IQuadrant } from "quadskeepr/lib/IQuadsKeepr";
import { IThingHittrSettings } from "thinghittr/lib/IThingHittr";
import { IThing as IThingHittrThing } from "thinghittr/lib/IThingHittr";
import { INumericCalculator, IThing as ITimeHandlrThing, ITimeCycleSettings } from "timehandlr/lib/ITimeHandlr";
import { IControlSchemasContainer, IRootControlStyles } from "touchpassr/lib/ITouchPassr";
import { IPossibilityContainer } from "worldseedr/lib/IWorldSeedr";

import { GameStartr } from "./GameStartr";

/**
 * Extra CSS styles that may be added to a page.
 */
export interface IPageStyles {
    [i: string]: {
        [j: string]: string | number;
    };
}

/**
 * Settings to be passed in order to ITimeHandlr::addClassCycle.
 */
export interface ISpriteCycleSettings {
    /**
     * Classes to create a class cycling event.
     */
    0: ITimeCycleSettings;

    /**
     * An optional name to store the cycling event under.
     */
    1?: string;

    /**
     * An optional way to determine how long to wait between classes.
     */
    2?: number | INumericCalculator;
}

/**
 * Custom settings to initialize a new instance of the IGameStartr interface.
 */
export interface IGameStartrSettings extends IEightBittrSettings {
    /**
     * A nickname for the size settings.
     */
    size?: string;

    /**
     * Whether the game should be expanded to full-screen size.
     */
    full?: boolean;

    /**
     * How wide the screen should be. Infinity is an option.
     */
    width?: number;

    /**
     * How tall the screen should be. Infinity is an option.
     */
    height?: number;

    /**
     * Options for mods that, if true, should be immediately enabled.
     */
    mods?: {
        [i: string]: boolean;
    };

    /**
     * Any additional styles that should be added to the page immediately.
     */
    style?: IPageStyles;
}

/**
 * Stored settings to generate modules.
 */
export interface IModuleSettings {
    /**
     * Settings regarding audio playback, particularly for an IAudioPlayr.
     */
    audio: IAudioModuleSettings;

    /**
     * Settings regarding collision detection, particularily for an IThingHittr.
     */
    collisions: ICollisionsModuleSettings;

    /**
     * Settings regarding device input detection, particularly for an IDeviceLayr.
     */
    devices: IDevicesModuleSettings;

    /**
     * Settings regarding map generation, particularly for an IWorldSeedr.
     */
    generator: IGeneratorModuleSettings;

    /**
     * Settings regarding in-memory Thing groups, particularly for an IGroupHoldr.
     */
    groups: IGroupsModuleSettings;

    /**
     * Settings regarding timed events, particularly for an ITimeHandlr.
     */
    events: IEventsModuleSettings;

    /**
     * Settings regarding key and mouse inputs, particularly for an IInputWritr.
     */
    input: IInputModuleSettings;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapScreenr, and an IMapsCreatr.
     */
    maps: IMapsModuleSettings;

    /**
     * Settings regarding math equations, particularly for an IMathDecidr.
     */
    math: IMathModuleSettings;

    /**
     * Settings regarding mods, particularly for an IModAttachr.
     */
    mods: IModsModuleSettings;

    /**
     * Settings regarding in-game object generation, particularly for an IObjectMakr.
     */
    objects: IObjectsModuleSettings;

    /**
     * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
     */
    quadrants: IQuadrantsModuleSettings;

    /**
     * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
     */
    renderer: IRendererModuleSettings;

    /**
     * Settings regarding timed upkeep running, particularly for an IGamesRunnr.
     */
    runner: IRunnerModuleSettings;

    /**
     * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
     */
    scenes: IScenesModuleSettings;

    /**
     * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
     */
    sprites: ISpritesModuleSettings;

    /**
     * Settings regarding locally stored stats, particularly for an IItemsHoldr.
     */
    items: IItemsModuleSettings;

    /**
     * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
     */
    touch: ITouchModuleSettings;

    /**
     * Any other settings for a GameStartr generally inherit from IGameStartrSettingsObject.
     */
    [i: string]: IModuleSettingsObject;
}

/**
 * Each settings file contains an Object that has its contents passed to the
 * corresponding module, either directly or via a partial copy.
 */
export interface IModuleSettingsObject {
    [i: string]: any | undefined;
}

/**
 * Settings regarding audio playback, particularly for an IAudioPlayr.
 */
export interface IAudioModuleSettings extends IModuleSettingsObject {
    /**
     * The directory in which all sub-directories of audio files are stored.
     */
    directory: string;

    /**
     * The allowed filetypes for each audio file. Each of these should have a
     * directory of their name under the main directory, which should contain
     * each file of the filetype.
     */
    fileTypes: string[];

    /**
     * The names of the audio files to be preloaded for on-demand playback.
     */
    library: ILibrarySettings;
}

/**
 * Settings regarding device input detection, particularly for an IDeviceLayr.
 */
export interface IDevicesModuleSettings extends IModuleSettingsObject { }

/**
 * Settings regarding upkeep Functions, particularly for an IGroupHoldr.
 */
export interface IRunnerModuleSettings extends IModuleSettingsObject {
    /**
     * How often updates should be called.
     */
    interval?: number;

    /**
     * Functions to be run on every upkeep.
     */
    games: Function[];
}

/**
 * Settings regarding groups holding in-game Things, particularly for an IGroupHoldr.
 */
export interface IGroupsModuleSettings extends IModuleSettingsObject, IGroupHoldrSettings { }

/**
 * Settings regarding keyboard and mouse inputs, particularly for an IInputWritr.
 */
export interface IInputModuleSettings extends IModuleSettingsObject, IInputWritrSettings { }

/**
 * Settings regarding persistent and temporary statistics, particularly for an IItemsHoldr.
 */
export interface IItemsModuleSettings extends IModuleSettingsObject, IItemsHoldrSettings { }

/**
 * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
 * and MapsCreatr.
 */
export interface IMapsModuleSettings extends IModuleSettingsObject {
    /**
     * The names of groups Things may be in.
     */
    groupTypes: string[];

    /**
     * A default map to spawn in initially.
     */
    mapDefault: string;

    /**
     * A default map to spawn in initially.
     */
    locationDefault: string;

    /**
     * Function for when a PreThing is to be spawned.
     * 
     * @param prething   A PreThing entering the map.
     */
    onSpawn?: (prething: IPreThing) => void;

    /**
     * Function for when a PreThing is to be un-spawned.
     * 
     * @param prething   A PreThing leaving the map.
     */
    onUnspawn?: (prething: IPreThing) => void;

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
    macros: {
        [i: string]: IMacro;
    };

    /**
     * Allowed entrance Functions, keyed by string alias.
     */
    entrances: {
        [i: string]: IEntrance;
    };

    /**
     * Known map Objects, keyed by name.
     */
    library: {
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
 * Settings regarding math equations, particularly for an IMathDecidr.
 */
export interface IMathModuleSettings extends IModuleSettingsObject {
    /**
     * Constants the MathDecidr may use in equations.
     */
    constants?: IConstants;

    /**
     * Calculation Functions, keyed by name.
     */
    equations?: IEquations;
}

/**
 * Settings regarding mods, particularly for an IModAttachr.
 */
export interface IModsModuleSettings extends IModuleSettingsObject {
    /**
     * Whether mod statuses should be stored locally by default.
     */
    storeLocally?: boolean;

    /**
     * Descriptions of available mods.
     */
    mods: IMod[];
}

/**
 * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
 */
export interface IRendererModuleSettings extends IModuleSettingsObject {
    /**
     * Names of groups to refill.
     */
    groupNames: string[];

    /**
     * The maximum size of a SpriteMultiple to pre-render.
     */
    spriteCacheCutoff?: number;
}

/**
 * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
 */
export interface ISpritesModuleSettings extends IModuleSettingsObject {
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
    paletteDefault: IPixel[];

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
 * Settings regarding in-game object generation, particularly for an IObjectMakr.
 */
export interface IObjectsModuleSettings extends IModuleSettingsObject, IObjectMakrSettings { }

/**
 * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
 */
export interface IQuadrantsModuleSettings extends IModuleSettingsObject {
    /**
     * How many QuadrantRows to keep at a time.
     */
    numRows: number;

    /**
     * How many QuadrantCols to keep at a time.
     */
    numCols: number;

    /**
     * The groups Things may be placed into within Quadrants.
     */
    groupNames: string[];
}

/**
 * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
 */
export interface IScenesModuleSettings extends IModuleSettingsObject { }

/**
 * Settings regarding collision detection, particularily for an IThingHittr.
 */
export interface ICollisionsModuleSettings extends IModuleSettingsObject, IThingHittrSettings { }

/**
 * Settings regarding timed events, particularly for an ITimeHandlr.
 */
export interface IEventsModuleSettings extends IModuleSettingsObject {
    /**
     * The default time separation between events in cycles (by default, 1).
     */
    timingDefault?: number;

    /**
     * Attribute name to store listings of cycles in objects (by default, 
     * "cycles").
     */
    keyCycles?: string;

    /**
     * Atribute name to store class name in objects (by default, "className").
     */
    keyClassName?: string;

    /**
     * Key to check for a callback before a cycle starts in objects (by default,
     * "onClassCycleStart").
     */
    keyOnClassCycleStart?: string;

    /**
     * Key to check for a callback after a cycle starts in objects (by default,
     * "doClassCycleStart").
     */
    keyDoClassCycleStart?: string;

    /**
     * Optional attribute to check for whether a cycle may be given to an 
     * object (if not given, ignored).
     */
    keyCycleCheckValidity?: string;

    /**
     * Whether a copy of settings should be made in setClassCycle.
     */
    copyCycleSettings?: boolean;
}

/**
 * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
 */
export interface ITouchModuleSettings extends IModuleSettingsObject {
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
 * Settings regarding map generation, particularly for an IWorldSeedr.
 */
export interface IGeneratorModuleSettings extends IModuleSettingsObject {
    /**
     * The possibilities that can appear in random maps.
     */
    possibilities: IPossibilityContainer;
}

/**
 * A standard in-game thing, with size, velocity, position, and other information.
 */
export interface IThing extends IEightBittrThing, IMapsCreatrThing, IPixelDrawrThing, IThingHittrThing, ITimeHandlrThing {
    /**
     * Whether this is currently alive and well.
     */
    alive: boolean;

    /**
     * A search query for a PixelDrawr sprite to represent this Thing visually.
     */
    className: string;

    /**
     * Whether this has had its appearance and/or position changed since the last
     * game upkeep.
     */
    changed: boolean;

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
    movement?: (this: Component<GameStartr>) => void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before sizing is set.
     */
    onThingMake?: (this: Component<GameStartr>) => void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before the sprite is set.
     */
    onThingAdd?: (this: Component<GameStartr>, thing: IThing) => void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), after the sprite is set.
     */
    onThingAdded?: (this: Component<GameStartr>, thing: IThing) => void;

    /**
     * What to call when this is deleted from its Things group.
     */
    onDelete?: Function;
}
