declare module BattleMovr {
    export interface IGameStartr extends EightBittr.IEightBittr {
        GroupHolder: GroupHoldr.IGroupHoldr;
        MapScreener: MapScreenr.IMapScreenr;
        MathDecider: MathDecidr.IMathDecidr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        ScenePlayer: ScenePlayr.IScenePlayr;
        addThing(thing: string | IThing | any[], left?: number, top?: number): IThing;
        killNormal(thing: IThing): void;
        setHeight(thing: IThing, height: number);
        setWidth(thing: IThing, width: number);
    }

    export interface IPosition {
        left?: number;
        top?: number;
    }

    export interface IThingsContainer {
        [i: string]: IThing;
        menu ?: IThing;
    }

    export interface IThing extends EightBittr.IThing {
        groupType: string;
    }

    export interface IMenu extends IThing { }

    export interface IBattleSettings {
        nextCutscene: string;
        nextCutsceneSettings: string;
    }

    export interface IBattleInfo {
        exitDialog?: string | string[];
        items?: any;
        nextCutscene?: string;
        nextCutsceneSettings?: any;
        nextRoutine?: string;
        nextRoutineSettings?: any;
        opponent?: IBattleThingInfo;
        player?: IBattleThingInfo;
    }

    export interface IBattleInfoDefaults {
        exitDialog: string;
    }

    export interface IBattleThingInfo {
        actors: IActor[];
        category: string;
        hasActors?: boolean;
        name: string;
        selectedActor?: IActor;
        selectedIndex?: number;
        sprite: string;
    }

    export interface IActor {
        Attack: number;
        AttackNormal: number;
        Defense: number;
        DefenseNormal: number;
        EV: {
            Attack: number;
            Defense: number;
            Special: number;
            Speed: number;
        };
        HP: number;
        HPNormal: number;
        IV: {
            Attack: number;
            Defense: number;
            HP: number;
            Special: number;
            Speed: number;
        };
        Special: number;
        SpecialNormal: number;
        Speed: number;
        SpeedNormal: number;
        experience: IActorExperience;
        level: number;
        moves: IMove[];
        nickname: string;
        status: string;
        title: string;
        types: string[];
    }

    export interface IActorExperience {
        current: number;
        next: number;
        remaining: number;
    }

    export interface IMove {
        remaining: number;
        title: string;
    }

    export interface IBattleMovrSettings {
        GameStarter: IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
        battleMenuName: string;
        battleOptionNames: string;
        menuNames: string;
        defaults?: any;
        backgroundType?: string;
        positions?: any;
    }

    export interface IBattleMovr {
        getGameStarter(): IGameStartr;
        getThings(): { [i: string]: IThing };
        getThing(name: string): IThing;
        getBattleInfo(): IBattleInfo;
        getBackgroundType(): string;
        getBackgroundThing(): IThing;
        getInBattle(): boolean;
        startBattle(settings: IBattleSettings): void;
        closeBattle(callback?: () => void): void;
        showPlayerMenu(): void;
        setThing(name: string, title: string, settings?: any): IThing;
        openMovesMenu(): void;
        openItemsMenu(): void;
        openActorsMenu(callback: (settings: any) => void): void;
        playMove(choicePlayer: string): void;
        switchActor(battlerName: string, i: number): void;
        startBattleExit(): void;
        createBackground(): void;
        deleteBackground(): void;
    }
}
