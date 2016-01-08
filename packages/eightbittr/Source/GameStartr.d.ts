declare module GameStartr {
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
         * Any extra reset functions that should be called after the standard ones.
         */
        extraResets?: string[];

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
         * Whether the reset Functions should be timed for performance.
         */
        resetTimed?: boolean;

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
         * Settings regarding help text, particularly for an IUsageHelpr.
         */
        help: IUsageHelprCustoms;

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
         * Settings regarding computations, particularly for an IMathDecidr.
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
        library: {
            [i: string]: {
                [i: string]: string[];
            }
        };
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
        mapDefault: MapsCreatr.IMapsCreatrMapRaw;

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
         * Function for when a PreThing is to be spawned.
         */
        onSpawn: (prething: MapsCreatr.IPreThing) => void;

        /**
         * Function for when a PreThing is to be un-spawned.
         */
        onUnspawn: (prething: MapsCreatr.IPreThing) => void;

        /**
         * If stretches exists, a Function to add stretches to an Area.
         */
        stretchAdd: AreaSpawnr.ICommandAdder;

        /**
         * If afters exists, a Function to add afters to an Area.
         */
        afterAdd: AreaSpawnr.ICommandAdder;

        /**
         * Macro functions to create PreThings, keyed by String alias.
         */
        macros: {
            [i: string]: MapsCreatr.IMapsCreatrMacro;
        };

        /**
         * Allowed entrance Functions, keyed by string alias.
         */
        entrances: {
            [i: string]: MapsCreatr.IMapsCreatrEntrance;
        };

        /**
         * Known map Objects, keyed by name.
         */
        library: {
            [i: string]: IMapsCreatrMapRaw;
        };
    }

    /**
     * A raw JSON-friendly description of a map.
     */
    export interface IMapsCreatrMapRaw extends MapsCreatr.IMapsCreatrMapRaw {
        /**
         * A default location to spawn into.
         */
        locationDefault: number | string;

        /**
         * Descriptions of areas within the map.
         */
        areas: {
            [i: string]: IMapsCreatrAreaRaw;
        };
    }

    /**
     * A raw JSON-friendly description of a map area.
     */
    export interface IMapsCreatrAreaRaw extends MapsCreatr.IMapsCreatrAreaRaw {
        /**
         * A background color for the area, if not the default for the setting.
         */
        background?: string;
    }

    /**
     * Settings regarding computations, particularly for an IMathDecidr.
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
        mods: ModAttachr.IModAttachrMod[];
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
     * Settings regarding help text, particularly for an IUsageHelpr.
     */
    export interface IUsageHelprCustoms extends IGameStartrSettingsObject, UsageHelpr.IUsageHelprSettings { }

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
    export interface IThing extends EightBittr.IThing, LevelEditr.IThing, QuadsKeepr.IThing {
        /**
         * The parent IGameStartr controlling this Thing.
         */
        GameStarter: IGameStartr;

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
        changed?: boolean;

        /**
         * The maximum number of quadrants this can be a part of, based on size.
         */
        maxquads: number;

        /**
         * A storage container for Quadrants this Thing may be in.
         */
        quadrants: QuadsKeepr.IQuadrant[];

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
        onThingAdd?: Function;

        /**
         * What to call when this is added to the active pool of Things (during
         * thingProcess), after the sprite is set.
         */
        onThingAdded?: Function;

        /**
         * What to call when this is deleted from its Things group.
         */
        onDelete?: Function;
    }

    /**
     * A general-use game engine for 2D 8-bit games.
     */
    export interface IGameStartr extends EightBittr.IEightBittr {
        /**
         * Default list of reset Functions to call, in order.
         */
        resets: string[];

        /**
         * Settings for individual modules.
         */
        settings: IGameStartrStoredSettings;

        /**
         * HTML container containing all game elements.
         */
        container: HTMLDivElement;

        /**
         * Canvas upon which the game's screen is constantly drawn.
         */
        canvas: HTMLCanvasElement;

        /**
         * How much to scale each pixel from PixelDrawr to the real canvas.
         */
        scale: number;

        /**
         * Area manipulator and spawner for GameStartr Maps that is the front-end
         * counterpart to MapsCreatr. PreThing listings are loaded from Areas stored in a
         * MapsCreatr and added or removed from user input. Area properties are given to
         * a MapScreenr when a new Area is loaded.
         */
        AreaSpawner: AreaSpawnr.IAreaSpawnr;

        /**
         * An audio library to automate preloading and controlled playback of multiple
         * audio tracks, with support for different browsers' preferred file types.
         */
        AudioPlayer: AudioPlayr.IAudioPlayr;

        /**
         * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
         */
        DeviceLayer: DeviceLayr.IDeviceLayr;

        /**
         * A general utility for obtaining and analyzing framerate measurements. The 
         * most recent measurements are kept up to a certain point (either an infinite
         * number or a set amount). Options for analyzing the data such as getting the
         * mean, median, extremes, etc. are available.
         */
        FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;

        /**
         * A class to continuously series of "game" Functions. Each game is run in a 
         * set order and the group is run as a whole at a particular interval, with a
         * configurable speed.
         */
        GamesRunner: GamesRunnr.IGamesRunnr;

        /**
         * A general storage container for values in keyed Arrays and/or Objects.
         * Manipulation utlities are provided for adding, removing, switching, and
         * applying methods to values.
         */
        GroupHolder: GroupHoldr.IGroupHoldr;

        /**
         * A general utility for automating interactions with user-called events linked
         * with callbacks. Pipe functions are available that take in user input, switch 
         * on the event code, and call the appropriate callback. Further utilities allow 
         * for saving and playback of input histories in JSON format.
         */
        InputWriter: InputWritr.IInputWritr;

        /**
         * A versatile container to store and manipulate values in localStorage, and 
         * optionally keep an updated HTML container showing these values.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr;

        /**
         * The level editor manager.
         */
        LevelEditor: LevelEditr.ILevelEditr;

        /**
         * A typed MersenneTwister, which is a state-based random number generator.
         * Options exist for changing or randomizing state and producing random
         * booleans, integers, and real numbers.
         */
        NumberMaker: NumberMakr.INumberMakr;

        /**
         * Storage container and lazy loader for GameStartr maps that is the back-end
         * counterpart to MapsHandlr. Maps are created with their custom Location and
         * Area members, which are initialized the first time the map is retrieved. 
         */
        MapsCreator: MapsCreatr.IMapsCreatr;

        /**
         * A simple container for Map attributes given by switching to an Area within 
         * that map. A bounding box of the current viewport is kept, along with a bag
         * of assorted variable values.
         */
        MapScreener: MapScreenr.IMapScreenr;

        /**
         * A computation utility to automate running common equations with access
         * to a set of constant values.
         */
        MathDecider: MathDecidr.IMathDecidr;

        /**
         * An addon for for extensible modding functionality. "Mods" register triggers
         * such as "onModEnable" or "onReset" that can be triggered during gameplay.
         */
        ModAttacher: ModAttachr.IModAttachr;

        /**
         * An factory for JavaScript classes that automates the process of 
         * setting constructors' prototypal inheritance. A sketch of class inheritance 
         * and a listing of properties for each class is taken in, and dynamically
         * accessible constructors keyed by String names are made available.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * A front-end to PixelRendr to automate drawing mass amounts of sprites.
         */
        PixelDrawer: PixelDrawr.IPixelDrawr;

        /**
         * A moderately unusual graphics module designed to compress images as
         * compressed text blobs and store the text blobs in a StringFilr. These tasks 
         * are performed and cached quickly enough for use in real-time environments, 
         * such as real-time video games.
         */
        PixelRender: PixelRendr.IPixelRendr;

        /**
         * Quadrant-based collision detection. A grid structure of Quadrants is kept,
         * with Things placed within quadrants they intersect. Operations are available
         * to shift quadrants horizontally or vertically and add/remove rows and columns.
         */
        QuadsKeeper: QuadsKeepr.IQuadsKeepr;

        /**
         * A cutscene runner for jumping between scenes and their routines.
         */
        ScenePlayer: ScenePlayr.IScenePlayr;

        /**
         * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
         * Functions for checking whether a Thing may collide, checking whether it collides
         * with another Thing, and reacting to a collision are generated and cached for
         * each Thing type, based on the overarching Thing groups.
         */
        ThingHitter: ThingHittr.IThingHittr;

        /**
         * A timed events library providing a flexible alternative to setTimeout 
         * and setInterval that respects pauses and resumes. Events are assigned 
         * integer timestamps, and can be set to repeat multiple times.
         */
        TimeHandler: TimeHandlr.ITimeHandlr;

        /**
         * A GUI touch layer layer on top of InputWritr that provides an extensible
         * API for adding touch-based control elements into an HTML element.
         */
        TouchPasser: TouchPassr.ITouchPassr;

        /**
         * A simple interactive text-based assistant to demonstrate common API uses.
         */
        UsageHelper: UsageHelpr.IUsageHelpr;

        /**
         * A user interface manager made to work on top of GameStartr implementations
         * and provide a configurable HTML display of options.
         */
        UserWrapper: UserWrappr.IUserWrappr;

        /**
         * A randomization utility to automate random, recursive generation of
         * possibilities based on position and probability schemas. 
         */
        WorldSeeder: WorldSeedr.IWorldSeedr;

        /**
         * Resets the GameStartr by calling the parent EightBittr.prototype.reset.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        reset(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Resets the EightBittr and records the time by calling the parent
         * EightBittr.prototype.resetTimed.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTimed(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.UsageHelper.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetUsageHelper(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.ObjectMaker.
         *
         * Because many Thing functions require access to other FSM modules, each is
         * given a reference to this container GameStartr via properties.thing.GameStarter.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetObjectMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.QuadsKeeper.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetQuadsKeeper(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.PixelRender.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetPixelRender(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.PixelDrawer.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetPixelDrawer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.TimeHandler.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTimeHandler(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.AudioPlayer.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetAudioPlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.GamesRunner.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetGamesRunner(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.ItemsHolder.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetItemsHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.GroupHolder.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetGroupHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.ThingHitter.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetThingHitter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.MapScreener.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMapScreener(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.NumberMaker.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetNumberMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.MapCreator.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMapsCreator(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.AreaSpawner.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetAreaSpawner(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.InputWriter.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetInputWriter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.DeviceLayer.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetDeviceLayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.InputWriter.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTouchPasser(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.LevelEditor.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetLevelEditor(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.WorldSeeder.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetWorldSeeder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.ScenePlayer.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetScenePlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.MathDecider.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMathDecider(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Sets this.ModAttacher.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
         * is fired.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        startModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Resets the parent HTML container. Width and height are set by customs,
         * and canvas, ItemsHolder, and TouchPassr container elements are added.
         *
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetContainer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;

        /**
         * Scrolls the game window by shifting all Things and checking for quadrant
         * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
         *
         * @param customs   Any optional custom settings.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollWindow(dx: number, dy?: number): void;

        /**
         * Scrolls everything but a single Thing.
         *
         * @param thing   The only Thing that shouldn't move on the screen.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollThing(thing: IThing, dx: number, dy?: number): void;

        /**
         * Spawns all Things within a given area that should be there.
         *
         * @param GameStarter
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaSpawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;

        /**
         * "Unspawns" all Things within a given area that should be gone by marking
         * their PreThings as not in game.
         *
         * @param GameStarter
         * @param direction   The direction spawning comes from.
         * @param top   A top boundary to spawn within.
         * @param right   A right boundary to spawn within.
         * @param bottom   A bottom boundary to spawn within.
         * @param left   A left boundary to spawn within.
         * @remarks This is generally called by a QuadsKeepr during a screen update.
         */
        onAreaUnspawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;

        /**
         * Adds a new Thing to the game at a given position, relative to the top
         * left corner of the screen.
         *
         * @param thingRaw   What type of Thing to add. This may be a String of
         *                   the class title, an Array containing the String
         *                   and an Object of settings, or an actual Thing.
         * @param left   The horizontal point to place the Thing's left at (by default, 0).
         * @param top   The vertical point to place the Thing's top at (by default, 0).
         */
        addThing(thingRaw: string | IThing | any[], left?: number, top?: number): IThing;

        /**
         * Processes a Thing so that it is ready to be placed in gameplay. There are
         * a lot of steps here: width and height must be set with defaults and given
         * to spritewidth and spriteheight, a quadrants Array must be given, the
         * sprite must be set, attributes and onThingMake called upon, and initial
         * class cycles and flipping set.
         *
         * @param thing
         * @param title   What type Thing this is (the name of the class).
         * @param settings   Additional settings to be given to the Thing.
         * @param defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;

        /**
         * Processes additional Thing attributes. For each attribute the Thing's
         * class says it may have, if it has it, the attribute's key is appeneded to
         * the Thing's name and the attribute value proliferated onto the Thing.
         *
         * @param thing
         * @param attributes   A lookup of attributes that may be added to the Thing's class.
         */
        thingProcessAttributes(thing: IThing, attributes: { [i: string]: string; }): void;

        /**
         * Runs through commands generated by a WorldSeedr and evaluates all of
         * to create PreThings via MapsCreator.analyzePreSwitch.
         *
         * @param GameStarter
         * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
         */
        mapPlaceRandomCommands(GameStarter: IGameStartr, generatedCommands: WorldSeedr.ICommand[]): void;

        /**
         * Triggered Function for when the game is unpaused. Music resumes, and
         * the mod event is fired.
         *
         * @param GameStartr
         */
        onGamePlay(GameStarter: IGameStartr): void;

        /**
         * Triggered Function for when the game is paused. Music stops, and the
         * mod event is fired.
         *
         * @param GameStartr
         */
        onGamePause(GameStarter: IGameStartr): void;

        /**
         * Checks whether inputs can be fired, which by default is always true.
         *
         * @param GameStartr
         * @returns Whether inputs can be fired, which is always true.
         */
        canInputsTrigger(GameStarter: IGameStartr): boolean;

        /**
         * Generic Function to start the game. Nothing actually happens here.
         */
        gameStart(): void;

        /**
         * Generically kills a Thing by setting its alive to false, hidden to true,
         * and clearing its movement.
         *
         * @param thing
         */
        killNormal(thing: IThing): void;

        /**
         * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
         * to redraw the Thing and its quadrant.
         *
         * @param thing
         */
        markChanged(thing: IThing): void;

        /**
         * Shifts a Thing vertically using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param thing
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void;

        /**
         * Shifts a Thing horizontally using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         *
         * @param thing
         * @param dx   How far to shift the Thing horizontally.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void;

        /**
         * Sets a Thing's top using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param thing
         * @param top   A new top border for the Thing.
         */
        setTop(thing: IThing, top: number): void;

        /**
         * Sets a Thing's right using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         *
         * @param thing
         * @param right   A new right border for the Thing.
         */
        setRight(thing: IThing, right: number): void;

        /**
         * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param thing
         * @param bottom   A new bottom border for the Thing.
         */
        setBottom(thing: IThing, bottom: number): void;

        /**
         * Sets a Thing's left using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         *
         * @param thing
         * @param left   A new left border for the Thing.
         */
        setLeft(thing: IThing, left: number): void;

        /**
         * Shifts a thing both horizontally and vertically. If the Thing marks
         * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
         * proportion of movement is respected (.5 = half, etc.).
         *
         * @param thing
         * @param dx   How far to shift the Thing horizontally.
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void;

        /**
         * Calls shiftBoth on all members of an Array.
         *
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         * @param notChanged   Whether to skip marking the Things as changed (by
         *                     default, false).
         */
        shiftThings(things: IThing[], dx: number, dy: number, notChanged?: boolean): void;

        /**
         * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
         *
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         */
        shiftAll(dx: number, dy: number): void;

        /**
         * Sets the width and unitwidth of a Thing, and optionally updates the
         * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param thing
         * @param width   A new width for the Thing.
         * @param updateSprite   Whether to update the Thing's spritewidth and
         *                       spritewidthpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void;

        /**
         * Sets the height and unitheight of a Thing, and optionally updates the
         * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
         * The thing is marked as having changed appearance.
         *
         * @param thing
         * @param height   A new height for the Thing.
         * @param updateSprite   Whether to update the Thing's spriteheight and
         *                       spriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void;

        /**
         * Utility to call both setWidth and setHeight on a Thing.
         *
         * @param thing
         * @param width   A new width for the Thing.
         * @param height   A new height for the Thing.
         * @param updateSprite   Whether to update the Thing's spritewidth,
         *                       spriteheight, spritewidthpixels, and
         *                       spritspriteheightpixels (by default, false).
         * @param updateSize   Whether to call updateSize on the Thing (by
         *                     default, false).
         */
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void;

        /**
         * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
         * shiftHoriz and shiftVert.
         *
         * @param thing
         */
        updatePosition(thing: IThing): void;

        /**
         * Completely updates the size measurements of a Thing. That means the
         * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
         * spriteheightpixels attributes. The Thing's sprite is then updated by the
         * PixelDrawer, and its appearance is marked as changed.
         *
         * @param thing
         */
        updateSize(thing: IThing): void;

        /**
         * Reduces a Thing's width by pushing back its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param thing
         * @param dx   How much to reduce the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void;

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param thing
         * @param dy   How much to reduce the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void;

        /**
         * Increases a Thing's width by pushing forward its right and decreasing its
         * width. It is marked as changed in appearance.
         *
         * @param thing
         * @param dx   How much to increase the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void;

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its
         * height. It is marked as changed in appearance.
         *
         * @param thing
         * @param dy   How much to increase the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void;

        /**
         * Generates a key for a Thing based off the Thing's basic attributes. 
         * This key should be used for PixelRender.get calls, to cache the Thing's
         * sprite.
         * 
         * @param thing
         * @returns A key that to identify the Thing's sprite.
         */
        generateThingKey(thing: IThing): string;

        /**
         * Sets the class of a Thing, sets the new sprite for it, and marks it as
         * having changed appearance. The class is stored in the Thing's internal
         * .className attribute.
         *
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClass(thing: IThing, className: string): void;

        /**
         * A version of setClass to be used before the Thing's sprite attributes
         * have been set. This just sets the internal .className.
         *
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClassInitial(thing: IThing, className: string): void;

        /**
         * Adds a string to a Thing's class after a " ", updates the Thing's
         * sprite, and marks it as having changed appearance.
         *
         * @param thing
         * @param className   A class to add to the Thing.
         */
        addClass(thing: IThing, className: string): void;

        /**
         * Adds multiple strings to a Thing's class after a " ", updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param thing
         * @param classes   Any number of classes to add to the Thing.
         */
        addClasses(thing: IThing, ...classes: (string | string[])[]): void;

        /**
         * Removes a string from a Thing's class, updates the Thing's sprite, and
         * marks it as having changed appearance.
         *
         * @param thing
         * @param className   A class to remove from the Thing.
         */
        removeClass(thing: IThing, className: string): void;

        /**
         * Removes multiple strings from a Thing's class, updates the Thing's
         * sprite, and marks it as having changed appearance. Strings may be given
         * as Arrays or Strings; Strings will be split on " ". Any number of
         * additional arguments may be given.
         *
         * @param thing
         * @param classes   Any number of classes to remove from the Thing.
         */
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void;

        /**
         * @param thing
         * @param className   A class to check for in the Thing.
         * @returns  Whether the Thing's class contains the class.
         */
        hasClass(thing: IThing, className: string): boolean;

        /**
         * Removes the first class from a Thing and adds the second. All typical
         * sprite updates are called.
         *
         * @param thing
         * @param classNameOut   A class to remove from the Thing.
         * @param classNameIn   A class to add to the thing.
         */
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void;

        /**
         * Marks a Thing as being flipped horizontally by setting its .flipHoriz
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        flipHoriz(thing: IThing): void;

        /**
         * Marks a Thing as being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        flipVert(thing: IThing): void;

        /**
         * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
         * attribute to false and giving it a "flipped" class.
         *
         * @param thing
         */
        unflipHoriz(thing: IThing): void;

        /**
         * Marks a Thing as not being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         *
         * @param thing
         */
        unflipVert(thing: IThing): void;

        /**
         * Sets the opacity of the Thing and marks its appearance as changed.
         *
         * @param thing
         * @param opacity   A number in [0,1].
         */
        setOpacity(thing: IThing, opacity: number): void;

        /**
         * Ensures the current object is a GameStartr by throwing an error if it
         * is not. This should be used for Functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         *
         * @param current
         */
        ensureCorrectCaller(current: any): IGameStartr;

        /**
         * Removes a Thing from an Array using Array.splice. If the thing has an
         * onDelete, that is called.
         *
         * @param thing
         * @param array   The grou pcontaining the thing.
         * @param location   The index of the Thing in the Array, for speed's
         *                   sake (by default, it is found using Array.indexOf).
         */
        arrayDeleteThing(thing: IThing, array: IThing[], location?: number): void;

        /**
         * Takes a snapshot of the current screen canvas by simulating a click event
         * on a dummy link.
         *
         * @param name   A name for the image to be saved as.
         * @param format   A format for the image to be saved as (by default, png).
         * @remarks For security concerns, browsers won't allow this unless it's
         *          called within a callback of a genuine user-triggered event.
         */
        takeScreenshot(name: string, format?: string): void;

        /**
         * Adds a set of CSS styles to the page.
         *
         * @param styles   CSS styles represented as JSON.
         */
        addPageStyles(styles: IPageStyles): void;
    }
}
