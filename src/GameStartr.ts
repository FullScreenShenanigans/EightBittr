import { AreaSpawnr } from "areaspawnr/lib/AreaSpawnr";
import { IAreaSpawnr } from "areaspawnr/lib/IAreaSpawnr";
import { AudioPlayr } from "audioplayr/lib/AudioPlayr";
import { IAudioPlayr } from "audioplayr/lib/IAudioPlayr";
import { DeviceLayr } from "devicelayr/lib/DeviceLayr";
import { IDeviceLayr } from "devicelayr/lib/IDeviceLayr";
import { EightBittr } from "eightbittr/lib/EightBittr";
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
import { ICommand, IWorldSeedr } from "worldseedr/lib/IWorldSeedr";
import { WorldSeedr } from "worldseedr/lib/WorldSeedr";

import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Maps } from "./components/Maps";
import { Physics } from "./components/Physics";
import { Scrolling } from "./components/Scrolling";
import { Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import {
    IGameStartrProcessedSettings, IGameStartrSettings, IMapsModuleSettings,
    IModuleSettings, IQuadrantsModuleSettings, IThing
} from "./IGameStartr";

/**
 * A general-use game engine for 2D 8-bit games.
 */
export class GameStartr extends EightBittr {
    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    public areaSpawner: IAreaSpawnr;

    /**
     * Audio playback manager for persistent and on-demand themes and sounds.
     */
    public audioPlayer: IAudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    public deviceLayer: IDeviceLayr;

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
     * A versatile container to store and manipulate values in localStorage.
     */
    public itemsHolder: IItemsHoldr;

    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    public mapsCreator: IMapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area.
     */
    public mapScreener: IMapScreenr;

    /**
     * A computation utility to automate running common equations.
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
     * A GUI layer on top of InputWritr for touch events.
     */
    public touchPasser: ITouchPassr;

    /**
     * A randomization utility to automate random, recursive map generation.
     */
    public worldSeeder: IWorldSeedr;

    /**
     * Graphics functions used by this instance.
     */
    public graphics: Graphics;

    /**
     * Gameplay functions used by this instance.
     */
    public gameplay: Gameplay;

    /**
     * Maps functions used by this instance.
     */
    public maps: Maps;

    /**
     * Physics functions used by this instance.
     */
    public physics: Physics;

    /**
     * Scrolling functions used by this instance.
     */
    public scrolling: Scrolling;

    /**
     * Thing manipulation functions used by this instance.
     */
    public things: Things;

    /**
     * Utility functions used by this instance.
     */
    public utilities: Utilities;

    /**
     * Settings for individual modules.
     */
    public moduleSettings: IModuleSettings;

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
        super(settings);
    }

    /**
     * Resets the system components and modules.
     * 
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @todo Remove arguments from the creation args once all modules are 0.6.X.
     */
    public reset(rawSettings: IGameStartrSettings): void {
        const settings: IGameStartrProcessedSettings = Utilities.processSettings(rawSettings);
        const moduleSettings: IModuleSettings = this.moduleSettings || {};

        this.utilities = this.createUtilities(settings);
        this.objectMaker = this.createObjectMaker(moduleSettings, settings);
        this.pixelRender = this.createPixelRender(moduleSettings, settings);
        this.timeHandler = this.createTimeHandler(moduleSettings, settings);
        this.itemsHolder = this.createItemsHolder(moduleSettings, settings);
        this.audioPlayer = this.createAudioPlayer(moduleSettings, settings);
        this.quadsKeeper = this.createQuadsKeeper(moduleSettings, settings);
        this.gamesRunner = this.createGamesRunner(moduleSettings, settings);
        this.groupHolder = this.createGroupHolder(moduleSettings, settings);
        this.thingHitter = this.createThingHitter(moduleSettings, settings);
        this.mapScreener = this.createMapScreener(moduleSettings, settings);
        this.pixelDrawer = this.createPixelDrawer(moduleSettings, settings);
        this.numberMaker = this.createNumberMaker(moduleSettings, settings);
        this.mapsCreator = this.createMapsCreator(moduleSettings, settings);
        this.areaSpawner = this.createAreaSpawner(moduleSettings, settings);
        this.inputWriter = this.createInputWriter(moduleSettings, settings);
        this.deviceLayer = this.createDeviceLayer(moduleSettings, settings);
        this.touchPasser = this.createTouchPasser(moduleSettings, settings);
        this.worldSeeder = this.createWorldSeeder(moduleSettings, settings);
        this.scenePlayer = this.createScenePlayer(moduleSettings, settings);
        this.mathDecider = this.createMathDecider(moduleSettings, settings);
        this.modAttacher = this.createModAttacher(moduleSettings, settings);
        this.container = this.createContainer(settings);
        this.canvas = this.createCanvas(settings);
        this.physics = this.createPhysics(settings);
        this.graphics = this.createGraphics(settings);
        this.gameplay = this.createGameplay(settings);
        this.maps = this.createMaps(settings);
        this.scrolling = this.createScrolling(settings);
        this.things = this.createThings(settings);

        this.pixelDrawer.setCanvas(this.canvas);
        this.touchPasser.setParentContainer(this.container);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal AreaSpawner.
     */
    protected createAreaSpawner(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IAreaSpawnr {
        const mapsSettings: IMapsModuleSettings = moduleSettings.maps || {};

        return new AreaSpawnr({
            mapsCreatr: this.mapsCreator,
            mapScreenr: this.mapScreener,
            screenAttributes: mapsSettings.screenAttributes,
            onSpawn: mapsSettings.onSpawn,
            onUnspawn: mapsSettings.onUnspawn,
            stretchAdd: mapsSettings.stretchAdd,
            afterAdd: mapsSettings.afterAdd,
            commandScope: this
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal AudioPlayer.
     */
    protected createAudioPlayer(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IAudioPlayr {
        return new AudioPlayr({
            itemsHolder: this.itemsHolder,
            ...moduleSettings.audio
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal DeviceLayer.
     */
    protected createDeviceLayer(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IDeviceLayr {
        return new DeviceLayr({
            inputWriter: this.inputWriter,
            ...moduleSettings.devices
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal GamesRunner.
     */
    protected createGamesRunner(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IGamesRunnr {
        return new GamesRunnr({
            adjustFramerate: true,
            onClose: (): void => this.gameplay.onClose(),
            onPlay: (): void => this.gameplay.onPlay(),
            onPause: (): void => this.gameplay.onPause(),
            ...moduleSettings.runner
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal GroupHolder.
     */
    protected createGroupHolder(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IGroupHoldr {
        return new GroupHoldr(moduleSettings.groups);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal InputWriter.
     */
    protected createInputWriter(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IInputWritr {
        return new InputWritr({
            canTrigger: (): boolean => this.gameplay.canInputsTrigger(),
            ...moduleSettings.input
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ItemsHolder.
     */
    protected createItemsHolder(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IItemsHoldr {
        return new ItemsHoldr(moduleSettings.items);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal MapCreator.
     */
    protected createMapsCreator(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IMapsCreatr {
        const mapsSettings: IMapsModuleSettings = moduleSettings.maps || {};

        return new MapsCreatr({
            objectMaker: this.objectMaker,
            groupTypes: mapsSettings.groupTypes,
            macros: mapsSettings.macros,
            entrances: mapsSettings.entrances,
            maps: mapsSettings.library,
            scope: this
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal MapScreener.
     */
    protected createMapScreener(moduleSettings: IModuleSettings, settings: IGameStartrProcessedSettings): IMapScreenr {
        return new MapScreenr({
            width: settings.width,
            height: settings.height,
            scope: this.maps,
            variableArgs: [this],
            variableFunctions: moduleSettings.maps && moduleSettings.maps.screenVariables
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal MathDecider.
     */
    protected createMathDecider(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IMathDecidr {
        return new MathDecidr({
            constants: {
                NumberMaker: this.numberMaker
            },
            ...moduleSettings.math
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ModAttacher.
     */
    protected createModAttacher(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IModAttachr {
        const modAttacher: IModAttachr = new ModAttachr({
            scopeDefault: this,
            ItemsHoldr: this.itemsHolder,
            ...moduleSettings.mods
        });

        if (moduleSettings.mods && moduleSettings.mods.mods) {
            for (const mod of moduleSettings.mods.mods) {
                this.modAttacher.enableMod(mod.name);
            }
        }

        return modAttacher;
    }

    /**
     * @param _moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal NumberMaker.
     */
    protected createNumberMaker(_moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): INumberMakr {
        return new NumberMakr();
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ObjectMaker.
     */
    protected createObjectMaker(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IObjectMakr {
        return new ObjectMakr({
            scope: this.things,
            doPropertiesFull: true,
            ...moduleSettings.objects
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal PixelDrawer.
     */
    protected createPixelDrawer(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IPixelDrawr {
        return new PixelDrawr({
            PixelRender: this.pixelRender,
            boundingBox: this.mapScreener,
            createCanvas: (width: number, height: number): HTMLCanvasElement => {
                return this.utilities.createCanvas(width, height);
            },
            generateObjectKey: (thing: IThing): string => this.graphics.generateThingKey(thing),
            ...moduleSettings.renderer
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal PixelRender.
     */
    protected createPixelRender(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IPixelRendr {
        return new PixelRendr({
            scale: this.scale,
            quadsKeeper: this.quadsKeeper,
            ...moduleSettings.sprites
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal QuadsKeeper.
     */
    protected createQuadsKeeper(moduleSettings: IModuleSettings, settings: IGameStartrProcessedSettings): IQuadsKeepr<IThing> {
        const quadrantsSettings: IQuadrantsModuleSettings = moduleSettings.quadrants || {
            numCols: 4,
            numRows: 4
        };

        const quadrantWidth: number = settings.width / (quadrantsSettings.numCols - 2);
        const quadrantHeight: number = settings.height / (quadrantsSettings.numRows - 2);

        return new QuadsKeepr<IThing>({
            objectMaker: this.objectMaker,
            quadrantWidth: quadrantWidth,
            quadrantHeight: quadrantHeight,
            startLeft: -quadrantWidth,
            startHeight: -quadrantHeight,
            onAdd: (direction: string, top: number, right: number, bottom: number, left: number): void => {
                this.maps.onAreaSpawn(direction, top, right, bottom, left);
            },
            onRemove: (direction: string, top: number, right: number, bottom: number, left: number): void => {
                this.maps.onAreaUnspawn(direction, top, right, bottom, left);
            },
            ...moduleSettings.quadrants
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal TimeHandler.
     */
    protected createTimeHandler(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): ITimeHandlr {
        return new TimeHandlr({
            classAdd: (thing: IThing, className: string): void => {
                this.graphics.addClass(thing, className);
            },
            classRemove: (thing: IThing, className: string): void => {
                this.graphics.removeClass(thing, className);
            },
            ...moduleSettings.events
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal TouchPassr.
     */
    protected createTouchPasser(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): ITouchPassr {
        return new TouchPassr({
            inputWriter: this.inputWriter,
            ...moduleSettings.touch
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ThingHitter.
     */
    protected createThingHitter(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IThingHittr {
        return new ThingHittr(moduleSettings.collisions);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal WorldSeeder.
     */
    protected createWorldSeeder(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IWorldSeedr {
        return new WorldSeedr({
            random: (): number => this.numberMaker.random(),
            onPlacement: (generatedCommands: ICommand[]): void => {
                this.maps.placeRandomCommands(generatedCommands);
            },
            ...moduleSettings.generator
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ScenePlayer.
     */
    protected createScenePlayer(moduleSettings: IModuleSettings, _settings: IGameStartrProcessedSettings): IScenePlayr {
        return new ScenePlayr(moduleSettings.scenes);
    }

    /**
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new HTML container containing all game elements.
     */
    protected createContainer(settings: IGameStartrProcessedSettings): HTMLDivElement {
        return this.utilities.createElement("div", {
            className: "EightBitter",
            style: {
                position: "relative",
                width: settings.width + "px",
                height: settings.height + "px",
                ...settings.style
            }
        }) as HTMLDivElement;
    }

    /**
     * 
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new canvas upon which the game's screen is constantly drawn.
     */
    protected createCanvas(settings: IGameStartrProcessedSettings): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = this.utilities.createCanvas(settings.width, settings.height);

        this.container.appendChild(canvas);

        return canvas;
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Gameplay functions to be used by this instance.
     */
    protected createGameplay(_settings: IGameStartrProcessedSettings): Gameplay {
        return new Gameplay(this.audioPlayer, this.modAttacher);
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Graphics functions to be used by this instance.
     */
    protected createGraphics(_settings: IGameStartrProcessedSettings): Graphics {
        return new Graphics(this.physics, this.pixelDrawer);
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Maps functions to be used by this instance.
     */
    protected createMaps(_settings: IGameStartrProcessedSettings): Maps {
        return new Maps({
            areaSpawner: this.areaSpawner,
            mapsCreatr: this.mapsCreator,
            mapScreener: this.mapScreener,
            quadsKeeper: this.quadsKeeper,
            utilities: this.utilities
        });
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Physics functions to be used by this instance.
     */
    protected createPhysics(_settings: IGameStartrProcessedSettings): Physics {
        return new Physics(this.groupHolder, this.pixelDrawer);
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Scrolling functions to be used by this instance.
     */
    protected createScrolling(_settings: IGameStartrProcessedSettings): Scrolling {
        return new Scrolling(this.mapScreener, this.physics, this.quadsKeeper);
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Things functions to be used by this instance.
     */
    protected createThings(_settings: IGameStartrProcessedSettings): Things {
        return new Things({
            graphics: this.graphics,
            groupHolder: this.groupHolder,
            modAttacher: this.modAttacher,
            physics: this.physics,
            objectMaker: this.objectMaker,
            pixelDrawer: this.pixelDrawer,
            quadsKeeper: this.quadsKeeper,
            timeHandler: this.timeHandler,
            utilities: this.utilities
        });
    }

    /**
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns Utility functions to be used by this instance.
     */
    protected createUtilities(_settings: IGameStartrProcessedSettings): Utilities {
        return new Utilities(this.canvas);
    }
}
