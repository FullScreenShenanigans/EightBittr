/// <reference path="../typings/AreaSpawnr.d.ts" />
/// <reference path="../typings/AudioPlayr.d.ts" />
/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/EightBittr.d.ts" />
/// <reference path="../typings/FPSAnalyzr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/GroupHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/MathDecidr.d.ts" />
/// <reference path="../typings/ModAttachr.d.ts" />
/// <reference path="../typings/NumberMakr.d.ts" />
/// <reference path="../typings/QuadsKeepr.d.ts" />
/// <reference path="../typings/ScenePlayr.d.ts" />
/// <reference path="../typings/ThingHittr.d.ts" />
/// <reference path="../typings/TimeHandlr.d.ts" />
/// <reference path="../typings/TouchPassr.d.ts" />
/// <reference path="../typings/UserWrappr.d.ts" />
/// <reference path="../typings/WorldSeedr.d.ts" />

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
    0: TimeHandlr.ITimeCycleSettings;

    /**
     * An optional name to store the cycling event under.
     */
    1?: string;

    /**
     * An optional way to determine how long to wait between classes.
     */
    2?: number | TimeHandlr.INumericCalculator;
}

/**
 * Custom settings to initialize a new instance of the IGameStartr interface.
 */
export interface IGameStartrSettings extends EightBittr.IEightBittrSettings {
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
 * Stored settings to be stored separately and kept within a GameStartr.
 */
export interface IGameStartrStoredSettings {
    /**
     * Settings regarding audio playback, particularly for an IAudioPlayr.
     */
    audio: IAudioPlayrCustoms;

    /**
     * Settings regarding collision detection, particularily for an IThingHittr.
     */
    collisions: IThingHittrCustoms;

    /**
     * Settings regarding device input detection, particularly for an IDeviceLayr.
     */
    devices: IDeviceLayrCustoms;

    /**
     * Settings regarding the level editor, particularly for an ILevelEditr.
     */
    editor: ILevelEditrCustoms;

    /**
     * Settings regarding map generation, particularly for an IWorldSeedr.
     */
    generator: IWorldSeedrCustoms;

    /**
     * Settings regarding in-memory Thing groups, particularly for an IGroupHoldr.
     */
    groups: IGroupHoldrCustoms;

    /**
     * Settings regarding timed events, particularly for an ITimeHandlr.
     */
    events: ITimeHandlrCustoms;

    /**
     * Settings regarding key and mouse inputs, particularly for an IInputWritr.
     */
    input: IInputWritrCustoms;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapScreenr, and an IMapsCreatr.
     */
    maps: IMapCustoms;

    /**
     * Settings regarding math equations, particularly for an IMathDecidr.
     */
    math: IMathDecidrCustoms;

    /**
     * Settings regarding mods, particularly for an IModAttachr.
     */
    mods: IModAttachrCustoms;

    /**
     * Settings regarding in-game object generation, particularly for an IObjectMakr.
     */
    objects: IObjectMakrCustoms;

    /**
     * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
     */
    quadrants: IQuadsKeeprCustoms;

    /**
     * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
     */
    renderer: IPixelDrawrCustoms;

    /**
     * Settings regarding timed upkeep running, particularly for an IGamesRunnr.
     */
    runner: IGamesRunnrCustoms;

    /**
     * Settings regarded preset in-game scenes, particularly for an IScenePlayr.
     */
    scenes: IScenePlayrCustoms;

    /**
     * Settings regarding Thing sprite generation, particularly for an IPixelRendr.
     */
    sprites: IPixelRendrCustoms;

    /**
     * Settings regarding locally stored stats, particularly for an IItemsHoldr.
     */
    items: IItemsHoldrCustoms;

    /**
     * Settings regarding touchscreen inputs, particularly for an ITouchPassr.
     */
    touch: ITouchPassrCustoms;

    /**
     * Settings regarding the visible interface, particularly for an IUserWrappr.
     */
    ui: IUserWrapprCustoms;

    /**
     * Any other settings for a GameStartr generally inherit from IGameStartrSettingsObject.
     */
    [i: string]: IGameStartrSettingsObject;
}

/**
 * Each settings file contains an Object that has its contents passed to the
 * corresponding module, either directly or via a partial copy.
 */
export interface IGameStartrSettingsObject {
    [i: string]: any;
}

/**
 * Settings regarding audio playback, particularly for an IAudioPlayr.
 */
export interface IAudioPlayrCustoms extends IGameStartrSettingsObject {
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
    library: AudioPlayr.ILibrarySettings;
}

/**
 * Settings regarding device input detection, particularly for an IDeviceLayr.
 */
export interface IDeviceLayrCustoms extends IGameStartrSettingsObject { }

/**
 * Settings regarding upkeep Functions, particularly for an IGroupHoldr.
 */
export interface IGamesRunnrCustoms extends IGameStartrSettingsObject {
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
export interface IGroupHoldrCustoms extends IGameStartrSettingsObject, GroupHoldr.IGroupHoldrSettings { }

/**
 * Settings regarding keyboard and mouse inputs, particularly for an IInputWritr.
 */
export interface IInputWritrCustoms extends IGameStartrSettingsObject {
    /**
     * Arguments to be directly passed to the InputWritr.
     */
    InputWritrArgs: InputWritr.IInputWritrSettings;
}

/**
 * Settings regarding persistent and temporary statistics, particularly for an IItemsHoldr.
 */
export interface IItemsHoldrCustoms extends IGameStartrSettingsObject {
    /**
     * A prefix to add before IItemsValue keys.
     */
    prefix: string;

    /**
     * Whether an HTML container should be created to house the IItemValue elements.
     */
    doMakeContainer?: boolean;

    /**
     * Any hardcoded changes to element content, such as "INF" for Infinity.
     */
    displayChanges?: {
        [i: string]: string;
    };

    /**
     * An Array of elements as createElement arguments, outside-to-inside.
     */
    containersArguments: any[][];

    /**
     * Default attributes for all ItemValues.
     */
    defaults: {
        [i: string]: string;
    };

    /**
     * Initial item values (defaults) to store.
     */
    values: ItemsHoldr.IItemValueDefaults;
}

/**
 * Settings regarding the level editor, particularly for an ILevelEditr.
 */
export interface ILevelEditrCustoms extends IGameStartrSettingsObject {
    /**
     * What size grid placed Things should snap to.
     */
    blocksize?: number;

    /**
     * A JSON representation of the default map.
     */
    mapDefault: MapsCreatr.IMapRaw;

    /**
     * The default setting for maps.
     */
    mapSettingDefault: string;

    /**
     * The default entry method for maps.
     */
    mapEntryDefault: string;

    /**
     * Descriptions of Things that may be placed, within their groups.
     */
    prethings: {
        [i: string]: {
            [i: string]: any;
        }
    };

    /**
     * Names of groups that Things may be in.
     */
    thingGroups: string[];
    thingKeys: string[];
    macros: {
        [i: string]: {
            description: string;
            options: any;
        }
    };
}

/**
 * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
 * and MapsCreatr.
 */
export interface IMapCustoms extends IGameStartrSettingsObject {
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
    onSpawn?: (prething: MapsCreatr.IPreThing) => void;

    /**
     * Function for when a PreThing is to be un-spawned.
     * 
     * @param prething   A PreThing leaving the map.
     */
    onUnspawn?: (prething: MapsCreatr.IPreThing) => void;

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
    screenVariables?: MapScreenr.IVariableFunctions;

    /**
     * If stretches exists, a Function to add stretches to an Area.
     */
    stretchAdd?: AreaSpawnr.ICommandAdder;

    /**
     * If afters exists, a Function to add afters to an Area.
     */
    afterAdd?: AreaSpawnr.ICommandAdder;

    /**
     * Macro functions to create PreThings, keyed by String alias.
     */
    macros: {
        [i: string]: MapsCreatr.IMacro;
    };

    /**
     * Allowed entrance Functions, keyed by string alias.
     */
    entrances: {
        [i: string]: MapsCreatr.IEntrance;
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
export interface IMapRaw extends LevelEditr.IMapRaw {
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
export interface IAreaRaw extends LevelEditr.IAreaRaw {
    /**
     * A background color for the area, if not the default for the setting.
     */
    background?: string;
}

/**
 * Settings regarding math equations, particularly for an IMathDecidr.
 */
export interface IMathDecidrCustoms extends IGameStartrSettingsObject, MathDecidr.IMathDecidrSettings { }

/**
 * Settings regarding mods, particularly for an IModAttachr.
 */
export interface IModAttachrCustoms extends IGameStartrSettingsObject {
    /**
     * Whether mod statuses should be stored locally by default.
     */
    storeLocally?: boolean;

    /**
     * Descriptions of available mods.
     */
    mods: ModAttachr.IMod[];
}

/**
 * Settings regarding Thing sprite drawing, particularly for an IPixelRendr.
 */
export interface IPixelDrawrCustoms extends IGameStartrSettingsObject {
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
export interface IPixelRendrCustoms extends IGameStartrSettingsObject {
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
     * The palette of colors to use for sprites. This should be a number[][]
     * of RGBA values.
     */
    paletteDefault: number[][];

    /**
     * A nested library of sprites to process.
     */
    library?: any;

    /**
     * Filters that may be used by sprites in the library.
     */
    filters?: PixelRendr.IFilterContainer;
}

/**
 * Settings regarding in-game object generation, particularly for an IObjectMakr.
 */
export interface IObjectMakrCustoms extends IGameStartrSettingsObject, ObjectMakr.IObjectMakrSettings { }

/**
 * Settings regarding screen quadrants, particularly for an IQuadsKeepr.
 */
export interface IQuadsKeeprCustoms extends IGameStartrSettingsObject {
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
export interface IScenePlayrCustoms extends IGameStartrSettingsObject { }

/**
 * Settings regarding collision detection, particularily for an IThingHittr.
 */
export interface IThingHittrCustoms extends IGameStartrSettingsObject, ThingHittr.IThingHittrSettings { }

/**
 * Settings regarding timed events, particularly for an ITimeHandlr.
 */
export interface ITimeHandlrCustoms extends IGameStartrSettingsObject {
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
export interface ITouchPassrCustoms extends IGameStartrSettingsObject, TouchPassr.ITouchPassrSettings { }

/**
 * Settings regarding the visible interface, particularly for an IUserWrappr.
 */
export interface IUserWrapprCustoms extends IGameStartrSettingsObject { }

/**
 * Settings regarding map generation, particularly for an IWorldSeedr.
 */
export interface IWorldSeedrCustoms extends IGameStartrSettingsObject {
    /**
     * The possibilities that can appear in random maps.
     */
    possibilities: WorldSeedr.IPossibilityContainer;
}

/**
 * A standard in-game thing, with size, velocity, position, and other information.
 */
export interface IThing extends EightBittr.IThing, LevelEditr.IThing, ThingHittr.IThing, TimeHandlr.IThing {
    /**
     * Which group this Thing is a member of.
     */
    groupType: string;

    /**
     * A search query for a PixelDrawr sprite to represent this Thing visually.
     */
    className: string;

    /**
     * An additional name to add to the Thing's .className.
     */
    name?: string;

    /**
     * Whether this is currently alive and well.
     */
    alive?: boolean;

    /**
     * Whether this has been placed into the game.
     */
    placed?: boolean;

    /**
     * Whether this has had its appearance and/or position changed since the last
     * game upkeep.
     */
    changed: boolean;

    /**
     * The maximum number of quadrants this can be a part of, based on size.
     */
    maxquads: number;

    /**
     * A storage container for Quadrants this Thing may be in.
     */
    quadrants: QuadsKeepr.IQuadrant<IThing>[];

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
    movement?: Function;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before sizing is set.
     */
    onThingMake?: Function;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), before the sprite is set.
     */
    onThingAdd?: (thing: IThing) => void;

    /**
     * What to call when this is added to the active pool of Things (during
     * thingProcess), after the sprite is set.
     */
    onThingAdded?: (thing: IThing) => void;

    /**
     * What to call when this is deleted from its Things group.
     */
    onDelete?: Function;
}
