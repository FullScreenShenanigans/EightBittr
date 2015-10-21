declare module GameStartr {
    /**
     * Extra CSS styles that may be added to a page.
     */
    export interface IPageStyles {
        [i: string]: {
            [j: string]: string;
        }
    }

    /**
     * Custom settings to initialize a new instance of the IGameStartr interface.
     */
    export interface IGameStartrSettings extends EightBittr.IEightBittrSettings {
        extraResets?: string[];
        full?: boolean;
        size?: string;
        width?: number;
        height?: number;
        resetTimed?: boolean;
        mods?: { [i: string]: boolean }
        style?: {
            [i: string]: {
                [i: string]: string | number;
            }
        }
    }

    export interface IGameStartrStoredSettings {
        "audio": IAudioPlayrCustoms;
        "collisions": IThingHittrCustoms;
        "devices": IDeviceLayrCustoms;
        "editor": ILevelEditrCustoms;
        "generator": IWorldSeedrCustoms;
        "groups": IGroupHoldrCustoms;
        "events": ITimeHandlrCustoms;
        "input": IInputWritrCustoms;
        "maps": IMapsCreatrCustoms;
        "math": IMathDecidrCustoms;
        "mods": IModAttachrCustoms;
        "objects": IObjectMakrCustoms;
        "quadrants": IQuadsKeeprCustoms;
        "renderer": IPixelDrawrCustoms;
        "runner": IGamesRunnrCustoms;
        "scenes": IScenePlayrCustoms;
        "sprites": IPixelRendrCustoms;
        "statistics": IItemsHoldrCustoms;
        "touch": ITouchPassrCustoms;
        "ui": IUserWrapprCustoms;
        [i: string]: IGameStartrCustomsObject;
    }

    /**
     * Each settings file contains an Object that has its contents passed to the
     * corresponding module, either directly or via a partial copy.
     */
    export interface IGameStartrCustomsObject {
        [i: string]: any;
    }

    export interface IAudioPlayrCustoms extends IGameStartrCustomsObject {
        "directory": string;
        "fileTypes": string[];
        "library": {
            [i: string]: {
                [i: string]: string[];
            }
        };
    }

    export interface IDeviceLayrCustoms extends IGameStartrCustomsObject {

    }

    export interface IGamesRunnrCustoms extends IGameStartrCustomsObject {
        "interval"?: number;
        "games": Function[]
    }

    export interface IGroupHoldrCustoms extends IGameStartrCustomsObject, GroupHoldr.IGroupHoldrSettings { }

    export interface IInputWritrCustoms extends IGameStartrCustomsObject {
        "InputWritrArgs": {
            triggers: InputWritr.IInputWritrTriggerContainer;
            eventInformation?: any;
            getTimestamp?: () => number;
            aliases?: { [i: string]: any[] };
            keyAliasesToCodes?: { [i: string]: number };
            keyCodesToAliases?: { [i: number]: string };
            isRecording?: boolean | InputWritr.IInputWriterBooleanGetter;
        }
    }

    export interface IItemsHoldrCustoms extends IGameStartrCustomsObject {
        "prefix": string;
        "doMakeContainer"?: boolean;
        "displayChanges"?: { [i: string]: string };
        "containersArguments": any[][];
        "defaults": { [i: string]: string };
        "values": { [i: string]: ItemsHoldr.IItemValueSettings };
    }

    export interface ILevelEditrCustoms extends IGameStartrCustomsObject {
        "blocksize": number;
        "mapDefault": MapsCreatr.IMapsCreatrMapRaw;
        "mapSettingDefault": string;
        "mapEntryDefault": string;
        "prethings": {
            [i: string]: {
                [i: string]: any;
            }
        };
        "thingGroups": string[];
        "thingKeys": string[];
        "macros": {
            [i: string]: {
                "description": string;
                "options": any;
            }
        }
    }

    export interface IMapsCreatrCustoms extends IGameStartrCustomsObject {
        "mapDefault": string;
        "locationDefault": string;
        "groupTypes": string[];
        "requireEntrance"?: boolean;
        "screenAttributes"?: string[];
        "screenVariables": { [i: string]: Function };
        "onSpawn": (prething: MapsCreatr.IPreThing) => void;
        "onUnspawn": (prething: MapsCreatr.IPreThing) => void;
        "macros": { [i: string]: MapsCreatr.IMapsCreatrMacro };
        "entrances": { [i: string]: MapsCreatr.IMapsCreatrEntrance };
        "patterns"?: any;
        "library": { [i: string]: MapsCreatr.IMapsCreatrMapRaw };
    }

    export interface IMathDecidrCustoms extends IGameStartrCustomsObject { }

    export interface IModAttachrCustoms extends IGameStartrCustomsObject {
        "storeLocally"?: boolean;
        "mods": ModAttachr.IModAttachrMod[];
    }

    export interface IPixelDrawrCustoms extends IGameStartrCustomsObject {
        "groupNames": string[];
        "spriteCacheCutoff"?: number;
    }

    export interface IPixelRendrCustoms extends IGameStartrCustomsObject {
        "spriteWidth": string;
        "spriteHeight": string;
        "flipVert": string;
        "flipHoriz": string;
        "paletteDefault": number[][];
        "filters": any;
        "library": any;
    }

    export interface IObjectMakrCustoms extends IGameStartrCustomsObject {
        "onMake"?: string;
        "indexMap"?: any;
        "doPropertiesFull"?: boolean;
        "inheritance": any;
        "properties": { [i: string]: any };
    }

    export interface IQuadsKeeprCustoms extends IGameStartrCustomsObject {
        "numRows": number;
        "numCols": number;
        "tolerance"?: number;
        "groupNames": string[];
    }

    export interface IScenePlayrCustoms extends IGameStartrCustomsObject { }

    export interface IThingHittrCustoms extends IGameStartrCustomsObject, ThingHittr.IThingHittrSettings { }

    export interface ITimeHandlrCustoms extends IGameStartrCustomsObject {
        "timingDefault": number;
        "keyCycles"?: string;
        "keyClassName"?: string;
        "keyOnClassCycleStart"?: string;
        "keyDoClassCycleStart"?: string;
        "keyCycleCheckValidity"?: string;
        "copyCycleSettings"?: boolean;
    }

    export interface ITouchPassrCustoms extends IGameStartrCustomsObject, TouchPassr.ITouchPassrSettings { }

    export interface IUserWrapprCustoms extends IGameStartrCustomsObject { }

    export interface IWorldSeedrCustoms extends IGameStartrCustomsObject {
        possibilities: WorldSeedr.IPossibilityContainer;
    }

    export interface IGameStartr extends EightBittr.IEightBittr {
        settings: { [i: string]: IGameStartrCustomsObject; };
        container: HTMLDivElement;
        canvas: HTMLCanvasElement;
        scale: number;
        AudioPlayer: AudioPlayr.IAudioPlayr;
        DeviceLayer: DeviceLayr.IDeviceLayr;
        GamesRunner: GamesRunnr.IGamesRunnr;
        GroupHolder: GroupHoldr.IGroupHoldr;
        InputWriter: InputWritr.IInputWritr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        LevelEditor: LevelEditr.ILevelEditr;
        NumberMaker: NumberMakr.INumberMakr;
        MapsCreator: MapsCreatr.IMapsCreatr;
        MapScreener: MapScreenr.IMapScreenr;
        MapsHandler: MapsHandlr.IMapsHandlr;
        MathDecider: MathDecidr.IMathDecidr;
        ModAttacher: ModAttachr.IModAttachr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        PixelDrawer: PixelDrawr.IPixelDrawr;
        PixelRender: PixelRendr.IPixelRendr;
        QuadsKeeper: QuadsKeepr.IQuadsKeepr;
        ScenePlayer: ScenePlayr.IScenePlayr;
        ThingHitter: ThingHittr.IThingHittr;
        TimeHandler: TimeHandlr.ITimeHandlr;
        TouchPasser: TouchPassr.ITouchPassr;
        UserWrapper: UserWrappr.IUserWrappr;
        WorldSeeder: WorldSeedr.IWorldSeedr;
        reset(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTimed(GameStarter: IGameStartr, settings: IGameStartrSettings): EightBittr.IResetTimes;
        resetAudioPlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetGamesRunner(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetGroupHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetInputWriter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetDeviceLayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTouchPasser(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetLevelEditor(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetNumberMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapsCreator(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapScreener(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMapsHandler(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMathDecider(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetPixelRender(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetPixelDrawer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetObjectMaker(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetItemsHolder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetThingHitter(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetTimeHandler(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetQuadsKeeper(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetWorldSeeder(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetScenePlayer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetMathDecider(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        startModAttacher(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        resetContainer(GameStarter: IGameStartr, settings: IGameStartrSettings): void;
        scrollWindow(dx: number, dy?: number): void;
        scrollThing(thing: IThing, dx: number, dy?: number): void;
        onAreaSpawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;
        onAreaUnspawn(GameStarter: IGameStartr, direction: string, top: number, right: number, bottom: number, left: number): void;
        addThing(thingRaw: string | IThing | any[], left?: number, top?: number): IThing;
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;
        thingProcessAttributes(thing: IThing, attributes: any): void;
        mapPlaceRandomCommands(GameStarter: GameStartr, generatedCommands: WorldSeedr.ICommand[]): void;
        onGamePlay(GameStarter: GameStartr): void;
        onGamePause(GameStarter: GameStartr): void;
        canInputsTrigger(GameStarter: GameStartr): boolean;
        gameStart(): void;
        killNormal(thing: IThing): void;
        markChanged(thing: IThing): void;
        shiftVert(thing: IThing, dy: number, notChanged?: boolean): void;
        shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void;
        setTop(thing: IThing, top: number): void;
        setRight(thing: IThing, right: number): void;
        setBottom(thing: IThing, bottom: number): void;
        setLeft(thing: IThing, left: number): void;
        shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void;
        shiftThings(things: IThing[], dx: number, dy: number, notChanged): void;
        shiftAll(dx: number, dy: number): void;
        setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void;
        setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void;
        updatePosition(thing: IThing): void;
        updateSize(thing: IThing): void;
        reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void;
        increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void;
        increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void;
        thingPauseVelocity(thing: IThing, keepMovement?: boolean): void;
        thingResumeVelocity(thing: IThing, noVelocity?: boolean): void;
        generateObjectKey(thing: IThing): string;
        setClass(thing: IThing, className: string): void;
        setClassInitial(thing: IThing, className: string): void;
        addClass(thing: IThing, className: string): void;
        addClasses(thing: IThing, ...classes: (string | string[])[]): void;
        removeClass(thing: IThing, className: string): void;
        removeClasses(thing: IThing, ...classes: (string | string[])[]): void;
        hasClass(thing: IThing, className: string): boolean;
        switchClass(thing: IThing, classNameOut: string, classNameIn: string): void;
        flipHoriz(thing: IThing): void;
        flipVert(thing: IThing): void;
        unflipHoriz(thing: IThing): void;
        unflipVert(thing: IThing): void;
        setOpacity(thing: IThing, opacity: number): void;
        ensureCorrectCaller(current: any): GameStartr;
        arrayDeleteThing(thing: IThing, array: any[], location?: number): void;
        takeScreenshot(name: string, format?: string): void;
        addPageStyles(styles: any): void;
    }

    export interface IThing extends EightBittr.IThing, LevelEditr.IThing, QuadsKeepr.IThing {
        GameStarter: IGameStartr;
        name: string;
        groupType: string;
        className: string;
        alive?: boolean;
        placed?: boolean;
        changed?: boolean;
        maxquads: number;
        quadrants: QuadsKeepr.IQuadrant[];
        imageData: ImageData;
        attributes?: any;
        spriteCycle?: any[];
        spriteCycleSynched?: any[];
        xvelOld?: number;
        yvelOld?: number;
        parallaxHoriz?: number;
        parallaxVert?: number;
        flipHoriz?: boolean;
        flipVert?: boolean;
        noshiftx?: boolean;
        noshifty?: boolean;
        nofall?: boolean;
        nofallOld?: boolean;
        nocollide?: boolean;
        nocollideOld?: boolean;
        movement?: Function;
        movementOld?: Function;
        onThingAdd?: Function;
        onThingAdded?: Function;
        onThingMake?: Function;
        onDelete?: Function;
    }
}

declare module MapsCreatr {
    export interface IMapsCreatrArea {
        setting: string;
    }
}
