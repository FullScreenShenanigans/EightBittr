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
/// <reference path="../typings/js-beautify.d.ts" />

import { IGameStartrSettings, IGameStartrStoredSettings, IThing } from "./IGameStartr";
import { Gameplay } from "./Gameplay";
import { Graphics } from "./Graphics";
import { Maps } from "./Maps";
import { Physics } from "./Physics";
import { Scrolling } from "./Scrolling";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * A general-use game engine for 2D 8-bit games.
 */
export abstract class GameStartr extends EightBittr.EightBittr {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    public AreaSpawner: AreaSpawnr.IAreaSpawnr;

    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     */
    public AudioPlayer: AudioPlayr.IAudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    public DeviceLayer: DeviceLayr.IDeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    public FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    public GamesRunner: GamesRunnr.IGamesRunnr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    public GroupHolder: GroupHoldr.IGroupHoldr;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    public InputWriter: InputWritr.IInputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage, and 
     * optionally keep an updated HTML container showing these values.
     */
    public ItemsHolder: ItemsHoldr.IItemsHoldr;

    /**
     * The level editor manager.
     */
    public LevelEditor: LevelEditr.ILevelEditr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     * Options exist for changing or randomizing state and producing random
     * booleans, integers, and real numbers.
     */
    public NumberMaker: NumberMakr.INumberMakr;

    /**
     * Storage container and lazy loader for GameStartr maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved. 
     */
    public MapsCreator: MapsCreatr.IMapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with a bag
     * of assorted variable values.
     */
    public MapScreener: MapScreenr.IMapScreenr;

    /**
     * A computation utility to automate running common equations with access
     * to a set of constant values.
     */
    public MathDecider: MathDecidr.IMathDecidr;

    /**
     * Hookups for extensible triggered mod events.
     */
    public ModAttacher: ModAttachr.IModAttachr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    public ObjectMaker: ObjectMakr.IObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    public PixelDrawer: PixelDrawr.IPixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    public PixelRender: PixelRendr.IPixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    public QuadsKeeper: QuadsKeepr.IQuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    public ScenePlayer: ScenePlayr.IScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     * Functions for checking whether a Thing may collide, checking whether it collides
     * with another Thing, and reacting to a collision are generated and cached for
     * each Thing type, based on the overarching Thing groups.
     */
    public ThingHitter: ThingHittr.IThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    public TimeHandler: TimeHandlr.ITimeHandlr;

    /**
     * A GUI touch layer layer on top of InputWritr that provides an extensible
     * API for adding touch-based control elements into an HTML element.
     */
    public TouchPasser: TouchPassr.ITouchPassr;

    /**
     * A user interface wrapper for configurable HTML displays over GameStartr games.
     */
    public UserWrapper: UserWrappr.IUserWrappr;

    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on position and probability schemas. 
     */
    public WorldSeeder: WorldSeedr.IWorldSeedr;

    /**
     * Graphics functions used by this instance.
     */
    public graphics: Graphics<GameStartr>;

    /**
     * Gameplay functions used by this instance.
     */
    public gameplay: Gameplay<GameStartr>;

    /**
     * Maps functions used by this instance.
     */
    public maps: Maps<GameStartr>;

    /**
     * Physics functions used by this instance.
     */
    public physics: Physics<GameStartr>;

    /**
     * Thing manipulation functions used by this instance.
     */
    public things: Things<GameStartr>;

    /**
     * Scrolling functions used by this instance.
     */
    public scrolling: Scrolling<GameStartr>;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities<GameStartr>;

    /**
     * Settings for individual modules are stored as sub-Objects here.
     */
    public settings: IGameStartrStoredSettings;

    /**
     * HTML container containing all game elements.
     */
    public container: HTMLDivElement;

    /**
     * Canvas upon which the game's screen is constantly drawn.
     */
    public canvas: HTMLCanvasElement;

    /**
     * How much to scale each pixel from PixelDrawr to the real canvas.
     */
    public scale: number;

    /**
     * Initializes a new instance of the GameStartr class.
     * 
     * @param settings   Any additional user-provided settings.
     */
    constructor(settings: IGameStartrSettings = {}) {
        super({
            unitsize: settings.unitsize
        });

        this.resetModules(settings);
    }

    /**
     * Resets the major system modules.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetModules(settings: IGameStartrSettings): void {
        this.resetObjectMaker(settings);
        this.resetPixelRender(settings);
        this.resetTimeHandler(settings);
        this.resetItemsHolder(settings);
        this.resetAudioPlayer(settings);
        this.resetQuadsKeeper(settings);
        this.resetGamesRunner(settings);
        this.resetGroupHolder(settings);
        this.resetThingHitter(settings);
        this.resetMapScreener(settings);
        this.resetPixelDrawer(settings);
        this.resetNumberMaker(settings);
        this.resetMapsCreator(settings);
        this.resetAreaSpawner(settings);
        this.resetInputWriter(settings);
        this.resetDeviceLayer(settings);
        this.resetTouchPasser(settings);
        this.resetLevelEditor(settings);
        this.resetWorldSeeder(settings);
        this.resetScenePlayer(settings);
        this.resetMathDecider(settings);
        this.resetModAttacher(settings);
        this.startModAttacher(settings);
        this.resetContainer(settings);
    }

    /**
     * Sets this.ObjectMaker.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetObjectMaker(settings: IGameStartrSettings): void {
        this.ObjectMaker = new ObjectMakr.ObjectMakr(this.settings.objects);
    }

    /**
     * Sets this.QuadsKeeper.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetQuadsKeeper(settings: IGameStartrSettings): void {
        const quadrantWidth: number = settings.width / (this.settings.quadrants.numCols - 3);
        const quadrantHeight: number = settings.height / (this.settings.quadrants.numRows - 2);

        this.QuadsKeeper = new QuadsKeepr.QuadsKeepr<IThing>(
            this.utilities.proliferate(
                {
                    ObjectMaker: this.ObjectMaker,
                    createCanvas: this.utilities.createCanvas,
                    quadrantWidth: quadrantWidth,
                    quadrantHeight: quadrantHeight,
                    startLeft: -quadrantWidth,
                    startHeight: -quadrantHeight,
                    onAdd: this.maps.onAreaSpawn.bind(this.maps),
                    onRemove: this.maps.onAreaUnspawn.bind(this.maps)
                },
                this.settings.quadrants));
    }

    /**
     * Sets this.PixelRender.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetPixelRender(settings: IGameStartrSettings): void {
        this.PixelRender = new PixelRendr.PixelRendr(
            this.utilities.proliferate(
                {
                    scale: this.scale,
                    QuadsKeeper: this.QuadsKeeper,
                    unitsize: this.unitsize
                },
                this.settings.sprites));
    }

    /**
     * Sets this.PixelDrawer.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetPixelDrawer(settings: IGameStartrSettings): void {
        this.PixelDrawer = new PixelDrawr.PixelDrawr(
            this.utilities.proliferate(
                {
                    PixelRender: this.PixelRender,
                    boundingBox: this.MapScreener,
                    createCanvas: this.utilities.createCanvas,
                    unitsize: this.unitsize,
                    generateObjectKey: this.graphics.generateThingKey
                },
                this.settings.renderer));
    }

    /**
     * Sets this.TimeHandler.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetTimeHandler(settings: IGameStartrSettings): void {
        this.TimeHandler = new TimeHandlr.TimeHandlr(
            this.utilities.proliferate(
                {
                    classAdd: this.graphics.addClass,
                    classRemove: this.graphics.removeClass
                },
                this.settings.events));
    }

    /**
     * Sets this.AudioPlayer.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetAudioPlayer(settings: IGameStartrSettings): void {
        this.AudioPlayer = new AudioPlayr.AudioPlayr(
            this.utilities.proliferate(
                {
                    ItemsHolder: this.ItemsHolder
                },
                this.settings.audio));
    }

    /**
     * Sets this.GamesRunner.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetGamesRunner(settings: IGameStartrSettings): void {
        this.GamesRunner = new GamesRunnr.GamesRunnr(
            this.utilities.proliferate(
                {
                    adjustFramerate: true,
                    scope: this,
                    onClose: (): void => this.gameplay.onClose(),
                    onPlay: (): void => this.gameplay.onPlay(),
                    onPause: (): void => this.gameplay.onPause(),
                    FPSAnalyzer: new FPSAnalyzr.FPSAnalyzr()
                },
                this.settings.runner));
        this.FPSAnalyzer = this.GamesRunner.getFPSAnalyzer();
    }

    /**
     * Sets this.ItemsHolder.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetItemsHolder(settings: IGameStartrSettings): void {
        this.ItemsHolder = new ItemsHoldr.ItemsHoldr(
            this.utilities.proliferate(
                {
                    "callbackArgs": [this]
                },
                this.settings.items));
    }

    /**
     * Sets this.GroupHolder.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetGroupHolder(settings: IGameStartrSettings): void {
        this.GroupHolder = new GroupHoldr.GroupHoldr(this.settings.groups);
    }

    /**
     * Sets this.ThingHitter.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetThingHitter(settings: IGameStartrSettings): void {
        this.ThingHitter = new ThingHittr.ThingHittr(
            this.utilities.proliferate(
                {
                    scope: this
                },
                this.settings.collisions));
    }

    /**
     * Sets this.MapScreener.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetMapScreener(settings: IGameStartrSettings): void {
        this.MapScreener = new MapScreenr.MapScreenr({
            width: settings.width,
            height: settings.height,
            variableArgs: [this],
            variables: this.settings.maps.screenVariables
        });
    }

    /**
     * Sets this.NumberMaker.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetNumberMaker(settings: IGameStartrSettings): void {
        this.NumberMaker = new NumberMakr.NumberMakr();
    }

    /**
     * Sets this.MapCreator.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetMapsCreator(settings: IGameStartrSettings): void {
        this.MapsCreator = new MapsCreatr.MapsCreatr({
            ObjectMaker: this.ObjectMaker,
            groupTypes: this.settings.maps.groupTypes,
            macros: this.settings.maps.macros,
            entrances: this.settings.maps.entrances,
            maps: this.settings.maps.library,
            scope: this
        });
    }

    /**
     * Sets this.AreaSpawner.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetAreaSpawner(settings: IGameStartrSettings): void {
        this.AreaSpawner = new AreaSpawnr.AreaSpawnr({
            "MapsCreator": this.MapsCreator,
            "MapScreener": this.MapScreener,
            "screenAttributes": this.settings.maps.screenAttributes,
            "onSpawn": this.settings.maps.onSpawn,
            "onUnspawn": this.settings.maps.onUnspawn,
            "stretchAdd": this.settings.maps.stretchAdd,
            "afterAdd": this.settings.maps.afterAdd,
            "commandScope": this
        });
    }

    /**
     * Sets this.InputWriter.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetInputWriter(settings: IGameStartrSettings): void {
        this.InputWriter = new InputWritr.InputWritr(
            this.utilities.proliferate(
                {
                    canTrigger: this.gameplay.canInputsTrigger.bind(this.gameplay),
                    eventInformation: this
                },
                this.settings.input.InputWritrArgs));
    }

    /**
     * Sets this.DeviceLayer.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetDeviceLayer(settings: IGameStartrSettings): void {
        this.DeviceLayer = new DeviceLayr.DeviceLayr(
            this.utilities.proliferate(
                {
                    InputWriter: this.InputWriter
                },
                this.settings.devices));
    }

    /**
     * Sets this.InputWriter.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetTouchPasser(settings: IGameStartrSettings): void {
        this.TouchPasser = new TouchPassr.TouchPassr(
            this.utilities.proliferate(
                {
                    InputWriter: this.InputWriter
                },
                this.settings.touch));
    }

    /**
     * Sets this.LevelEditor.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetLevelEditor(settings: IGameStartrSettings): void {
        this.LevelEditor = new LevelEditr.LevelEditr(
            this.utilities.proliferate(
                {
                    beautifier: js_beautify
                },
                this.settings.editor));
    }

    /**
     * Sets this.WorldSeeder.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetWorldSeeder(settings: IGameStartrSettings): void {
        this.WorldSeeder = new WorldSeedr.WorldSeedr(
            this.utilities.proliferate(
                {
                    random: this.NumberMaker.random.bind(this.NumberMaker),
                    onPlacement: this.maps.placeRandomCommands.bind(this.maps)
                },
                this.settings.generator));
    }

    /**
     * Sets this.ScenePlayer.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetScenePlayer(settings: IGameStartrSettings): void {
        this.ScenePlayer = new ScenePlayr.ScenePlayr(
            this.utilities.proliferate(
                {
                    cutsceneArguments: [this]
                },
                this.settings.scenes));
    }

    /**
     * Sets this.MathDecider.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetMathDecider(settings: IGameStartrSettings): void {
        this.MathDecider = new MathDecidr.MathDecidr(this.settings.math);
    }

    /**
     * Sets this.ModAttacher.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetModAttacher(settings: IGameStartrSettings): void {
        this.ModAttacher = new ModAttachr.ModAttachr(
            this.utilities.proliferate(
                {
                    scopeDefault: this,
                    ItemsHoldr: this.ItemsHolder
                },
                this.settings.mods));
    }

    /** 
     * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
     * is fired.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected startModAttacher(settings: IGameStartrSettings): void {
        const mods: { [i: string]: boolean } = settings.mods;

        if (mods) {
            for (const i in mods) {
                if (mods.hasOwnProperty(i) && mods[i]) {
                    this.ModAttacher.enableMod(i);
                }
            }
        }

        this.ModAttacher.fireEvent("onReady", this, this);
    }

    /**
     * Resets the parent HTML container. Width and height are set by customs, 
     * and canvas, ItemsHolder, and TouchPassr container elements are added.
     * 
     * @param settings   Any additional user-provided settings.
     */
    protected resetContainer(settings: IGameStartrSettings): void {
        this.container = this.utilities.createElement("div", {
            className: "EightBitter",
            style: this.utilities.proliferate(
                {
                    position: "relative",
                    width: settings.width + "px",
                    height: settings.height + "px"
                },
                settings.style)
        }) as HTMLDivElement;

        this.canvas = this.utilities.createCanvas(settings.width, settings.height);
        this.PixelDrawer.setCanvas(this.canvas);
        this.container.appendChild(this.canvas);

        this.TouchPasser.setParentContainer(this.container);
    }
}
