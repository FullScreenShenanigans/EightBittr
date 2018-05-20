import { AreaSpawnr } from "areaspawnr";
import { AudioPlayr } from "audioplayr";
import { component } from "babyioc";
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
import { QuadsKeepr } from "quadskeepr";
import { ScenePlayr } from "sceneplayr";
import { ThingHittr } from "thinghittr";
import { TimeHandlr } from "timehandlr";
import { TouchPassr } from "touchpassr";

import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Maps } from "./components/Maps";
import { Mods } from "./components/Mods";
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
import { IEightBittrConstructorSettings, IEightBittrSettings, IThing } from "./IEightBittr";

/**
 * A general-use game engine for 2D 8-bit games.
 */
export class EightBittr {
    /**
     * Screen and component reset settings.
     */
    public readonly settings: IEightBittrSettings;

    /**
     * Loads EightBittr maps to spawn and unspawn areas on demand.
     */
    @component(createAreaSpawner)
    public readonly areaSpawner: AreaSpawnr;

    /**
     * Audio playback manager for persistent and on-demand themes and sounds.
     */
    @component(createAudioPlayer)
    public readonly audioPlayer: AudioPlayr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    @component(createDeviceLayer)
    public readonly deviceLayer: DeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    @component(createFpsAnalyzer)
    public readonly fpsAnalyzer: FpsAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    @component(createGamesRunner)
    public readonly gamesRunner: GamesRunnr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    @component(createGroupHolder)
    public readonly groupHolder: GroupHoldr<any>;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    @component(createInputWriter)
    public readonly inputWriter: InputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    @component(createItemsHolder)
    public readonly itemsHolder: ItemsHoldr;

    /**
     * Storage container and lazy loader for EightBittr maps.
     */
    @component(createMapsCreator)
    public readonly mapsCreator: MapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area.
     */
    @component(createMapScreener)
    public readonly mapScreener: MapScreenr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @component(createModAttacher)
    public readonly modAttacher: ModAttachr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     */
    @component(createNumberMaker)
    public readonly numberMaker: NumberMakr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    @component(createObjectMaker)
    public readonly objectMaker: ObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    @component(createPixelDrawer)
    public readonly pixelDrawer: PixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    @component(createPixelRender)
    public readonly pixelRender: PixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    @component(createQuadsKeeper)
    public readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    @component(createScenePlayer)
    public readonly scenePlayer: ScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     */
    @component(createThingHitter)
    public readonly thingHitter: ThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    @component(createTimeHandler)
    public readonly timeHandler: TimeHandlr;

    /**
     * A GUI layer on top of InputWritr for touch events.
     */
    @component(createTouchPasser)
    public readonly touchPasser: TouchPassr;

    /**
     * Canvas upon which the game's screen is constantly drawn.
     */
    @component(createCanvas)
    public readonly canvas: HTMLCanvasElement;

    /**
     * HTML container containing all game elements.
     */
    @component(createContainer)
    public readonly container: HTMLElement;

    /**
     * Changes the visual appearance of Things.
     */
    @component(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Event hooks for major gameplay state changes.
     */
    @component(Gameplay)
    public readonly gameplay: Gameplay<this>;

    /**
     * Enters and spawns map areas.
     */
    @component(Maps)
    public readonly maps: Maps<this>;

    /**
     * Enters and spawns map areas.
     */
    @component(Mods)
    public readonly mods: Mods<this>;

    /**
     * Physics functions to move Things around.
     */
    @component(Physics)
    public readonly physics: Physics<this>;

    /**
     * Moves the screen and Things in it.
     */
    @component(Scrolling)
    public readonly scrolling: Scrolling<this>;

    /**
     * Adds and processes new Things into the game.
     */
    @component(Things)
    public readonly things: Things<this>;

    /**
     * Miscellaneous utility functions.
     */
    @component(Utilities)
    public readonly utilities: Utilities<this>;

    /**
     * Initializes a new instance of the EightBittr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IEightBittrConstructorSettings) {
        this.settings = {
            components: {},
            ...settings,
        };
    }
}
