import { AreaSpawnr } from "areaspawnr";
import { AudioPlayr } from "audioplayr";
import { component, factory } from "babyioc";
import { ClassCyclr } from "classcyclr";
import { DeviceLayr } from "devicelayr";
import { FpsAnalyzr } from "fpsanalyzr";
import { FrameTickr } from "frametickr";
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

import { Audio } from "./components/Audio";
import { Collisions } from "./components/Collisions";
import { Death } from "./components/Death";
import { Frames } from "./components/Frames";
import { Gameplay } from "./components/Gameplay";
import { Graphics } from "./components/Graphics";
import { Groups } from "./components/Groups";
import { Inputs } from "./components/Inputs";
import { Items } from "./components/Items";
import { Maps } from "./components/Maps";
import { Mods } from "./components/Mods";
import { Objects } from "./components/Objects";
import { Physics } from "./components/Physics";
import { Quadrants } from "./components/Quadrants";
import { Scrolling } from "./components/Scrolling";
import { Things } from "./components/Things";
import { Timing } from "./components/Timing";
import { Utilities } from "./components/Utilities";
import { createAreaSpawner } from "./creators/createAreaSpawner";
import { createAudioPlayer } from "./creators/createAudioPlayer";
import { createCanvas } from "./creators/createCanvas";
import { createClassCycler } from "./creators/createClassCycler";
import { createContainer } from "./creators/createContainer";
import { createDeviceLayer } from "./creators/createDeviceLayer";
import { createFpsAnalyzer } from "./creators/createFpsAnalyzer";
import { createFrameTicker } from "./creators/createFrameTicker";
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
import {
    IEightBittrConstructorSettings,
    IEightBittrSettings,
    IThing,
} from "./IEightBittr";

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
    @factory(createAreaSpawner)
    public readonly areaSpawner: AreaSpawnr;

    /**
     * Audio playback manager for persistent and on-demand themes and sounds.
     */
    @factory(createAudioPlayer)
    public readonly audioPlayer: AudioPlayr;

    /**
     * Cycles through class names using TimeHandlr events.
     */
    @factory(createClassCycler)
    public readonly classCycler: ClassCyclr;

    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    @factory(createDeviceLayer)
    public readonly deviceLayer: DeviceLayr;

    /**
     * Storage and analysis for framerate measurements.
     */
    @factory(createFpsAnalyzer)
    public readonly fpsAnalyzer: FpsAnalyzr;

    /**
     * Runs a series of callbacks on a timed interval.
     */
    @factory(createFrameTicker)
    public readonly frameTicker: FrameTickr;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    @factory(createGroupHolder)
    public readonly groupHolder: GroupHoldr<any>;

    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    @factory(createInputWriter)
    public readonly inputWriter: InputWritr;

    /**
     * A versatile container to store and manipulate values in localStorage.
     */
    @factory(createItemsHolder)
    public readonly itemsHolder: ItemsHoldr;

    /**
     * Storage container and lazy loader for EightBittr maps.
     */
    @factory(createMapsCreator)
    public readonly mapsCreator: MapsCreatr;

    /**
     * A simple container for Map attributes given by switching to an Area.
     */
    @factory(createMapScreener)
    public readonly mapScreener: MapScreenr;

    /**
     * Hookups for extensible triggered mod events.
     */
    @factory(createModAttacher)
    public readonly modAttacher: ModAttachr;

    /**
     * A typed MersenneTwister, which is a state-based random number generator.
     */
    @factory(createNumberMaker)
    public readonly numberMaker: NumberMakr;

    /**
     * A abstract factory for dynamic attribute-based JavaScript classes.
     */
    @factory(createObjectMaker)
    public readonly objectMaker: ObjectMakr;

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites.
     */
    @factory(createPixelDrawer)
    public readonly pixelDrawer: PixelDrawr;

    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    @factory(createPixelRender)
    public readonly pixelRender: PixelRendr;

    /**
     * Adjustable quadrant-based collision detection.
     */
    @factory(createQuadsKeeper)
    public readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    @factory(createScenePlayer)
    public readonly scenePlayer: ScenePlayr;

    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     */
    @factory(createThingHitter)
    public readonly thingHitter: ThingHittr;

    /**
     * A flexible, pausable alternative to setTimeout.
     */
    @factory(createTimeHandler)
    public readonly timeHandler: TimeHandlr;

    /**
     * A GUI layer on top of InputWritr for touch events.
     */
    @factory(createTouchPasser)
    public readonly touchPasser: TouchPassr;

    /**
     * Friendly sound aliases and names for audio.
     */
    @component(Audio)
    public readonly audio: Audio<this>;

    /**
     * Checkers and callbacks for Thing collisions.
     */
    @component(Collisions)
    public readonly collisions: Collisions<this>;

    /**
     * Removes Things from the game.
     */
    @component(Death)
    public readonly death: Death<this>;

    /**
     * Logic to advance each frame of the game.
     */
    @component(Frames)
    public readonly frames: Frames<this>;

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
     * Collection settings for IThings group names.
     */
    @component(Groups)
    public readonly groups: Groups<this>;

    /**
     * User input filtering and handling.
     */
    @component(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Storage keys and value settings.
     */
    @component(Items)
    public readonly items: Items<this>;

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
     * Raw ObjectMakr factory settings.
     */
    @component(Objects)
    public readonly objects: Objects<this>;

    /**
     * Physics functions to move Things around.
     */
    @component(Physics)
    public readonly physics: Physics<this>;

    /**
     * Arranges game physics quadrants.
     */
    @component(Quadrants)
    public readonly quadrants: Quadrants<this>;

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
     * Timing constants for delayed events.
     */
    @component(Timing)
    public readonly timing: Timing<this>;

    /**
     * Miscellaneous utility functions.
     */
    @component(Utilities)
    public readonly utilities: Utilities<this>;

    /**
     * Canvas upon which the game's screen is constantly drawn.
     */
    @factory(createCanvas)
    public readonly canvas: HTMLCanvasElement;

    /**
     * HTML container containing all game elements.
     */
    @factory(createContainer)
    public readonly container: HTMLElement;

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
