// @echo '/// <reference path="AreaSpawnr-0.2.0.ts" />'
// @echo '/// <reference path="AudioPlayr-0.2.1.ts" />'
// @echo '/// <reference path="ChangeLinr-0.2.0.ts" />'
// @echo '/// <reference path="DeviceLayr-0.2.0.ts" />'
// @echo '/// <reference path="EightBittr-0.2.0.ts" />'
// @echo '/// <reference path="FPSAnalyzr-0.2.1.ts" />'
// @echo '/// <reference path="GamesRunnr-0.2.0.ts" />'
// @echo '/// <reference path="GroupHoldr-0.2.1.ts" />'
// @echo '/// <reference path="InputWritr-0.2.0.ts" />'
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="LevelEditr-0.2.0.ts" />'
// @echo '/// <reference path="MapsCreatr-0.2.1.ts" />'
// @echo '/// <reference path="MapScreenr-0.2.1.ts" />'
// @echo '/// <reference path="MathDecidr-0.2.0.ts" />'
// @echo '/// <reference path="ModAttachr-0.2.2.ts" />'
// @echo '/// <reference path="NumberMakr-0.2.2.ts" />'
// @echo '/// <reference path="ObjectMakr-0.2.2.ts" />'
// @echo '/// <reference path="PixelDrawr-0.2.0.ts" />'
// @echo '/// <reference path="PixelRendr-0.2.0.ts" />'
// @echo '/// <reference path="QuadsKeepr-0.2.1.ts" />'
// @echo '/// <reference path="ScenePlayr-0.2.0.ts" />'
// @echo '/// <reference path="StringFilr-0.2.1.ts" />'
// @echo '/// <reference path="ThingHittr-0.2.0.ts" />'
// @echo '/// <reference path="TimeHandlr-0.2.0.ts" />'
// @echo '/// <reference path="TouchPassr-0.2.0.ts" />'
// @echo '/// <reference path="UsageHelpr-0.2.0.ts" />'
// @echo '/// <reference path="UserWrappr-0.2.0.ts" />'
// @echo '/// <reference path="WorldSeedr-0.2.0.ts" />'
// @echo '/// <reference path="js_beautify.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/AreaSpawnr-0.2.0.ts" />
/// <reference path="References/AudioPlayr-0.2.1.ts" />
/// <reference path="References/ChangeLinr-0.2.0.ts" />
/// <reference path="References/DeviceLayr-0.2.0.ts" />
/// <reference path="References/EightBittr-0.2.0.ts" />
/// <reference path="References/FPSAnalyzr-0.2.1.ts" />
/// <reference path="References/GamesRunnr-0.2.0.ts" />
/// <reference path="References/GroupHoldr-0.2.1.ts" />
/// <reference path="References/InputWritr-0.2.0.ts" />
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="References/LevelEditr-0.2.0.ts" />
/// <reference path="References/MapsCreatr-0.2.1.ts" />
/// <reference path="References/MapScreenr-0.2.1.ts" />
/// <reference path="References/MathDecidr-0.2.0.ts" />
/// <reference path="References/ModAttachr-0.2.2.ts" />
/// <reference path="References/NumberMakr-0.2.2.ts" />
/// <reference path="References/ObjectMakr-0.2.2.ts" />
/// <reference path="References/PixelDrawr-0.2.0.ts" />
/// <reference path="References/PixelRendr-0.2.0.ts" />
/// <reference path="References/QuadsKeepr-0.2.1.ts" />
/// <reference path="References/ScenePlayr-0.2.0.ts" />
/// <reference path="References/StringFilr-0.2.1.ts" />
/// <reference path="References/ThingHittr-0.2.0.ts" />
/// <reference path="References/TimeHandlr-0.2.0.ts" />
/// <reference path="References/TouchPassr-0.2.0.ts" />
/// <reference path="References/UsageHelpr-0.2.0.ts" />
/// <reference path="References/UserWrappr-0.2.0.ts" />
/// <reference path="References/WorldSeedr-0.2.0.ts" />
/// <reference path="References/js_beautify.ts" />
/// <reference path="GameStartr.d.ts" />
// @endif

// @include ../Source/GameStartr.d.ts

module GameStartr {
    "use strict";

    /**
     * A general-use game engine for 2D 8-bit games.
     */
    export class GameStartr extends EightBittr.EightBittr implements IGameStartr {
        /**
         * Area manipulator and spawner for GameStartr Maps that is the front-end
         * counterpart to MapsCreatr. PreThing listings are loaded from Areas stored in a
         * MapsCreatr and added or removed from user input. Area properties are given to
         * a MapScreenr when a new Area is loaded.
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
         * A general utility for obtaining and analyzing framerate measurements. The 
         * most recent measurements are kept up to a certain point (either an infinite
         * number or a set amount). Options for analyzing the data such as getting the
         * mean, median, extremes, etc. are available.
         */
        public FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;

        /**
         * A class to continuously series of "game" Functions. Each game is run in a 
         * set order and the group is run as a whole at a particular interval, with a
         * configurable speed.
         */
        public GamesRunner: GamesRunnr.IGamesRunnr;

        /**
         * A general storage container for values in keyed Arrays and/or Objects.
         * Manipulation utlities are provided for adding, removing, switching, and
         * applying methods to values.
         */
        public GroupHolder: GroupHoldr.IGroupHoldr;

        /**
         * A general utility for automating interactions with user-called events linked
         * with callbacks. Pipe functions are available that take in user input, switch 
         * on the event code, and call the appropriate callback. Further utilities allow 
         * for saving and playback of input histories in JSON format.
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
         * An addon for for extensible modding functionality. "Mods" register triggers
         * such as "onModEnable" or "onReset" that can be triggered during gameplay.
         */
        public ModAttacher: ModAttachr.IModAttachr;

        /**
         * An factory for JavaScript classes that automates the process of 
         * setting constructors' prototypal inheritance. A sketch of class inheritance 
         * and a listing of properties for each class is taken in, and dynamically
         * accessible constructors keyed by String names are made available.
         */
        public ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * A front-end to PixelRendr to automate drawing mass amounts of sprites.
         */
        public PixelDrawer: PixelDrawr.IPixelDrawr;

        /**
         * A moderately unusual graphics module designed to compress images as
         * compressed text blobs and store the text blobs in a StringFilr. These tasks 
         * are performed and cached quickly enough for use in real-time environments, 
         * such as real-time video games.
         */
        public PixelRender: PixelRendr.IPixelRendr;

        /**
         * Quadrant-based collision detection. A grid structure of Quadrants is kept,
         * with Things placed within quadrants they intersect. Operations are available
         * to shift quadrants horizontally or vertically and add/remove rows and columns.
         */
        public QuadsKeeper: QuadsKeepr.IQuadsKeepr;

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
         * A timed events library providing a flexible alternative to setTimeout 
         * and setInterval that respects pauses and resumes. Events are assigned 
         * integer timestamps, and can be set to repeat multiple times.
         */
        public TimeHandler: TimeHandlr.ITimeHandlr;

        /**
         * A GUI touch layer layer on top of InputWritr that provides an extensible
         * API for adding touch-based control elements into an HTML element.
         */
        public TouchPasser: TouchPassr.ITouchPassr;

        /**
         * A simple interactive text-based assistant to demonstrate common API uses.
         */
        public UsageHelper: UsageHelpr.IUsageHelpr;

        /**
         * A user interface manager made to work on top of GameStartr implementations
         * and provide a configurable HTML display of options.
         */
        public UserWrapper: UserWrappr.IUserWrappr;

        /**
         * A randomization utility to automate random, recursive generation of
         * possibilities based on position and probability schemas. 
         */
        public WorldSeeder: WorldSeedr.IWorldSeedr;

        /**
         * Settings for individual modules are stored as sub-Objects here.
         */
        public settings: IGameStartrStoredSettings;

        /**
         * Default list of reset Functions to call during this.reset or this.resetTimed,
         * in order of when they should be called.
         */
        public resets: string[] = [
            "resetUsageHelper",
            "resetObjectMaker",
            "resetPixelRender",
            "resetTimeHandler",
            "resetItemsHolder",
            "resetAudioPlayer",
            "resetQuadsKeeper",
            "resetGamesRunner",
            "resetGroupHolder",
            "resetThingHitter",
            "resetMapScreener",
            "resetPixelDrawer",
            "resetNumberMaker",
            "resetMapsCreator",
            "resetAreaSpawner",
            "resetInputWriter",
            "resetDeviceLayer",
            "resetTouchPasser",
            "resetLevelEditor",
            "resetWorldSeeder",
            "resetScenePlayer",
            "resetMathDecider",
            "resetModAttacher",
            "startModAttacher",
            "resetContainer"
        ];

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
         * @param customs   Any optional custom settings.
         */
        constructor(settings: IGameStartrSettings = {}) {
            super({
                "unitsize": settings.unitsize,
                "constantsSource": settings.constantsSource,
                "constants": settings.constants
            });

            if (settings.extraResets) {
                this.resets.push.apply(this.resets, settings.extraResets);
            }

            if (settings.resetTimed) {
                this.resetTimed(this, settings);
            } else {
                this.reset(this, settings);
            }
        }


        /* Resets
        */

        /**
         * Resets the GameStartr by calling the parent EightBittr.prototype.reset.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        reset(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            super.reset(GameStarter, GameStarter.resets, settings);
        }

        /**
         * Resets the EightBittr and records the time by calling the parent 
         * EightBittr.prototype.resetTimed.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTimed(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            super.resetTimed(GameStarter, GameStarter.resets, settings);
        }

        /**
         * Sets this.UsageHelper.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetUsageHelper(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.UsageHelper = new UsageHelpr.UsageHelpr(GameStarter.settings.help);
        }

        /**
         * Sets this.ObjectMaker.
         * 
         * Because many Thing functions require access to other GameStartr modules, each is
         * given a reference to this container GameStartr via properties.thing.GameStarter. 
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetObjectMaker(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ObjectMaker = new ObjectMakr.ObjectMakr(
                GameStarter.proliferate(
                    {
                        "properties": {
                            "Quadrant": {
                                "EightBitter": GameStarter,
                                "GameStarter": GameStarter
                            },
                            "Thing": {
                                "EightBitter": GameStarter,
                                "GameStarter": GameStarter
                            }
                        }
                    },
                    GameStarter.settings.objects));
        }

        /**
         * Sets this.QuadsKeeper.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetQuadsKeeper(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            var quadrantWidth: number = settings.width / (GameStarter.settings.quadrants.numCols - 3),
                quadrantHeight: number = settings.height / (GameStarter.settings.quadrants.numRows - 2);

            GameStarter.QuadsKeeper = new QuadsKeepr.QuadsKeepr(
                GameStarter.proliferate(
                    {
                        "ObjectMaker": GameStarter.ObjectMaker,
                        "createCanvas": GameStarter.createCanvas,
                        "quadrantWidth": quadrantWidth,
                        "quadrantHeight": quadrantHeight,
                        "startLeft": -quadrantWidth,
                        "startHeight": -quadrantHeight,
                        "onAdd": GameStarter.onAreaSpawn.bind(GameStarter, GameStarter),
                        "onRemove": GameStarter.onAreaUnspawn.bind(GameStarter, GameStarter)
                    },
                    GameStarter.settings.quadrants));
        }

        /**
         * Sets this.PixelRender.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetPixelRender(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.PixelRender = new PixelRendr.PixelRendr(
                GameStarter.proliferate(
                    {
                        "scale": GameStarter.scale,
                        "QuadsKeeper": GameStarter.QuadsKeeper,
                        "unitsize": GameStarter.unitsize
                    },
                    GameStarter.settings.sprites));
        }

        /**
         * Sets this.PixelDrawer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetPixelDrawer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.PixelDrawer = new PixelDrawr.PixelDrawr(
                GameStarter.proliferate(
                    {
                        "PixelRender": GameStarter.PixelRender,
                        "MapScreener": GameStarter.MapScreener,
                        "createCanvas": GameStarter.createCanvas,
                        "unitsize": GameStarter.unitsize,
                        "generateObjectKey": GameStarter.generateThingKey
                    },
                    GameStarter.settings.renderer));
        }

        /**
         * Sets this.TimeHandler.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTimeHandler(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.TimeHandler = new TimeHandlr.TimeHandlr(
                GameStarter.proliferate(
                    {
                        "classAdd": GameStarter.addClass,
                        "classRemove": GameStarter.removeClass
                    },
                    GameStarter.settings.events));
        }

        /**
         * Sets this.AudioPlayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetAudioPlayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.AudioPlayer = new AudioPlayr.AudioPlayr(
                GameStarter.proliferate(
                    {
                        "ItemsHolder": GameStarter.ItemsHolder
                    },
                    GameStarter.settings.audio));
        }

        /**
         * Sets this.GamesRunner.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetGamesRunner(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.GamesRunner = new GamesRunnr.GamesRunnr(
                GameStarter.proliferate(
                    {
                        "adjustFramerate": true,
                        "scope": GameStarter,
                        "onPlay": GameStarter.onGamePlay.bind(GameStarter, GameStarter),
                        "onPause": GameStarter.onGamePause.bind(GameStarter, GameStarter),
                        "FPSAnalyzer": new FPSAnalyzr.FPSAnalyzr()
                    },
                    GameStarter.settings.runner));
            GameStarter.FPSAnalyzer = GameStarter.GamesRunner.getFPSAnalyzer();
        }

        /**
         * Sets this.ItemsHolder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetItemsHolder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ItemsHolder = new ItemsHoldr.ItemsHoldr(
                GameStarter.proliferate(
                    {
                        "callbackArgs": [GameStarter]
                    },
                    GameStarter.settings.items));
        }

        /**
         * Sets this.GroupHolder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetGroupHolder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.GroupHolder = new GroupHoldr.GroupHoldr(GameStarter.settings.groups);
        }

        /**
         * Sets this.ThingHitter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetThingHitter(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ThingHitter = new ThingHittr.ThingHittr(
                GameStarter.proliferate(
                    {
                        "scope": GameStarter
                    },
                    GameStarter.settings.collisions));
        }

        /**
         * Sets this.MapScreener.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMapScreener(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MapScreener = new MapScreenr.MapScreenr({
                "EightBitter": GameStarter,
                "unitsize": GameStarter.unitsize,
                "width": settings.width,
                "height": settings.height,
                "variableArgs": [GameStarter],
                "variables": GameStarter.settings.maps.screenVariables
            });
        }

        /**
         * Sets this.NumberMaker.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetNumberMaker(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.NumberMaker = new NumberMakr.NumberMakr();
        }

        /**
         * Sets this.MapCreator.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMapsCreator(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MapsCreator = new MapsCreatr.MapsCreatr({
                "ObjectMaker": GameStarter.ObjectMaker,
                "groupTypes": GameStarter.settings.maps.groupTypes,
                "macros": GameStarter.settings.maps.macros,
                "entrances": GameStarter.settings.maps.entrances,
                "maps": GameStarter.settings.maps.library,
                "scope": GameStarter
            });
        }

        /**
         * Sets this.AreaSpawner.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetAreaSpawner(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.AreaSpawner = new AreaSpawnr.AreaSpawnr({
                "MapsCreator": GameStarter.MapsCreator,
                "MapScreener": GameStarter.MapScreener,
                "screenAttributes": GameStarter.settings.maps.screenAttributes,
                "onSpawn": GameStarter.settings.maps.onSpawn,
                "onUnspawn": GameStarter.settings.maps.onUnspawn,
                "stretchAdd": GameStarter.settings.maps.stretchAdd,
                "afterAdd": GameStarter.settings.maps.afterAdd,
                "commandScope": GameStarter
            });
        }

        /**
         * Sets this.InputWriter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetInputWriter(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.InputWriter = new InputWritr.InputWritr(
                GameStarter.proliferate(
                    {
                        "canTrigger": GameStarter.canInputsTrigger.bind(GameStarter, GameStarter),
                        "eventInformation": GameStarter
                    },
                    GameStarter.settings.input.InputWritrArgs));
        }

        /**
         * Sets this.DeviceLayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetDeviceLayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.DeviceLayer = new DeviceLayr.DeviceLayr(
                GameStarter.proliferate(
                    {
                        "InputWriter": GameStarter.InputWriter
                    },
                    GameStarter.settings.devices));
        }

        /**
         * Sets this.InputWriter.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetTouchPasser(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.TouchPasser = new TouchPassr.TouchPassr(
                GameStarter.proliferate(
                    {
                        "InputWriter": GameStarter.InputWriter
                    },
                    GameStarter.settings.touch));
        }

        /**
         * Sets this.LevelEditor.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetLevelEditor(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.LevelEditor = new LevelEditr.LevelEditr(
                GameStarter.proliferate(
                    {
                        "GameStarter": GameStarter,
                        "beautifier": js_beautify
                    },
                    GameStarter.settings.editor));
        }

        /**
         * Sets this.WorldSeeder.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetWorldSeeder(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.WorldSeeder = new WorldSeedr.WorldSeedr(
                GameStarter.proliferate(
                    {
                        "random": GameStarter.NumberMaker.random.bind(GameStarter.NumberMaker),
                        "onPlacement": GameStarter.mapPlaceRandomCommands.bind(GameStarter, GameStarter)
                    },
                    GameStarter.settings.generator));
        }

        /**
         * Sets this.ScenePlayer.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetScenePlayer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ScenePlayer = new ScenePlayr.ScenePlayr(
                GameStarter.proliferate(
                    {
                        "cutsceneArguments": [GameStarter]
                    },
                    GameStarter.settings.scenes));
        }

        /**
         * Sets this.MathDecider.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetMathDecider(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.MathDecider = new MathDecidr.MathDecidr(GameStarter.settings.math);
        }

        /**
         * Sets this.ModAttacher.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetModAttacher(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.ModAttacher = new ModAttachr.ModAttachr(
                GameStarter.proliferate(
                    {
                        "scopeDefault": GameStarter,
                        "ItemsHoldr": GameStarter.ItemsHolder
                    },
                    GameStarter.settings.mods));
        }

        /** 
         * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
         * is fired.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        startModAttacher(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            var mods: { [i: string]: boolean } = settings.mods,
                i: string;

            if (mods) {
                for (i in mods) {
                    if (mods.hasOwnProperty(i) && mods[i]) {
                        GameStarter.ModAttacher.enableMod(i);
                    }
                }
            }

            GameStarter.ModAttacher.fireEvent("onReady", GameStarter, GameStarter);
        }

        /**
         * Resets the parent HTML container. Width and height are set by customs, 
         * and canvas, ItemsHolder, and TouchPassr container elements are added.
         * 
         * @param GameStarter
         * @param customs   Any optional custom settings.
         */
        resetContainer(GameStarter: GameStartr, settings: IGameStartrSettings): void {
            GameStarter.container = <HTMLDivElement>GameStarter.createElement("div", {
                "className": "EightBitter",
                "style": GameStarter.proliferate(
                    {
                        "position": "relative",
                        "width": settings.width + "px",
                        "height": settings.height + "px"
                    },
                    settings.style)
            });

            GameStarter.canvas = GameStarter.createCanvas(settings.width, settings.height);
            GameStarter.PixelDrawer.setCanvas(GameStarter.canvas);
            GameStarter.container.appendChild(GameStarter.canvas);

            GameStarter.TouchPasser.setParentContainer(GameStarter.container);
        }


        /* Global manipulations
        */

        /**
         * Scrolls the game window by shifting all Things and checking for quadrant
         * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
         * 
         * @param customs   Any optional custom settings.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollWindow(dx: number, dy?: number): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this);

            dx = dx | 0;
            dy = dy | 0;

            if (!dx && !dy) {
                return;
            }

            GameStarter.MapScreener.shift(dx, dy);
            GameStarter.shiftAll(-dx, -dy);

            GameStarter.QuadsKeeper.shiftQuadrants(-dx, -dy);
        }

        /**
         * Scrolls everything but a single Thing.
         * 
         * @param thing   The only Thing that shouldn't move on the screen.
         * @param dx   How far to scroll horizontally.
         * @param dy   How far to scroll vertically.
         */
        scrollThing(thing: IThing, dx: number, dy?: number): void {
            var saveleft: number = thing.left,
                savetop: number = thing.top;

            thing.GameStarter.scrollWindow(dx, dy);
            thing.GameStarter.setLeft(thing, saveleft);
            thing.GameStarter.setTop(thing, savetop);
        }

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
        onAreaSpawn(GameStarter: GameStartr, direction: string, top: number, right: number, bottom: number, left: number): void {
            GameStarter.AreaSpawner.spawnArea(
                direction,
                (top + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (right + GameStarter.MapScreener.left) / GameStarter.unitsize,
                (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (left + GameStarter.MapScreener.left) / GameStarter.unitsize
            );
        }

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
        onAreaUnspawn(GameStarter: GameStartr, direction: string, top: number, right: number, bottom: number, left: number): void {
            GameStarter.AreaSpawner.unspawnArea(
                direction,
                (top + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (right + GameStarter.MapScreener.left) / GameStarter.unitsize,
                (bottom + GameStarter.MapScreener.top) / GameStarter.unitsize,
                (left + GameStarter.MapScreener.left) / GameStarter.unitsize
            );
        }

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
        addThing(thingRaw: string | IThing | any[], left: number = 0, top: number = 0): IThing {
            var thing: IThing;

            if (typeof thingRaw === "string" || thingRaw instanceof String) {
                thing = this.ObjectMaker.make(<string>thingRaw);
            } else if (thingRaw.constructor === Array) {
                thing = this.ObjectMaker.make.apply(this.ObjectMaker, <any[]>thingRaw);
            } else {
                thing = <IThing>thingRaw;
            }

            if (arguments.length > 2) {
                thing.GameStarter.setLeft(thing, left);
                thing.GameStarter.setTop(thing, top);
            } else if (arguments.length > 1) {
                thing.GameStarter.setLeft(thing, left);
            }

            thing.GameStarter.updateSize(thing);

            thing.GameStarter.GroupHolder.getFunctions().add[thing.groupType](thing);
            thing.placed = true;

            // This will typically be a TimeHandler.cycleClass call
            if (thing.onThingAdd) {
                thing.onThingAdd(thing);
            }

            thing.GameStarter.PixelDrawer.setThingSprite(thing);

            // This will typically be a spawn* call
            if (thing.onThingAdded) {
                thing.onThingAdded(thing);
            }

            thing.GameStarter.ModAttacher.fireEvent("onAddThing", thing, left, top);

            return thing;
        }

        /**
         * Processes a Thing so that it is ready to be placed in gameplay. There are
         * a lot of steps here: width and height must be set with defaults and given
         * to spritewidth and spriteheight, a quadrants Array must be given, the 
         * sprite must be set, attributes and onThingMake called upon, and initial
         * class cycles and flipping set.
         * 
         * @param thing   The Thing being processed.
         * @param title   What type Thing this is (the name of the class).
         * @param settings   Additional settings to be given to the Thing.
         * @param defaults   The default settings for the Thing's class.
         * @remarks This is generally called as the onMake call in an ObjectMakr.
         */
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void {
            var maxQuads: number = 4,
                num: number,
                cycle: any;

            // If the Thing doesn't specify its own title, use the type by default
            thing.title = thing.title || title;

            // If a width/height is provided but no spritewidth/height,
            // use the default spritewidth/height
            if (thing.width && !thing.spritewidth) {
                thing.spritewidth = defaults.spritewidth || defaults.width;
            }
            if (thing.height && !thing.spriteheight) {
                thing.spriteheight = defaults.spriteheight || defaults.height;
            }

            // Each thing has at least 4 maximum quadrants for the QuadsKeepr
            num = Math.floor(
                thing.width * (
                    thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantWidth()
                )
            );
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            num = Math.floor(thing.height * thing.GameStarter.unitsize / thing.GameStarter.QuadsKeeper.getQuadrantHeight());
            if (num > 0) {
                maxQuads += ((num + 1) * maxQuads / 2);
            }
            thing.maxquads = maxQuads;
            thing.quadrants = new Array(maxQuads);

            // Basic sprite information
            thing.spritewidth = thing.spritewidth || thing.width;
            thing.spriteheight = thing.spriteheight || thing.height;

            // Sprite sizing
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;

            // Canvas, context
            thing.canvas = thing.GameStarter.createCanvas(
                thing.spritewidthpixels, thing.spriteheightpixels
            );
            thing.context = <CanvasRenderingContext2D>thing.canvas.getContext("2d");

            if (thing.opacity !== 1) {
                thing.GameStarter.setOpacity(thing, thing.opacity);
            }

            // Attributes, such as Koopa.smart
            if (thing.attributes) {
                thing.GameStarter.thingProcessAttributes(thing, thing.attributes);
            }

            // Important custom functions
            if (thing.onThingMake) {
                thing.onThingMake(thing, settings);
            }

            // Initial class / sprite setting
            thing.GameStarter.setSize(thing, thing.width, thing.height);
            thing.GameStarter.setClassInitial(thing, thing.name || thing.title);

            // Sprite cycles
            if (cycle = thing.spriteCycle) {
                thing.GameStarter.TimeHandler.addClassCycle(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }
            if (cycle = thing.spriteCycleSynched) {
                thing.GameStarter.TimeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || null, cycle[2] || null);
            }

            // flipHoriz and flipVert initially 
            if (thing.flipHoriz) {
                thing.GameStarter.flipHoriz(thing);
            }
            if (thing.flipVert) {
                thing.GameStarter.flipVert(thing);
            }

            // Mods!
            thing.GameStarter.ModAttacher.fireEvent("onThingMake", thing.GameStarter, thing, title, settings, defaults);
        }

        /**
         * Processes additional Thing attributes. For each attribute the Thing's
         * class says it may have, if it has it, the attribute's key is appeneded to
         * the Thing's name and the attribute value proliferated onto the Thing.
         * 
         * @param thing
         * @param attributes   A lookup of attributes that may be added to the Thing's class.
         */
        thingProcessAttributes(thing: IThing, attributes: { [i: string]: string }): void {
            var attribute: string;

            // For each listing in the attributes...
            for (attribute in attributes) {
                // If the thing has that attribute as true:
                if (thing[attribute]) {
                    // Add the extra options
                    thing.GameStarter.proliferate(thing, attributes[attribute]);

                    // Also add a marking to the name, which will go into the className
                    if (thing.name) {
                        thing.name += " " + attribute;
                    } else {
                        thing.name = thing.title + " " + attribute;
                    }
                }
            }
        }

        /**
         * Runs through commands generated by a WorldSeedr and evaluates all of 
         * to create PreThings via MapsCreator.analyzePreSwitch. 
         * 
         * @param GameStarter
         * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
         */
        mapPlaceRandomCommands(GameStarter: GameStartr, generatedCommands: WorldSeedr.ICommand[]): void {
            var MapsCreator: MapsCreatr.IMapsCreatr = GameStarter.MapsCreator,
                AreaSpawner: AreaSpawnr.IAreaSpawnr = GameStarter.AreaSpawner,
                prethings: MapsCreatr.IPreThingsContainers = AreaSpawner.getPreThings(),
                area: MapsCreatr.IMapsCreatrArea = AreaSpawner.getArea(),
                map: MapsCreatr.IMapsCreatrMap = AreaSpawner.getMap(),
                command: WorldSeedr.ICommand,
                output: any,
                i: number;

            for (i = 0; i < generatedCommands.length; i += 1) {
                command = generatedCommands[i];

                output = {
                    "thing": command.title,
                    "x": command.left,
                    "y": command.top
                };

                if (command.arguments) {
                    GameStarter.proliferateHard(output, command.arguments, true);
                }

                MapsCreator.analyzePreSwitch(output, prethings, area, map);
            }
        }

        /**
         * Triggered Function for when the game is unpaused. Music resumes, and
         * the mod event is fired.
         * 
         * @param GameStartr
         */
        onGamePlay(GameStarter: GameStartr): void {
            GameStarter.AudioPlayer.resumeAll();
            GameStarter.ModAttacher.fireEvent("onGamePlay");
        }

        /**
         * Triggered Function for when the game is paused. Music stops, and the
         * mod event is fired.
         * 
         * @param GameStartr
         */
        onGamePause(GameStarter: GameStartr): void {
            GameStarter.AudioPlayer.pauseAll();
            GameStarter.ModAttacher.fireEvent("onGamePause");
        }

        /**
         * Checks whether inputs can be fired, which by default is always true.
         * 
         * @param GameStartr
         * @returns Whether inputs can be fired, which is always true.
         */
        canInputsTrigger(GameStarter: GameStartr): boolean {
            return true;
        }

        /**
         * Generic Function to start the game. Nothing actually happens here.
         */
        gameStart(): void {
            this.ModAttacher.fireEvent("onGameStart");
        }


        /* Physics & similar
        */

        /**
         * Generically kills a Thing by setting its alive to false, hidden to true,
         * and clearing its movement.
         * 
         * @param thing
         */
        killNormal(thing: IThing): void {
            if (!thing) {
                return;
            }

            thing.alive = false;
            thing.hidden = true;
            thing.movement = undefined;
        }

        /** 
         * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
         * to redraw the Thing and its quadrant.
         * 
         * @param thing
         */
        markChanged(thing: IThing): void {
            thing.changed = true;
        }

        /**
         * Shifts a Thing vertically using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         * 
         * @param thing
         * @param dy   How far to shift the Thing vertically.
         * @param notChanged   Whether to skip marking the Thing as changed (by 
         *                     default, false).
         */
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void {
            EightBittr.EightBittr.prototype.shiftVert(thing, dy);

            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Shifts a Thing horizontally using the EightBittr utility, and marks the
         * Thing as having a changed appearance.
         * 
         * @param thing
         * @param dx   How far to shift the Thing horizontally.
         * @param notChanged   Whether to skip marking the Thing as changed (by
         *                     default, false).
         */
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void {
            EightBittr.EightBittr.prototype.shiftHoriz(thing, dx);

            if (!notChanged) {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Sets a Thing's top using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         * 
         * @param thing
         * @param top   A new top border for the Thing.
         */
        setTop(thing: IThing, top: number): void {
            EightBittr.EightBittr.prototype.setTop(thing, top);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's right using the EightBittr utility, and marks the Thing as
         * having a changed appearance.
         * 
         * @param thing
         * @param right   A new right border for the Thing.
         */
        setRight(thing: IThing, right: number): void {
            EightBittr.EightBittr.prototype.setRight(thing, right);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         * 
         * @param thing
         * @param bottom   A new bottom border for the Thing.
         */
        setBottom(thing: IThing, bottom: number): void {
            EightBittr.EightBittr.prototype.setBottom(thing, bottom);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Sets a Thing's left using the EightBittr utility, and marks the Thing
         * as having a changed appearance.
         * 
         * @param thing
         * @param left   A new left border for the Thing.
         */
        setLeft(thing: IThing, left: number): void {
            EightBittr.EightBittr.prototype.setLeft(thing, left);
            thing.GameStarter.markChanged(thing);
        }

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
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void {
            dx = dx || 0;
            dy = dy || 0;

            if (!thing.noshiftx) {
                if (thing.parallaxHoriz) {
                    thing.GameStarter.shiftHoriz(thing, thing.parallaxHoriz * dx, notChanged);
                } else {
                    thing.GameStarter.shiftHoriz(thing, dx, notChanged);
                }
            }

            if (!thing.noshifty) {
                if (thing.parallaxVert) {
                    thing.GameStarter.shiftVert(thing, thing.parallaxVert * dy, notChanged);
                } else {
                    thing.GameStarter.shiftVert(thing, dy, notChanged);
                }
            }
        }

        /**
         * Calls shiftBoth on all members of an Array.
         * 
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         * @param notChanged   Whether to skip marking the Things as changed (by 
         *                     default, false).
         */
        shiftThings(things: IThing[], dx: number, dy: number, notChanged?: boolean): void {
            for (var i: number = things.length - 1; i >= 0; i -= 1) {
                things[i].GameStarter.shiftBoth(things[i], dx, dy, notChanged);
            }
        }

        /**
         * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
         * 
         * @param dx   How far to shift the Things horizontally.
         * @param dy   How far to shift the Things vertically.
         */
        shiftAll(dx: number, dy: number): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this);
            GameStarter.GroupHolder.callAll(GameStarter, GameStarter.shiftThings, dx, dy, true);
        }

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
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.width = width;
            thing.unitwidth = width * thing.GameStarter.unitsize;

            if (updateSprite) {
                thing.spritewidth = width;
                thing.spritewidthpixels = width * thing.GameStarter.unitsize;
            }

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }

            thing.GameStarter.markChanged(thing);
        }

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
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.height = height;
            thing.unitheight = height * thing.GameStarter.unitsize;

            if (updateSprite) {
                thing.spriteheight = height;
                thing.spriteheightpixels = height * thing.GameStarter.unitsize;
            }

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            }

            thing.GameStarter.markChanged(thing);
        }

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
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void {
            thing.GameStarter.setWidth(thing, width, updateSprite, updateSize);
            thing.GameStarter.setHeight(thing, height, updateSprite, updateSize);
        }

        /**
         * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
         * shiftHoriz and shiftVert.
         * 
         * @param thing
         */
        updatePosition(thing: IThing): void {
            thing.GameStarter.shiftHoriz(thing, thing.xvel);
            thing.GameStarter.shiftVert(thing, thing.yvel);
        }

        /**
         * Completely updates the size measurements of a Thing. That means the
         * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
         * spriteheightpixels attributes. The Thing's sprite is then updated by the
         * PixelDrawer, and its appearance is marked as changed.
         * 
         * @param thing
         */
        updateSize(thing: IThing): void {
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;
            thing.spritewidthpixels = thing.spritewidth * thing.GameStarter.unitsize;
            thing.spriteheightpixels = thing.spriteheight * thing.GameStarter.unitsize;

            thing.canvas.width = thing.spritewidthpixels;
            thing.canvas.height = thing.spriteheightpixels;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);

            thing.GameStarter.markChanged(thing);
        }

        /**
         * Reduces a Thing's width by pushing back its right and decreasing its 
         * width. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dx   How much to reduce the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void {
            thing.right -= dx;
            thing.width -= dx / thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its 
         * height. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dy   How much to reduce the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing
         *                     (by default, false).
         */
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void {
            thing.top += dy;
            thing.height -= dy / thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Increases a Thing's width by pushing forward its right and decreasing its 
         * width. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dx   How much to increase the Thing's width.
         * @param updateSize   Whether to also call updateSize on the Thing 
         *                     (by default, false).
         */
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void {
            thing.right += dx;
            thing.width += dx / thing.GameStarter.unitsize;
            thing.unitwidth = thing.width * thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }

        /**
         * Reduces a Thing's height by pushing down its top and decreasing its 
         * height. It is marked as changed in appearance.
         * 
         * @param thing
         * @param dy   How much to increase the Thing's height.
         * @param updateSize   Whether to also call updateSize on the Thing 
         *                     (by default, false).
         */
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void {
            thing.top -= dy;
            thing.height += dy / thing.GameStarter.unitsize;
            thing.unitheight = thing.height * thing.GameStarter.unitsize;

            if (updateSize) {
                thing.GameStarter.updateSize(thing);
            } else {
                thing.GameStarter.markChanged(thing);
            }
        }


        /* Appearance utilities
        */

        /**
         * Generates a key for a Thing based off the Thing's basic attributes. 
         * This key should be used for PixelRender.get calls, to cache the Thing's
         * sprite.
         * 
         * @param thing
         * @returns A key that to identify the Thing's sprite.
         */
        generateThingKey(thing: IThing): string {
            return thing.groupType + " " + thing.title + " " + thing.className;
        }

        /**
         * Sets the class of a Thing, sets the new sprite for it, and marks it as 
         * having changed appearance. The class is stored in the Thing's internal
         * .className attribute.
         * 
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClass(thing: IThing, className: string): void {
            thing.className = className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * A version of setClass to be used before the Thing's sprite attributes
         * have been set. This just sets the internal .className.
         * 
         * @param thing
         * @param className   A new .className for the Thing.
         */
        setClassInitial(thing: IThing, className: string): void {
            thing.className = className;
        }

        /**
         * Adds a string to a Thing's class after a " ", updates the Thing's 
         * sprite, and marks it as having changed appearance.
         * 
         * @param thing
         * @param className   A class to add to the Thing.
         */
        addClass(thing: IThing, className: string): void {
            thing.className += " " + className;
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
            thing.GameStarter.markChanged(thing);
        }

        /**
         * Adds multiple strings to a Thing's class after a " ", updates the Thing's 
         * sprite, and marks it as having changed appearance. Strings may be given 
         * as Arrays or Strings; Strings will be split on " ". Any number of 
         * additional arguments may be given.
         * 
         * @param thing
         * @param classes   Any number of classes to add to the Thing.
         */
        addClasses(thing: IThing, ...classes: (string | string[])[]): void {
            var adder: string | string[],
                i: number,
                j: number;

            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];

                if (adder.constructor === String || typeof adder === "string") {
                    adder = (<string>adder).split(" ");
                }

                for (j = adder.length - 1; j >= 0; j -= 1) {
                    thing.GameStarter.addClass(thing, adder[j]);
                }
            }
        }

        /**
         * Removes a string from a Thing's class, updates the Thing's sprite, and
         * marks it as having changed appearance.
         * 
         * @param thing
         * @param className   A class to remove from the Thing.
         */
        removeClass(thing: IThing, className: string): void {
            if (!className) {
                return;
            }
            if (className.indexOf(" ") !== -1) {
                thing.GameStarter.removeClasses(thing, className);
            }
            thing.className = thing.className.replace(new RegExp(" " + className, "gm"), "");
            thing.GameStarter.PixelDrawer.setThingSprite(thing);
        }

        /**
         * Removes multiple strings from a Thing's class, updates the Thing's 
         * sprite, and marks it as having changed appearance. Strings may be given 
         * as Arrays or Strings; Strings will be split on " ". Any number of 
         * additional arguments may be given.
         * 
         * @param thing
         * @param classes   Any number of classes to remove from the Thing.
         */
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void {
            var adder: string | string[],
                i: number,
                j: number;

            for (i = 0; i < classes.length; i += 1) {
                adder = classes[i];

                if (adder.constructor === String || typeof adder === "string") {
                    adder = (<string>adder).split(" ");
                }

                for (j = adder.length - 1; j >= 0; --j) {
                    thing.GameStarter.removeClass(thing, adder[j]);
                }
            }
        }

        /**
         * @param thing
         * @param className   A class to check for in the Thing.
         * @returns  Whether the Thing's class contains the class.
         */
        hasClass(thing: IThing, className: string): boolean {
            return thing.className.indexOf(className) !== -1;
        }

        /**
         * Removes the first class from a Thing and adds the second. All typical
         * sprite updates are called.
         * 
         * @param thing
         * @param classNameOut   A class to remove from the Thing.
         * @param classNameIn   A class to add to the thing.
         */
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void {
            thing.GameStarter.removeClass(thing, classNameOut);
            thing.GameStarter.addClass(thing, classNameIn);
        }

        /**
         * Marks a Thing as being flipped horizontally by setting its .flipHoriz
         * attribute to true and giving it a "flipped" class.
         * 
         * @param thing
         */
        flipHoriz(thing: IThing): void {
            thing.flipHoriz = true;
            thing.GameStarter.addClass(thing, "flipped");
        }

        /**
         * Marks a Thing as being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         * 
         * @param thing
         */
        flipVert(thing: IThing): void {
            thing.flipVert = true;
            thing.GameStarter.addClass(thing, "flip-vert");
        }

        /**
         * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
         * attribute to false and giving it a "flipped" class.
         * 
         * @param thing
         */
        unflipHoriz(thing: IThing): void {
            thing.flipHoriz = false;
            thing.GameStarter.removeClass(thing, "flipped");
        }

        /**
         * Marks a Thing as not being flipped vertically by setting its .flipVert
         * attribute to true and giving it a "flipped" class.
         * 
         * @param thing
         */
        unflipVert(thing: IThing): void {
            thing.flipVert = false;
            thing.GameStarter.removeClass(thing, "flip-vert");
        }

        /**
         * Sets the opacity of the Thing and marks its appearance as changed.
         * 
         * @param thing
         * @param opacity   A number in [0,1].
         */
        setOpacity(thing: IThing, opacity: number): void {
            thing.opacity = opacity;
            thing.GameStarter.markChanged(thing);
        }


        /* Miscellaneous utilities
        */

        /**
         * Ensures the current object is a GameStartr by throwing an error if it 
         * is not. This should be used for Functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         * 
         * @param current
         */
        ensureCorrectCaller(current: any): GameStartr {
            if (!(current instanceof GameStartr)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated GameStartr object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        }

        /**
         * Removes a Thing from an Array using Array.splice. If the thing has an 
         * onDelete, that is called.
         * 
         * @param thing
         * @param array   The group containing the thing.
         * @param location   The index of the Thing in the Array, for speed's
         *                   sake (by default, it is found using Array.indexOf).
         */
        arrayDeleteThing(thing: IThing, array: IThing[], location: number = array.indexOf(thing)): void {
            if (location === -1) {
                return;
            }

            array.splice(location, 1);

            if (typeof thing.onDelete === "function") {
                thing.onDelete(thing);
            }
        }

        /**
         * Takes a snapshot of the current screen canvas by simulating a click event
         * on a dummy link.
         * 
         * @param name   A name for the image to be saved as.
         * @param format   A format for the image to be saved as (by default, png).
         * @remarks For security concerns, browsers won't allow this unless it's
         *          called within a callback of a genuine user-triggered event.
         */
        takeScreenshot(name: string, format: string = "image/png"): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this),
                link: HTMLLinkElement = <HTMLLinkElement>GameStarter.createElement("a", {
                    "download": name + "." + format.split("/")[1],
                    "href": GameStarter.canvas.toDataURL(format).replace(format, "image/octet-stream")
                });

            link.click();
        }

        /**
         * Adds a set of CSS styles to the page.
         * 
         * @param styles   CSS styles represented as JSON.
         */
        addPageStyles(styles: IPageStyles): void {
            var GameStarter: GameStartr = GameStartr.prototype.ensureCorrectCaller(this),
                sheet: HTMLStyleElement = <HTMLStyleElement>GameStarter.createElement("style", {
                    "type": "text/css"
                }),
                compiled: string = "",
                i: string,
                j: string;

            for (i in styles) {
                if (!styles.hasOwnProperty(i)) {
                    continue;
                }

                compiled += i + " { \r\n";
                for (j in styles[i]) {
                    if (styles[i].hasOwnProperty(j)) {
                        compiled += "  " + j + ": " + styles[i][j] + ";\r\n";
                    }
                }
                compiled += "}\r\n";
            }

            if ((<any>sheet).styleSheet) {
                (<any>sheet).style.cssText = compiled;
            } else {
                sheet.appendChild(document.createTextNode(compiled));
            }

            document.querySelector("head").appendChild(sheet);
        }
    }
}
