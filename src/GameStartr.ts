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
    public areaSpawner: IAreaSpawnr;

    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     */
    public audioPlayer: IAudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    public deviceLayer: IDeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    public fpsAnalyzer: IFPSAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    public gamesRunner: IGamesRunnr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    public groupHolder: IGroupHoldr;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    public inputWriter: IInputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage, and 
     * optionally keep an updated HTML container showing these values.
     */
    public itemsHolder: IItemsHoldr;

    /**
     * Storage container and lazy loader for GameStartr maps that is the back-end
     * counterpart to MapsHandlr.
     */
    public mapsCreator: IMapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area.
     */
    public mapScreener: IMapScreenr;

    /**
     * A computation utility to automate running common equations with access
     * to a set of constant values.
     */
    public mathDecider: IMathDecidr;

    /**
     * Hookups for extensible triggered mod events.
     */
    public modAttacher: IModAttachr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     */
    public numberMaker: INumberMakr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    public objectMaker: IObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    public pixelDrawer: IPixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    public pixelRender: IPixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    public quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    public scenePlayer: IScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     */
    public thingHitter: IThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    public timeHandler: ITimeHandlr;

    /**
     * A GUI touch layer layer on top of InputWritr that provides an extensible
     * API for adding touch-based control elements into an HTML element.
     */
    public touchPasser: ITouchPassr;

    /**
     * A randomization utility to automate random, recursive generation of
     * possibilities based on position and probability schemas. 
     */
    public worldSeeder: IWorldSeedr;

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
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    constructor(settings: IGameStartrSettings) {
        super({
            unitsize: settings.unitsize
        });

        if (!settings.width || !settings.height) {
            throw new Error("Both width and height must be provided or computed in GameStartr's constructor.");
        }
    }

    /**
     * Resets the system components and modules.
     */
    public reset(settings: IGameStartrSettings): void {
        super.reset(settings);

        this.resetModules(settings);
    }

    /**
     * Sets the system modules.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
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
     * Resets this.ObjectMaker.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetObjectMaker(): void {
        this.objectMaker = new ObjectMakr(
            this.utilities.proliferate(
                {
                    scope: this.things,
                    doPropertiesFull: true
                },
                this.moduleSettings.objects));
    }

    /**
     * Resets this.QuadsKeeper.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetQuadsKeeper(settings: IGameStartrSettings): void {
        const quadrantWidth: number = settings.width / (this.moduleSettings.quadrants.numCols - 3);
        const quadrantHeight: number = settings.height / (this.moduleSettings.quadrants.numRows - 2);

        this.quadsKeeper = new QuadsKeepr<IThing>(
            this.utilities.proliferate(
                {
                    ObjectMaker: this.objectMaker,
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
     * Resets this.PixelRender.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetPixelRender(): void {
        this.pixelRender = new PixelRendr(
            this.utilities.proliferate(
                {
                    scale: this.scale,
                    QuadsKeeper: this.quadsKeeper,
                    unitsize: this.unitsize
                },
                this.moduleSettings.sprites));
    }

    /**
     * Resets this.PixelDrawer.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetPixelDrawer(): void {
        this.pixelDrawer = new PixelDrawr(
            this.utilities.proliferate(
                {
                    PixelRender: this.pixelRender,
                    boundingBox: this.mapScreener,
                    createCanvas: this.utilities.createCanvas,
                    unitsize: this.unitsize,
                    generateObjectKey: this.graphics.generateThingKey
                },
                this.moduleSettings.renderer));
    }

    /**
     * Resets this.TimeHandler.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetTimeHandler(): void {
        this.timeHandler = new TimeHandlr(
            this.utilities.proliferate(
                {
                    classAdd: this.graphics.addClass,
                    classRemove: this.graphics.removeClass
                },
                this.moduleSettings.events));
    }

    /**
     * Resets this.AudioPlayer.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetAudioPlayer(): void {
        this.audioPlayer = new AudioPlayr(
            this.utilities.proliferate(
                {
                    ItemsHolder: this.itemsHolder
                },
                this.moduleSettings.audio));
    }

    /**
     * Resets this.GamesRunner.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetGamesRunner(): void {
        this.gamesRunner = new GamesRunnr(
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
        this.fpsAnalyzer = this.gamesRunner.getFPSAnalyzer();
    }

    /**
     * Resets this.ItemsHolder.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetItemsHolder(): void {
        this.itemsHolder = new ItemsHoldr(
            this.utilities.proliferate(
                {
                    "callbackArgs": [this]
                },
                this.moduleSettings.items));
    }

    /**
     * Resets this.GroupHolder.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetGroupHolder(): void {
        this.groupHolder = new GroupHoldr(this.moduleSettings.groups);
    }

    /**
     * Resets this.ThingHitter.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetThingHitter(): void {
        this.thingHitter = new ThingHittr(
            this.utilities.proliferate(
                {
                    scope: this
                },
                this.moduleSettings.collisions));
    }

    /**
     * Resets this.MapScreener.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetMapScreener(settings: IGameStartrSettings): void {
        this.mapScreener = new MapScreenr({
            width: settings.width!,
            height: settings.height!,
            scope: this.maps,
            variableArgs: [this],
            variableFunctions: this.moduleSettings.maps.screenVariables
        });
    }

    /**
     * Resets this.NumberMaker.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetNumberMaker(): void {
        this.numberMaker = new NumberMakr();
    }

    /**
     * Resets this.MapCreator.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetMapsCreator(): void {
        this.mapsCreator = new MapsCreatr({
            ObjectMaker: this.objectMaker,
            groupTypes: this.moduleSettings.maps.groupTypes,
            macros: this.moduleSettings.maps.macros,
            entrances: this.moduleSettings.maps.entrances,
            maps: this.moduleSettings.maps.library,
            scope: this
        });
    }

    /**
     * Resets this.AreaSpawner.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetAreaSpawner(): void {
        this.areaSpawner = new AreaSpawnr({
            MapsCreator: this.mapsCreator,
            MapScreener: this.mapScreener,
            screenAttributes: this.moduleSettings.maps.screenAttributes,
            onSpawn: this.moduleSettings.maps.onSpawn,
            onUnspawn: this.moduleSettings.maps.onUnspawn,
            stretchAdd: this.moduleSettings.maps.stretchAdd,
            afterAdd: this.moduleSettings.maps.afterAdd,
            commandScope: this
        });
    }

    /**
     * Resets this.InputWriter.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetInputWriter(): void {
        this.inputWriter = new InputWritr(
            this.utilities.proliferate(
                {
                    canTrigger: (): boolean => this.gameplay.canInputsTrigger(),
                    eventScope: this
                },
                this.moduleSettings.input));
    }

    /**
     * Resets this.DeviceLayer.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetDeviceLayer(): void {
        this.deviceLayer = new DeviceLayr(
            this.utilities.proliferate(
                {
                    InputWriter: this.inputWriter
                },
                this.moduleSettings.devices));
    }

    /**
     * Resets this.InputWriter.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetTouchPasser(): void {
        this.touchPasser = new TouchPassr(
            this.utilities.proliferate(
                {
                    InputWriter: this.inputWriter
                },
                this.moduleSettings.touch));
    }

    /**
     * Resets this.WorldSeeder.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetWorldSeeder(): void {
        this.worldSeeder = new WorldSeedr(
            this.utilities.proliferate(
                {
                    random: this.numberMaker.random.bind(this.numberMaker),
                    onPlacement: this.maps.placeRandomCommands.bind(this.maps)
                },
                this.moduleSettings.generator));
    }

    /**
     * Resets this.ScenePlayer.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetScenePlayer(): void {
        this.scenePlayer = new ScenePlayr(this.moduleSettings.scenes);
    }

    /**
     * Resets this.MathDecider.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetMathDecider(): void {
        this.mathDecider = new MathDecidr(
            this.utilities.proliferate(
                {
                    constants: {
                        NumberMaker: this.numberMaker
                    }
                },
                this.moduleSettings.math));
    }

    /**
     * Resets this.ModAttacher.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected resetModAttacher(): void {
        this.modAttacher = new ModAttachr(
            this.utilities.proliferate(
                {
                    scopeDefault: this,
                    ItemsHoldr: this.itemsHolder
                },
                this.moduleSettings.mods));
    }

    /** 
     * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
     * is fired.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
     */
    protected startModAttacher(settings: IGameStartrSettings): void {
        const mods: { [i: string]: boolean } = settings.mods as any;

        if (mods) {
            for (const i in mods) {
                if (mods.hasOwnProperty(i) && mods[i]) {
                    this.modAttacher.enableMod(i);
                }
            }
        }

        this.modAttacher.fireEvent("onReady", this, this);
    }

    /**
     * Resets the parent HTML container. Width and height are set by customs, 
     * and canvas, ItemsHolder, and TouchPassr container elements are added.
     * 
     * @param settings   Settings to initialize a new instance of the GameStartr class.
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
        this.pixelDrawer.setCanvas(this.canvas);
        this.container.appendChild(this.canvas);

        this.touchPasser.setParentContainer(this.container);
    }
}
