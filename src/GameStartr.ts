import { AreaSpawnr } from "areaspawnr/lib/AreaSpawnr";
import { IAreaSpawnr } from "areaspawnr/lib/IAreaSpawnr";
import { AudioPlayr } from "audioplayr/lib/AudioPlayr";
import { IAudioPlayr } from "audioplayr/lib/IAudioPlayr";
import { DeviceLayr } from "devicelayr/lib/DeviceLayr";
import { IDeviceLayr } from "devicelayr/lib/IDeviceLayr";
import { EightBittr } from "eightbittr";
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
import { IQuadrant, IQuadsKeepr } from "quadskeepr/lib/IQuadsKeepr";
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
    IGameStartrSettings, IMapsModuleSettings, IModuleSettings,
    IQuadrantsModuleSettings, IThing
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
    public moduleSettings: IModuleSettings;

    /**
     * How much to scale each pixel from PixelDrawr to the real canvas.
     */
    public scale: number;

    /**
     * The most recent reset settings.
     */
    protected settings: IGameStartrSettings;

    /**
     * Resets the system.
     *
     * @param settings   Settings to reset with, if not the previous ones.
     */
    public reset(settings: IGameStartrSettings = this.settings): void {
        if (this.settings !== undefined
            && this.settings.moduleSettings !== undefined
            && settings.moduleSettings !== undefined
            && settings.moduleSettings !== this.settings.moduleSettings
        ) {
            settings = {
                ...settings,
                moduleSettings: {
                    ...this.settings.moduleSettings,
                    ...settings.moduleSettings
                }
            };
        }

        super.reset(settings);
    }

    /**
     * Resets the system components.
     */
    protected resetComponents(): void {
        this.utilities = new Utilities(this);
        this.physics = new Physics(this);
        this.graphics = new Graphics(this);
        this.gameplay = new Gameplay(this);
        this.maps = new Maps(this);
        this.scrolling = new Scrolling(this);
        this.things = new Things(this);
    }

    /**
     * Resets the system modules.
     *
     * @param settings   Settings to reset with.
     */
    protected resetModules(settings: IGameStartrSettings): void {
        this.moduleSettings = this.createModuleSettings(settings);

        this.objectMaker = this.createObjectMaker(this.moduleSettings, settings);
        this.pixelRender = this.createPixelRender(this.moduleSettings, settings);
        this.timeHandler = this.createTimeHandler(this.moduleSettings, settings);
        this.itemsHolder = this.createItemsHolder(this.moduleSettings, settings);
        this.audioPlayer = this.createAudioPlayer(this.moduleSettings, settings);
        this.quadsKeeper = this.createQuadsKeeper(this.moduleSettings, settings);
        this.gamesRunner = this.createGamesRunner(this.moduleSettings, settings);
        this.groupHolder = this.createGroupHolder(this.moduleSettings, settings);
        this.thingHitter = this.createThingHitter(this.moduleSettings, settings);
        this.mapScreener = this.createMapScreener(this.moduleSettings, settings);
        this.pixelDrawer = this.createPixelDrawer(this.moduleSettings, settings);
        this.numberMaker = this.createNumberMaker(this.moduleSettings, settings);
        this.mapsCreator = this.createMapsCreator(this.moduleSettings, settings);
        this.areaSpawner = this.createAreaSpawner(this.moduleSettings, settings);
        this.inputWriter = this.createInputWriter(this.moduleSettings, settings);
        this.deviceLayer = this.createDeviceLayer(this.moduleSettings, settings);
        this.touchPasser = this.createTouchPasser(this.moduleSettings, settings);
        this.worldSeeder = this.createWorldSeeder(this.moduleSettings, settings);
        this.modAttacher = this.createModAttacher(this.moduleSettings, settings);

        this.pixelDrawer.setCanvas(this.canvas);
        this.touchPasser.setParentContainer(this.container);

        this.registerLazy(
            "scenePlayer",
            (): IScenePlayr => this.createScenePlayer(this.moduleSettings, settings));
    }

    /**
     * Creates the settings for individual modules.
     *
     * @param settings   Settings to reset with.
     * @returns Settings for individual modules.
     */
    protected createModuleSettings(settings: IGameStartrSettings): IModuleSettings {
        return settings.moduleSettings || {};
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal AreaSpawner.
     */
    protected createAreaSpawner(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IAreaSpawnr {
        const mapsSettings: IMapsModuleSettings = moduleSettings.maps || {};

        return new AreaSpawnr({
            mapsCreatr: this.mapsCreator,
            mapScreenr: this.mapScreener,
            screenAttributes: mapsSettings.screenAttributes,
            onSpawn: mapsSettings.onSpawn,
            onUnspawn: mapsSettings.onUnspawn,
            stretchAdd: mapsSettings.stretchAdd,
            afterAdd: mapsSettings.afterAdd
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal AudioPlayer.
     */
    protected createAudioPlayer(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IAudioPlayr {
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
    protected createDeviceLayer(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IDeviceLayr {
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
    protected createGamesRunner(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IGamesRunnr {
        return new GamesRunnr({
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
    protected createGroupHolder(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IGroupHoldr {
        return new GroupHoldr(moduleSettings.groups);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal InputWriter.
     */
    protected createInputWriter(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IInputWritr {
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
    protected createItemsHolder(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IItemsHoldr {
        return new ItemsHoldr(moduleSettings.items);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal MapCreator.
     */
    protected createMapsCreator(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IMapsCreatr {
        const mapsSettings: IMapsModuleSettings = moduleSettings.maps || {};

        return new MapsCreatr({
            objectMaker: this.objectMaker,
            groupTypes: mapsSettings.groupTypes,
            macros: mapsSettings.macros,
            entrances: mapsSettings.entrances,
            maps: mapsSettings.library
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal MapScreener.
     */
    protected createMapScreener(moduleSettings: IModuleSettings, settings: IGameStartrSettings): IMapScreenr {
        return new MapScreenr({
            width: settings.width,
            height: settings.height,
            variableFunctions: moduleSettings.maps && moduleSettings.maps.screenVariables
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ModAttacher.
     */
    protected createModAttacher(moduleSettings: IModuleSettings, settings: IGameStartrSettings): IModAttachr {
        const modAttacher: IModAttachr = new ModAttachr({
            itemsHolder: this.itemsHolder,
            storeLocally: true,
            transformModName: (name: string): string => this.itemsHolder.getPrefix() + "::Mods::" + name,
            ...moduleSettings.mods
        });

        if (moduleSettings.mods && moduleSettings.mods.mods) {
            for (const mod of moduleSettings.mods.mods) {
                if (mod.enabled) {
                    modAttacher.enableMod(mod.name);
                }
            }
        }

        if (settings.mods) {
            for (const mod of settings.mods) {
                modAttacher.enableMod(mod);
            }
        }

        return modAttacher;
    }

    /**
     * @param _moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal NumberMaker.
     */
    protected createNumberMaker(_moduleSettings: IModuleSettings, _settings: IGameStartrSettings): INumberMakr {
        return new NumberMakr();
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal ObjectMaker.
     */
    protected createObjectMaker(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IObjectMakr {
        return new ObjectMakr({
            doPropertiesFull: true,
            ...moduleSettings.objects
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal PixelDrawer.
     */
    protected createPixelDrawer(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IPixelDrawr {
        return new PixelDrawr({
            pixelRender: this.pixelRender,
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
    protected createPixelRender(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IPixelRendr {
        return new PixelRendr({
            scale: this.scale,
            ...moduleSettings.sprites
        });
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal QuadsKeeper.
     */
    protected createQuadsKeeper(moduleSettings: IModuleSettings, settings: IGameStartrSettings): IQuadsKeepr<IThing> {
        const quadrantsSettings: IQuadrantsModuleSettings = moduleSettings.quadrants || {};

        const quadrantWidth: number = settings.width / ((quadrantsSettings.numCols || 4) - 2);
        const quadrantHeight: number = settings.height / ((quadrantsSettings.numRows || 4) - 2);

        return new QuadsKeepr<IThing>({
            quadrantFactory: (): IQuadrant<IThing> => this.objectMaker.make<IQuadrant<IThing>>("Quadrant"),
            quadrantWidth: quadrantWidth,
            quadrantHeight: quadrantHeight,
            startLeft: -quadrantWidth,
            startTop: -quadrantHeight,
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
    protected createTimeHandler(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): ITimeHandlr {
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
    protected createTouchPasser(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): ITouchPassr {
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
    protected createThingHitter(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IThingHittr {
        return new ThingHittr(moduleSettings.collisions);
    }

    /**
     * @param moduleSettings   Stored settings to generate modules.
     * @param _settings   Settings to reset an instance of the GameStartr class.
     * @returns A new internal WorldSeeder.
     */
    protected createWorldSeeder(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IWorldSeedr {
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
    protected createScenePlayer(moduleSettings: IModuleSettings, _settings: IGameStartrSettings): IScenePlayr {
        return new ScenePlayr(moduleSettings.scenes);
    }
}

GameStartr.prototype.moduleSettings = {};
