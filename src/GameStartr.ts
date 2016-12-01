import { AreaSpawnr } from "areaspawnr/lib/AreaSpawnr";
import { IAreaSpawnr } from "areaspawnr/lib/IAreaSpawnr";
import { AudioPlayr } from "audioplayr/lib/AudioPlayr";
import { IAudioPlayr } from "audioplayr/lib/IAudioPlayr";
import { DeviceLayr } from "devicelayr/lib/DeviceLayr";
import { IDeviceLayr } from "devicelayr/lib/IDeviceLayr";
import { EightBittr } from "eightbittr/lib/EightBittr";
import { FPSAnalyzr } from "fpsanalyzr/lib/FPSAnalyzr";
import { IFPSAnalyzr } from "fpsanalyzr/lib/IFPSAnalyzr";
import { GamesRunnr } from "gamesrunnr/lib/GamesRunnr";
import { IGamesRunnr } from "gamesrunnr/lib/IGamesRunnr";
import { GroupHoldr } from "groupholdr/lib/GroupHoldr";
import { IGroupHoldr } from "groupholdr/lib/IGroupHoldr";
import { IInputWritr } from "inputwritr/lib/IInputWritr";
import { InputWritr } from "inputwritr/lib/InputWritr";
import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";
import { ItemsHoldr } from "itemsholdr/lib/ItemsHoldr";
import { IMapsCreatr } from "mapscreatr/lib/IMapsCreatr";
import { MapsCreatr } from "mapscreatr/lib/MapsCreatr";
import { IMapScreenr } from "mapscreenr/lib/IMapScreenr";
import { MapScreenr } from "mapscreenr/lib/MapScreenr";
import { IMathDecidr } from "mathdecidr/lib/IMathDecidr";
import { MathDecidr } from "mathdecidr/lib/MathDecidr";
import { IModAttachr } from "modattachr/lib/IModAttachr";
import { ModAttachr } from "modattachr/lib/ModAttachr";
import { INumberMakr } from "numbermakr/lib/INumberMakr";
import { NumberMakr } from "numbermakr/lib/NumberMakr";
import { IObjectMakr } from "objectmakr/lib/IObjectMakr";
import { ObjectMakr } from "objectmakr/lib/ObjectMakr";
import { IPixelDrawr } from "pixeldrawr/lib/IPixelDrawr";
import { PixelDrawr } from "pixeldrawr/lib/PixelDrawr";
import { IPixelRendr } from "pixelrendr/lib/IPixelRendr";
import { PixelRendr } from "pixelrendr/lib/PixelRendr";
import { IQuadsKeepr } from "quadskeepr/lib/IQuadsKeepr";
import { QuadsKeepr } from "quadskeepr/lib/QuadsKeepr";
import { IScenePlayr } from "sceneplayr/lib/IScenePlayr";
import { ScenePlayr } from "sceneplayr/lib/ScenePlayr";
import { IThingHittr } from "thinghittr/lib/IThingHittr";
import { ThingHittr } from "thinghittr/lib/ThingHittr";
import { ITimeHandlr } from "timehandlr/lib/ITimeHandlr";
import { TimeHandlr } from "timehandlr/lib/TimeHandlr";
import { ITouchPassr } from "touchpassr/lib/ITouchPassr";
import { TouchPassr } from "touchpassr/lib/TouchPassr";
import { IWorldSeedr } from "worldseedr/lib/IWorldSeedr";
import { WorldSeedr } from "worldseedr/lib/WorldSeedr";

import { Gameplay } from "./Gameplay";
import { Graphics } from "./Graphics";
import { IGameStartrSettings, IModuleSettings, IThing } from "./IGameStartr";
import { Maps } from "./Maps";
import { Physics } from "./Physics";
import { Scrolling } from "./Scrolling";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * A general-use game engine for 2D 8-bit games.
 */
export abstract class GameStartr extends EightBittr {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    public AreaSpawner: IAreaSpawnr;

    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     */
    public AudioPlayer: IAudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    public DeviceLayer: IDeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    public FPSAnalyzer: IFPSAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    public GamesRunner: IGamesRunnr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    public GroupHolder: IGroupHoldr;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    public InputWriter: IInputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage, and 
     * optionally keep an updated HTML container showing these values.
     */
    public ItemsHolder: IItemsHoldr;

    /**
     * Storage container and lazy loader for GameStartr maps that is the back-end
     * counterpart to MapsHandlr. Maps are created with their custom Location and
     * Area members, which are initialized the first time the map is retrieved. 
     */
    public MapsCreator: IMapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with a bag
     * of assorted variable values.
     */
    public MapScreener: IMapScreenr;

    /**
     * A computation utility to automate running common equations with access
     * to a set of constant values.
     */
    public MathDecider: IMathDecidr;

    /**
     * Hookups for extensible triggered mod events.
     */
    public ModAttacher: IModAttachr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     */
    public NumberMaker: INumberMakr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    public ObjectMaker: IObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    public PixelDrawer: IPixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    public PixelRender: IPixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    public QuadsKeeper: IQuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    public ScenePlayer: IScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     */
    public ThingHitter: IThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    public TimeHandler: ITimeHandlr;

    /**
     * A GUI touch layer layer on top of InputWritr that provides an extensible
     * API for adding touch-based control elements into an HTML element.
     */
    public TouchPasser: ITouchPassr;

    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on position and probability schemas. 
     */
    public WorldSeeder: IWorldSeedr;

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
     * Scrolling functions used by this instance.
     */
    public scrolling: Scrolling<GameStartr>;

    /**
     * Thing manipulation functions used by this instance.
     */
    public things: Things<GameStartr>;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities<GameStartr>;

    /**
     * Settings for individual modules.
     */
    public abstract moduleSettings: IModuleSettings;

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
     * @param settings   Any additional settings.
     */
    constructor(settings: IGameStartrSettings) {
        super({
            unitsize: settings.unitsize
        });

        if (!settings.width || !settings.height) {
            throw new Error("Both width and height must be provided or computed in GameStartr's constructor.");
        }

        this.resetModules(settings);
    }

    /**
     * Sets the system modules.
     * 
     * @param settings   Any additional settings.
     */
    protected resetModules(settings: IGameStartrSettings): void {
        this.resetObjectMaker();
        this.resetPixelRender();
        this.resetTimeHandler();
        this.resetItemsHolder();
        this.resetAudioPlayer();
        this.resetQuadsKeeper(settings);
        this.resetGamesRunner();
        this.resetGroupHolder();
        this.resetThingHitter();
        this.resetMapScreener(settings);
        this.resetPixelDrawer();
        this.resetNumberMaker();
        this.resetMapsCreator();
        this.resetAreaSpawner();
        this.resetInputWriter();
        this.resetDeviceLayer();
        this.resetTouchPasser();
        this.resetWorldSeeder();
        this.resetScenePlayer();
        this.resetMathDecider();
        this.resetModAttacher();
        this.startModAttacher(settings);
        this.resetContainer(settings);
    }

    /**
     * Sets this.ObjectMaker.
     * 
     * @param settings   Any additional settings.
     */
    protected resetObjectMaker(): void {
        this.ObjectMaker = new ObjectMakr(
            this.utilities.proliferate(
                {
                    scope: this.things,
                    doPropertiesFull: true
                },
                this.moduleSettings.objects));
    }

    /**
     * Sets this.QuadsKeeper.
     * 
     * @param settings   Any additional settings.
     */
    protected resetQuadsKeeper(settings: IGameStartrSettings): void {
        const quadrantWidth: number = settings.width / (this.moduleSettings.quadrants.numCols - 3);
        const quadrantHeight: number = settings.height / (this.moduleSettings.quadrants.numRows - 2);

        this.QuadsKeeper = new QuadsKeepr<IThing>(
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
                this.moduleSettings.quadrants));
    }

    /**
     * Sets this.PixelRender.
     * 
     * @param settings   Any additional settings.
     */
    protected resetPixelRender(): void {
        this.PixelRender = new PixelRendr(
            this.utilities.proliferate(
                {
                    scale: this.scale,
                    QuadsKeeper: this.QuadsKeeper,
                    unitsize: this.unitsize
                },
                this.moduleSettings.sprites));
    }

    /**
     * Sets this.PixelDrawer.
     * 
     * @param settings   Any additional settings.
     */
    protected resetPixelDrawer(): void {
        this.PixelDrawer = new PixelDrawr(
            this.utilities.proliferate(
                {
                    PixelRender: this.PixelRender,
                    boundingBox: this.MapScreener,
                    createCanvas: this.utilities.createCanvas,
                    unitsize: this.unitsize,
                    generateObjectKey: this.graphics.generateThingKey
                },
                this.moduleSettings.renderer));
    }

    /**
     * Sets this.TimeHandler.
     * 
     * @param settings   Any additional settings.
     */
    protected resetTimeHandler(): void {
        this.TimeHandler = new TimeHandlr(
            this.utilities.proliferate(
                {
                    classAdd: this.graphics.addClass,
                    classRemove: this.graphics.removeClass
                },
                this.moduleSettings.events));
    }

    /**
     * Sets this.AudioPlayer.
     * 
     * @param settings   Any additional settings.
     */
    protected resetAudioPlayer(): void {
        this.AudioPlayer = new AudioPlayr(
            this.utilities.proliferate(
                {
                    ItemsHolder: this.ItemsHolder
                },
                this.moduleSettings.audio));
    }

    /**
     * Sets this.GamesRunner.
     * 
     * @param settings   Any additional settings.
     */
    protected resetGamesRunner(): void {
        this.GamesRunner = new GamesRunnr(
            this.utilities.proliferate(
                {
                    adjustFramerate: true,
                    scope: this,
                    onClose: (): void => this.gameplay.onClose(),
                    onPlay: (): void => this.gameplay.onPlay(),
                    onPause: (): void => this.gameplay.onPause(),
                    FPSAnalyzer: new FPSAnalyzr()
                },
                this.moduleSettings.runner));
        this.FPSAnalyzer = this.GamesRunner.getFPSAnalyzer();
    }

    /**
     * Sets this.ItemsHolder.
     * 
     * @param settings   Any additional settings.
     */
    protected resetItemsHolder(): void {
        this.ItemsHolder = new ItemsHoldr(
            this.utilities.proliferate(
                {
                    "callbackArgs": [this]
                },
                this.moduleSettings.items));
    }

    /**
     * Sets this.GroupHolder.
     * 
     * @param settings   Any additional settings.
     */
    protected resetGroupHolder(): void {
        this.GroupHolder = new GroupHoldr(this.moduleSettings.groups);
    }

    /**
     * Sets this.ThingHitter.
     * 
     * @param settings   Any additional settings.
     */
    protected resetThingHitter(): void {
        this.ThingHitter = new ThingHittr(
            this.utilities.proliferate(
                {
                    scope: this
                },
                this.moduleSettings.collisions));
    }

    /**
     * Sets this.MapScreener.
     * 
     * @param settings   Any additional settings.
     */
    protected resetMapScreener(settings: IGameStartrSettings): void {
        this.MapScreener = new MapScreenr({
            width: settings.width!,
            height: settings.height!,
            scope: this.maps,
            variableArgs: [this],
            variableFunctions: this.moduleSettings.maps.screenVariables
        });
    }

    /**
     * Sets this.NumberMaker.
     * 
     * @param settings   Any additional settings.
     */
    protected resetNumberMaker(): void {
        this.NumberMaker = new NumberMakr();
    }

    /**
     * Sets this.MapCreator.
     * 
     * @param settings   Any additional settings.
     */
    protected resetMapsCreator(): void {
        this.MapsCreator = new MapsCreatr({
            ObjectMaker: this.ObjectMaker,
            groupTypes: this.moduleSettings.maps.groupTypes,
            macros: this.moduleSettings.maps.macros,
            entrances: this.moduleSettings.maps.entrances,
            maps: this.moduleSettings.maps.library,
            scope: this
        });
    }

    /**
     * Sets this.AreaSpawner.
     * 
     * @param settings   Any additional settings.
     */
    protected resetAreaSpawner(): void {
        this.AreaSpawner = new AreaSpawnr({
            MapsCreator: this.MapsCreator,
            MapScreener: this.MapScreener,
            screenAttributes: this.moduleSettings.maps.screenAttributes,
            onSpawn: this.moduleSettings.maps.onSpawn,
            onUnspawn: this.moduleSettings.maps.onUnspawn,
            stretchAdd: this.moduleSettings.maps.stretchAdd,
            afterAdd: this.moduleSettings.maps.afterAdd,
            commandScope: this
        });
    }

    /**
     * Sets this.InputWriter.
     * 
     * @param settings   Any additional settings.
     */
    protected resetInputWriter(): void {
        this.InputWriter = new InputWritr(
            this.utilities.proliferate(
                {
                    canTrigger: (): boolean => this.gameplay.canInputsTrigger(),
                    eventScope: this
                },
                this.moduleSettings.input));
    }

    /**
     * Sets this.DeviceLayer.
     * 
     * @param settings   Any additional settings.
     */
    protected resetDeviceLayer(): void {
        this.DeviceLayer = new DeviceLayr(
            this.utilities.proliferate(
                {
                    InputWriter: this.InputWriter
                },
                this.moduleSettings.devices));
    }

    /**
     * Sets this.InputWriter.
     * 
     * @param settings   Any additional settings.
     */
    protected resetTouchPasser(): void {
        this.TouchPasser = new TouchPassr(
            this.utilities.proliferate(
                {
                    InputWriter: this.InputWriter
                },
                this.moduleSettings.touch));
    }

    /**
     * Sets this.WorldSeeder.
     * 
     * @param settings   Any additional settings.
     */
    protected resetWorldSeeder(): void {
        this.WorldSeeder = new WorldSeedr(
            this.utilities.proliferate(
                {
                    random: this.NumberMaker.random.bind(this.NumberMaker),
                    onPlacement: this.maps.placeRandomCommands.bind(this.maps)
                },
                this.moduleSettings.generator));
    }

    /**
     * Sets this.ScenePlayer.
     * 
     * @param settings   Any additional settings.
     */
    protected resetScenePlayer(): void {
        this.ScenePlayer = new ScenePlayr(this.moduleSettings.scenes);
    }

    /**
     * Sets this.MathDecider.
     * 
     * @param settings   Any additional settings.
     */
    protected resetMathDecider(): void {
        this.MathDecider = new MathDecidr(
            this.utilities.proliferate(
                {
                    constants: {
                        NumberMaker: this.NumberMaker
                    }
                },
                this.moduleSettings.math));
    }

    /**
     * Sets this.ModAttacher.
     * 
     * @param settings   Any additional settings.
     */
    protected resetModAttacher(): void {
        this.ModAttacher = new ModAttachr(
            this.utilities.proliferate(
                {
                    scopeDefault: this,
                    ItemsHoldr: this.ItemsHolder
                },
                this.moduleSettings.mods));
    }

    /** 
     * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
     * is fired.
     * 
     * @param settings   Any additional settings.
     */
    protected startModAttacher(settings: IGameStartrSettings): void {
        const mods: { [i: string]: boolean } = settings.mods as any;

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
     * @param settings   Any additional settings.
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

        this.canvas = this.utilities.createCanvas(settings.width!, settings.height!);
        this.PixelDrawer.setCanvas(this.canvas);
        this.container.appendChild(this.canvas);

        this.TouchPasser.setParentContainer(this.container);
    }
}
