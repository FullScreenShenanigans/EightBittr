declare module BattleMovr {
    export interface IPosition {
        left?: number;
        top?: number;
    }

    export interface IThingsContainer {
        [i: string]: IThing;
        menu ?: IThing;
    }

    export interface IThing extends GameStartr.IThing { }

    export interface IMenu extends IThing { }

    export interface IBattleSettings {
        nextCutscene: string;
        nextCutsceneSettings: string;
    }

    export interface IBattleInfo {
        exitDialog: string;
        items: any;
        nextCutscene?: string;
        nextCutsceneSettings?: any;
        nextRoutine?: string;
        nextRoutineSettings?: any;
        opponent: IBattleThingInfo;
        player: IBattleThingInfo;
    }

    export interface IBattleInfoDefaults {
        exitDialog: string;
    }

    export interface IBattleThingInfo {
        actors: IActor[];
        category: string;
        hasActors: boolean;
        name: string;
        selectedActor: IActor;
        selectedIndex: number;
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
        title: string;
        remaining: number;
    }

    export interface IBattleMovrSettings {
        GameStarter: GameStartr.IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
        battleMenuName: string;
        battleOptionNames: string;
        menuNames: string;
        defaults?: any;
        backgroundType?: string;
        positions?: any;
    }

    export interface IBattleMovr {

    }
}
