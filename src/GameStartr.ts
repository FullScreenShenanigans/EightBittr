import { AreaSpawnr } from "areaspawnr";
import { AudioPlayr } from "audioplayr";
import { component, container } from "babyioc";
import { DeviceLayr } from "devicelayr";
import { FpsAnalyzr } from "fpsanalyzr";
import { GamesRunnr } from "gamesrunnr";
import { GroupHoldr } from "groupholdr";
import { InputWritr } from "inputwritr";
import { ItemsHoldr } from "itemsholdr";
import { MapsCreatr } from "mapscreatr";
import { MapScreenr } from "mapscreenr";
import { ModAttachr } from "modattachr";
import { NumberMakr } from "numbermakr";
import { ObjectMakr } from "objectmakr";
import { PixelDrawr } from "pixeldrawr";
import { PixelRendr } from "pixelrendr";
import { IQuadrant, QuadsKeepr } from "quadskeepr";
import { ScenePlayr } from "sceneplayr";
import { ThingHittr } from "thinghittr";
import { TimeHandlr } from "timehandlr";
import { TouchPassr } from "touchpassr";

import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Maps } from "./components/Maps";
import { Physics } from "./components/Physics";
import { Scrolling } from "./components/Scrolling";
import { Things } from "./components/Things";
import { Utilities } from "./components/Utilities";
import { createAreaSpawner } from "./creators/createAreaSpawner";
import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createCanvas } from "./creators/createCanvas";
import { createContainer } from "./creators/createContainer";
import { createDeviceLayer } from "./creators/createDeviceLayer";
import { createFpsAnalyzer } from "./creators/createFpsAnalyzer";
import { createGamesRunner } from "./creators/createGamesRunner";
import { createGroupHolder } from "./creators/createGroupHolder";
import { createInputWriter } from "./creators/createInputWriter";
import { createItemsHolder } from "./creators/createItemsHolder";
import { createMapsCreator } from "./creators/createMapsCreator";
import { createMapScreener } from "./creators/createMapScreener";
import { createModAttacher } from "./creators/createModAttacher";
import { createNumberMaker } from "./creators/createNumberMaker";
import { createObjectMaker } from "./creators/createObjectMaker";
import { createPixelDrawer } from "./creators/createPixelDrawer";
import { createPixelRender } from "./creators/createPixelRender";
import { createQuadsKeeper } from "./creators/createQuadsKeeper";
import { createScenePlayer } from "./creators/createScenePlayer";
import { createThingHitter } from "./creators/createThingHitter";
import { createTimeHandler } from "./creators/createTimeHandler";
import { createTouchPasser } from "./creators/createTouchPasser";
import { IGameStartrConstructorSettings, IGameStartrSettings, IThing } from "./IGameStartr";

/**
 * A general-use game engine for 2D 8-bit games.
 */
@container
export class GameStartr {
    /**
     * Screen and component reset settings..
     */
    public readonly settings: IGameStartrSettings;

    /**
     * Canvas upon which the game's screen is constantly drawn.
     */
    @component(createCanvas, "canvas")
    public readonly canvas: HTMLCanvasElement;

    /**
     * HTML container containing all game elements.
     */
    @component(createContainer, "container")
    public readonly container: HTMLElement;

    /**
     * Graphics functions used by this instance.
     */
    @component(Graphics)
    public readonly graphics: Graphics;

    /**
     * Gameplay functions used by this instance.
     */
    @component(Gameplay)
    public readonly gameplay: Gameplay;

    /**
     * Maps functions used by this instance.
     */
    @component(Maps)
    public readonly maps: Maps;

    /**
     * Physics functions used by this instance.
     */
    @component(Physics)
    public readonly physics: Physics;

    /**
     * Scrolling functions used by this instance.
     */
    @component(Scrolling)
    public readonly scrolling: Scrolling;

    /**
     * Thing manipulation functions used by this instance.
     */
    @component(Things)
    public readonly things: Things;

    /**
     * Utility functions used by this instance.
     */
    @component(Utilities)
    public readonly utilities: Utilities;

    /**
     * Loads GameStartr maps to spawn and unspawn areas on demand.
     */
    @component(createAreaSpawner, AreaSpawnr)
    public readonly areaSpawner: AreaSpawnr;

    /**
     * Audio playback manager for persistent and on-demand themes and sounds.
     */
    @component(createAudioPlayer, AudioPlayr)
    public readonly audioPlayer: AudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    @component(createDeviceLayer, DeviceLayr)
    public readonly deviceLayer: DeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    @component(createFpsAnalyzer, FpsAnalyzr)
    public readonly fpsAnalyzer: FpsAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    @component(createGamesRunner, GamesRunnr)
    public readonly gamesRunner: GamesRunnr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    @component(createGroupHolder, GroupHoldr)
    public readonly groupHolder: GroupHoldr<any>;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    @component(createInputWriter, InputWritr)
    public readonly inputWriter: InputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    @component(createItemsHolder, ItemsHoldr)
    public readonly itemsHolder: ItemsHoldr;

    /**
     * Storage container and lazy loader for GameStartr maps.
     */
    @component(createMapsCreator, MapsCreatr)
    public readonly mapsCreator: MapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area.
     */
    @component(createMapScreener, MapScreenr)
    public readonly mapScreener: MapScreenr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @component(createModAttacher, ModAttachr)
    public readonly modAttacher: ModAttachr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     */
    @component(createNumberMaker, NumberMakr)
    public readonly numberMaker: NumberMakr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    @component(createObjectMaker, ObjectMakr)
    public readonly objectMaker: ObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    @component(createPixelDrawer, PixelDrawr)
    public readonly pixelDrawer: PixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    @component(createPixelRender, PixelRendr)
    public readonly pixelRender: PixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    @component(createQuadsKeeper, QuadsKeepr)
    public readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    @component(createScenePlayer, ScenePlayr)
    public readonly scenePlayer: ScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     */
    @component(createThingHitter, ThingHittr)
    public readonly thingHitter: ThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    @component(createTimeHandler, TimeHandlr)
    public readonly timeHandler: TimeHandlr;

    /**
     * A GUI layer on top of InputWritr for touch events.
     */
    @component(createTouchPasser, TouchPassr)
    public readonly touchPasser: TouchPassr;

    /**
     * Initializes a new instance of the GameStartr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IGameStartrConstructorSettings) {
        this.settings = {
            components: {},
            ...settings,
        };
    }
}
