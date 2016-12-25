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
import { IWorldSeedr } from "worldseedr/lib/IWorldSeedr";
import { WorldSeedr } from "worldseedr/lib/WorldSeedr";

import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Maps } from "./components/Maps";
import { Physics } from "./components/Physics";
import { Scrolling } from "./components/Scrolling";
import { Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import {
    IAudioModuleSettings,
    ICollisionsModuleSettings,
    IDevicesModuleSettings,
    IEventsModuleSettings,
    IGameStartrProcessedSettings,
    IGameStartrSettings,
    IGeneratorModuleSettings,
    IGroupsModuleSettings,
    IInputModuleSettings,
    IItemsModuleSettings,
    IMapsModuleSettings,
    IMathModuleSettings,
    IModsModuleSettings,
    IModuleSettings,
    IObjectsModuleSettings,
    IQuadrantsModuleSettings,
    IRendererModuleSettings,
    IRunnerModuleSettings,
    IScenesModuleSettings,
    ISpritesModuleSettings,
    IThing,
    ITouchModuleSettings
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
    public moduleSettings: IModuleSettings = {};

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

        this.objectMaker = this.createObjectMaker(this.moduleSettings.objects);
        this.pixelRender = this.createPixelRender(this.moduleSettings.sprites);
        this.timeHandler = this.createTimeHandler(this.moduleSettings.events);
        this.itemsHolder = this.createItemsHolder(this.moduleSettings.items);
        this.audioPlayer = this.createAudioPlayer(this.moduleSettings.audio);
        this.quadsKeeper = this.createQuadsKeeper(settings, this.moduleSettings.quadrants);
        this.gamesRunner = this.createGamesRunner(this.moduleSettings.runner);
        this.groupHolder = this.createGroupHolder(this.moduleSettings.groups);
        this.thingHitter = this.createThingHitter(this.moduleSettings.collisions);
        this.mapScreener = this.createMapScreener(settings, this.moduleSettings.maps);
        this.pixelDrawer = this.createPixelDrawer(this.moduleSettings.renderer);
        this.numberMaker = this.createNumberMaker();
        this.mapsCreator = this.createMapsCreator(this.moduleSettings.maps);
        this.areaSpawner = this.createAreaSpawner(this.moduleSettings.maps);
        this.inputWriter = this.createInputWriter(this.moduleSettings.input);
        this.deviceLayer = this.createDeviceLayer(this.moduleSettings.devices);
        this.touchPasser = this.createTouchPasser(this.moduleSettings.touch);
        this.worldSeeder = this.createWorldSeeder(this.moduleSettings.generator);
        this.scenePlayer = this.createScenePlayer(this.moduleSettings.scenes);
        this.mathDecider = this.createMathDecider(this.moduleSettings.math);
        this.modAttacher = this.createModAttacher(this.moduleSettings.mods);

        this.container = this.createContainer(settings);
        this.canvas = this.createCanvas(settings);

        this.physics = this.createPhysics();
        this.utilities = this.createUtilities();
        this.graphics = this.createGraphics();
        this.gameplay = this.createGameplay();
        this.maps = this.createMaps();
        this.scrolling = this.createScrolling();
        this.things = this.createThings();
    }

    /**
     * @param objectsSettings   Settings regarding in-game object generation.
     * @returns A new internal ObjectMaker.
     */
    protected createObjectMaker(objectsSettings: IObjectsModuleSettings = {}): IObjectMakr {
        return new ObjectMakr({
            scope: this.things,
            doPropertiesFull: true,
            ...objectsSettings
        });
    }

    /**
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @param quadrantsSettings   Settings regarding screen quadrants.
     * @returns A new internal QuadsKeeper.
     */
    protected createQuadsKeeper(settings: IGameStartrProcessedSettings, quadrantsSettings?: IQuadrantsModuleSettings): IQuadsKeepr {
        if (!quadrantsSettings) {
            quadrantsSettings = {
                numCols: 4,
                numRows: 4
            };
        }

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
            ...this.moduleSettings.quadrants
        });
    }

    /**
     * @param spritesSettings   Settings regarding Thing sprite generation.
     * @returns A new internal PixelRender.
     */
    protected createPixelRender(spritesSettings: ISpritesModuleSettings = {}): IPixelRendr {
        return new PixelRendr({
            scale: this.scale,
            quadsKeeper: this.quadsKeeper,
            ...spritesSettings
        });
    }

    /**
     * @param rendererSettings   Settings regarding Thing sprite drawing.
     * @returns A new internal PixelDrawer.
     */
    protected createPixelDrawer(rendererSettings: IRendererModuleSettings = {}): IPixelDrawr {
        return new PixelDrawr({
            PixelRender: this.pixelRender,
            boundingBox: this.mapScreener,
            createCanvas: (width: number, height: number): HTMLCanvasElement => {
                return this.utilities.createCanvas(width, height);
            },
            generateObjectKey: (thing: IThing): string => this.graphics.generateThingKey(thing),
            ...rendererSettings
        });
    }

    /**
     * @param eventsSettings   Settings regarding timed events.
     * @returns A new internal TimeHandler.
     */
    protected createTimeHandler(eventsSettings: IEventsModuleSettings = {}): ITimeHandlr {
        return new TimeHandlr({
            classAdd: (thing: IThing, className: string): void => {
                this.graphics.addClass(thing, className);
            },
            classRemove: (thing: IThing, className: string): void => {
                this.graphics.removeClass(thing, className);
            },
            ...eventsSettings
        });
    }

    /**
     * @param audioSettings   Settings regarding audio playback.
     * @returns A new internal AudioPlayer.
     */
    protected createAudioPlayer(audioSettings: IAudioModuleSettings = {}): IAudioPlayr {
        return new AudioPlayr({
            itemsHolder: this.itemsHolder,
            ...audioSettings
        });
    }

    /**
     * @param runnerSettings   Settings regarding timed upkeep running.
     * @returns A new internal GamesRunner.
     */
    protected createGamesRunner(runnerSettings: IRunnerModuleSettings = {}): IGamesRunnr {
        return new GamesRunnr({
            adjustFramerate: true,
            onClose: (): void => this.gameplay.onClose(),
            onPlay: (): void => this.gameplay.onPlay(),
            onPause: (): void => this.gameplay.onPause(),
            ...runnerSettings
        });
    }

    /**
     * @param itemsSettings   Settings regarding locally stored stats.
     * @returns A new internal ItemsHolder.
     */
    protected createItemsHolder(itemsSettings?: IItemsModuleSettings): IItemsHoldr {
        return new ItemsHoldr(itemsSettings);
    }

    /**
     * @param groupsSettings   Settings regarding in-memory Thing groups.
     * @returns A new internal GroupHolder.
     */
    protected createGroupHolder(groupsSettings?: IGroupsModuleSettings): IGroupHoldr {
        return new GroupHoldr(groupsSettings);
    }

    /**
     * @param collisionsSettings   Settings regarding collision detection.
     * @returns A new internal ThingHitter.
     */
    protected createThingHitter(collisionsSettings?: ICollisionsModuleSettings): IThingHittr {
        return new ThingHittr(collisionsSettings);
    }

    /**
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @param mapsSettings   Settings regarding maps.
     * @returns A new internal MapScreener.
     */
    protected createMapScreener(settings: IGameStartrProcessedSettings, mapsSettings: IMapsModuleSettings = {}): IMapScreenr {
        return new MapScreenr({
            width: settings.width!,
            height: settings.height!,
            scope: this.maps,
            variableArgs: [this],
            variableFunctions: mapsSettings.screenVariables
        });
    }

    /**
     * @returns A new internal NumberMaker.
     */
    protected createNumberMaker(): INumberMakr {
        return new NumberMakr();
    }

    /**
     * @param mapsSettings   Settings regarding maps.
     * @returns A new internal MapCreator.
     */
    protected createMapsCreator(mapsSettings: IMapsModuleSettings = {}): IMapsCreatr {
        return new MapsCreatr({
            ObjectMaker: this.objectMaker,
            groupTypes: mapsSettings.groupTypes,
            macros: mapsSettings.macros,
            entrances: mapsSettings.entrances,
            maps: mapsSettings.library,
            scope: this
        });
    }

    /**
     * @param mapsSettings   Settings regarding maps.
     * @returns A new internal AreaSpawner.
     */
    protected createAreaSpawner(mapSettings: IMapsModuleSettings = {}): IAreaSpawnr {
        return new AreaSpawnr({
            mapsCreatr: this.mapsCreator,
            mapScreenr: this.mapScreener,
            screenAttributes: mapSettings.screenAttributes,
            onSpawn: mapSettings.onSpawn,
            onUnspawn: mapSettings.onUnspawn,
            stretchAdd: mapSettings.stretchAdd,
            afterAdd: mapSettings.afterAdd,
            commandScope: this
        });
    }

    /**
     * @param inputSettings   Settings regarding keyboard and mouse inputs.
     * @returns A new internal InputWriter.
     */
    protected createInputWriter(inputSettings: IInputModuleSettings = {}): IInputWritr {
        return new InputWritr({
            canTrigger: (): boolean => this.gameplay.canInputsTrigger(),
            ...inputSettings
        });
    }

    /**
     * @param devicesSettings   Settings regarding device input detection.
     * @returns A new internal DeviceLayer.
     */
    protected createDeviceLayer(devicesSettings: IDevicesModuleSettings = {}): IDeviceLayr {
        return new DeviceLayr({
            inputWriter: this.inputWriter,
            ...devicesSettings
        });
    }

    /**
     * @returns A new internal InputWriter.
     */
    protected createTouchPasser(touchSettings: ITouchModuleSettings = {}): ITouchPassr {
        return new TouchPassr({
            inputWriter: this.inputWriter,
            ...this.moduleSettings.touch
        });
    }

    /**
     * @returns A new internal WorldSeeder.
     */
    protected createWorldSeeder(generatorSettings: IGeneratorModuleSettings = {}): IWorldSeedr {
        return new WorldSeedr({
            random: this.numberMaker.random.bind(this.numberMaker),
            onPlacement: this.maps.placeRandomCommands.bind(this.maps),
            ...generatorSettings
        });
    }

    /**
     * @returns A new internal ScenePlayer.
     */
    protected createScenePlayer(scenesSettings: IScenesModuleSettings = {}): IScenePlayr {
        return new ScenePlayr(scenesSettings);
    }

    /**
     * @returns A new internal MathDecider.
     */
    protected createMathDecider(mathSettings: IMathModuleSettings = {}): IMathDecidr {
        return new MathDecidr({
            constants: {
                NumberMaker: this.numberMaker
            },
            ...mathSettings
        });
    }

    /**
     * @returns A new internal ModAttacher.
     */
    protected createModAttacher(modsSettings: IModsModuleSettings = {}): IModAttachr {
        const modAttacher: IModAttachr = new ModAttachr({
            scopeDefault: this,
            ItemsHoldr: this.itemsHolder,
            ...modsSettings.mods
        });

        if (modsSettings.mods) {
            for (const mod of modsSettings.mods) {
                this.modAttacher.enableMod(mod.name);
            }
        }

        return modAttacher;
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

        this.pixelDrawer.setCanvas(this.canvas);
        this.container.appendChild(this.canvas);

        this.touchPasser.setParentContainer(this.container);

        return canvas;
    }

    /**
     * @returns Gameplay functions to be used by this instance.
     */
    protected createGameplay(): Gameplay {
        return new Gameplay(this.audioPlayer, this.modAttacher);
    }

    /**
     * @returns Graphics functions to be used by this instance.
     */
    protected createGraphics(): Graphics {
        return new Graphics(this.physics, this.pixelDrawer);
    }

    /**
     * @returns Maps functions to be used by this instance.
     */
    protected createMaps(): Maps {
        return new Maps({
            areaSpawner: this.areaSpawner,
            mapsCreatr: this.mapsCreator,
            mapScreener: this.mapScreener,
            quadsKeeper: this.quadsKeeper,
            utilities: this.utilities
        });
    }

    /**
     * @returns Physics functions to be used by this instance.
     */
    protected createPhysics(): Physics {
        return new Physics(this.groupHolder, this.pixelDrawer);
    }

    /**
     * @returns Scrolling functions to be used by this instance.
     */
    protected createScrolling(): Scrolling {
        return new Scrolling(this.mapScreener, this.physics, this.quadsKeeper);
    }

    /**
     * @returns Things functions to be used by this instance.
     */
    protected createThings(): Things {
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
     * @returns Utility functions to be used by this instance.
     */
    protected createUtilities(): Utilities {
        return new Utilities(this.canvas);
    }
}
