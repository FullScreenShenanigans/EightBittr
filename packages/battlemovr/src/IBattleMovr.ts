import { GameStartr } from "gamestartr/lib/GameStartr";
import { IThing } from "gamestartr/lib/IGameStartr";
import { IMenuDialogRaw, IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { ICutsceneSettings } from "sceneplayr/lib/IScenePlayr";

/**
 * Description of a menu available during battle.
 */
export interface IBattleOption {
    /**
     * A callback that opens the menu.
     */
    callback: () => void;

    /**
     * Text displayed in the options menu.
     */
    text: IMenuDialogRaw;
}

/**
 * Names of known MenuGraphr menus.
 */
export interface IMenuNames {
    /**
     * The primary backdrop battle menu.
     */
    battle: string;

    /**
     * The initial display when a battle starts.
     */
    battleDisplayInitial: string;

    /**
     * The player's options menu.
     */
    player: string;

    /**
     * General dialog text container.
     */
    generalText: string;
}

/**
 * Positions of in-battle Things, keyed by name.
 */
export interface IPositions {
    [i: string]: IPosition;
}

/**
 * Position of an in-battle Thing.
 */
export interface IPosition {
    /**
     * The Thing's left.
     */
    left?: number;

    /**
     * The Thing's top.
     */
    top?: number;
}

/**
 * A container for all in-battle Things.
 */
export interface IThingsContainer {
    /**
     * Any initial battle display menu.
     */
    menu?: IThing;

    [i: string]: IThing | undefined;
}

/**
 * Default settings for running a battle.
 */
export interface IBattleInfoDefaults {
    /**
     * A dialog to display after the battle.
     */
    exitDialog?: IMenuDialogRaw;

    /**
     * A next cutscene to play after the battle.
     */
    nextCutscene?: string;

    /**
     * Any settings for the next cutscene.
     */
    nextCutsceneSettings?: ICutsceneSettings;

    /**
     * A next routine to play in a next cutscene.
     */
    nextRoutine?: string;

    /**
     * Any settings for the next cutscene's routine.
     */
    nextRoutineSettings?: any;

    [i: string]: any;
}

/**
 * Settings for running a battle.
 */
export interface IBattleInfo extends IBattleInfoDefaults {
    /**
     * The players controlling battling actors.
     */
    battlers: IBattlers;
}

/**
 * In-battle players controlling battling actors.
 */
export interface IBattlers {
    /**
     * The opponent battler's information.
     */
    opponent?: IBattler;

    /**
     * The player's battle information.
     */
    player?: IBattler;

    [i: /* "opponent" | "player" | */ string]: IBattler | undefined;
}

/**
 * An in-battle player.
 */
export interface IBattler {
    /**
     * Actors that may be sent out to battle.
     */
    actors?: IActor[];

    /**
     * The game-specific category of fighter, such as "Trainer" or "Wild".
     */
    category: string;

    /**
     * Whether the player has actors, rather than fighting alone.
     */
    hasActors?: boolean;

    /**
     * The name of the player.
     */
    name: string[];

    /**
     * Which actor is currently selected to battle, if any.
     */
    selectedActor?: IActor;

    /**
     * The index of the currently selected actor, if any.
     */
    selectedIndex?: number;

    /**
     * A sprite name to send out to battle.
     */
    sprite: string;
}

/**
 * An actor that may be sent out in battle.
 */
export interface IActor {
    /**
     * Experience points for leveling up.
     */
    experience: IActorExperience;

    /**
     * The actor's current level.
     */
    level: number;

    /**
     * Moves the actor knows.
     */
    moves: IMove[];

    /**
     * The primary title of the actor.
     */
    title: string[];
}

/**
 * An actor's experience points for leveling up.
 */
export interface IActorExperience {
    /**
     * Current amount of experience points.
     */
    current: number;

    /**
     * How many experience points are needed for the next level.
     */
    next: number;
}

/**
 * An actor's knowledge of a battle move.
 */
export interface IMove {
    /**
     * The name of the battle move.
     */
    title: string;

    /**
     * How many uses are remaining.
     */
    remaining: number;

    /**
     * How many total uses of this move are allowed.
     */
    uses: number;
}

/**
 * Settings to initialize a new IBattleMovr instance.
 */
export interface IBattleMovrSettings {
    /**
     * The IGameStartr providing Thing and actor information.
     */
    gameStarter: GameStartr;

    /**
     * In-game menu and dialog creation and management for GameStartr.
     */
    menuGrapher: IMenuGraphr;

    /**
     * Names of known MenuGraphr menus.
     */
    menuNames: IMenuNames;

    /**
     * Option menus the player may select during battle.
     */
    battleOptions: IBattleOption[];

    /**
     * Default settings for running battles.
     */
    defaults?: IBattleInfoDefaults;

    /**
     * Default positions of in-battle Things.
     */
    positions?: IPositions;

    /**
     * The type of Thing to create and use as a background.
     */
    backgroundType?: string;
}

/**
 * A driver for RPG-like battles between two collections of actors.
 */
export interface IBattleMovr {
    /**
     * The IGameStartr providing Thing and actor information.
     */
    readonly gameStarter: GameStartr;

    /**
     * In-game menu and dialog creation and management for GameStartr.
     */
    readonly menuGrapher: IMenuGraphr;

    /**
     * @returns Names of known MenuGraphr menus.
     */
    getMenuNames(): IMenuNames;

    /**
     * @returns Default settings for running battles.
     */
    getDefaults(): IBattleInfoDefaults;

    /**
     * @returns All in-battle Things.
     */
    getThings(): IThingsContainer;

    /**
     * @param name   A name of an in-battle Thing.
     * @returns The named in-battle Thing.
     */
    getThing(name: string): IThing | undefined;

    /**
     * @returns Current settings for a running battle.
     */
    getBattleInfo(): IBattleInfo;

    /**
     * @returns Whether a battle is currently happening.
     */
    getInBattle(): boolean;

    /**
     * @returns The type of Thing to create and use as a background.
     */
    getBackgroundType(): string | undefined;

    /**
     * @returns The created Thing used as a background.
     */
    getBackgroundThing(): IThing | undefined;

    /**
     * Starts a battle.
     * 
     * @param settings   Settings for running the battle.
     */
    startBattle(settings: IBattleInfo): void;

    /**
     * Closes any current battle.
     * 
     * @param callback   A callback to run after the battle is closed.
     * @remarks The callback will run after deleting menus but before the next cutscene.
     */
    closeBattle(callback?: () => void): void;

    /**
     * Shows the player menu.
     */
    showPlayerMenu(): void;

    /**
     * Creates and displays an in-battle Thing.
     * 
     * @param name   The storage name of the Thing.
     * @param title   The Thing's in-game type.
     * @param settings   Any additional settings to create the Thing.
     * @returns The created Thing.
     */
    setThing(name: string, title: string, settings?: any): IThing;

    /**
     * Starts a round of battle with a player's move.
     * 
     * @param choicePlayer   The player's move choice.
     * @param choiceOpponent   The opponent's move choice.
     * @parma playerMovesFirst   Whether the player should move first.
     */
    playMove(choicePlayer: string, choiceOpponent: string, playerMovesFirst: boolean): void;

    /**
     * Switches a battler's actor.
     * 
     * @param battlerName   The name of the battler.
     */
    switchActor(battlerName: "player" | "opponent", i: number): void;

    /**
     * Creates the battle background.
     * 
     * @param type   A type of background, if not the default.
     */
    createBackground(type?: string): void;

    /**
     * Deletes the battle background.
     */
    deleteBackground(): void;
}
