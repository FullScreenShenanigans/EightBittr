import { OnAction, OnActions, SwitchAction } from "./Actions";
import { OnIntroduction } from "./animators/Introductions";

/**
 * Descriptors of why a battle may finish.
 */
export enum BattleOutcome {
    /**
     * The opponent team fled.
     */
    opponentFled,

    /**
     * The player's team is out of usable actors.
     */
    opponentVictory,

    /**
     * The player team fled.
     */
    playerFled,

    /**
     * The opponent's team is out of usable actors.
     */
    playerVictory,

    /**
     * Both teams are out of usable actors.
     */
    tie,
}

/**
 * Animations for a team's battle activities.
 */
export interface TeamAnimations {
    /**
     * Action animations, keyed by their type names.
     */
    actions: OnActions;

    /**
     * Animation for when an actor's health changes.
     */
    healthChange: OnHealthChange;

    /**
     * Animation for a team introducting itself at the beginning of battle.
     */
    introduction: OnIntroduction;

    /**
     * Actor switching animations.
     */
    switching: SwitchingAnimations;
}

/**
 * Animations for various battle activities.
 */
export interface Animations {
    /**
     * Animation for when a battle is complete.
     */
    complete: OnBattleComplete;

    /**
     * Opponent team animations.
     */
    opponent: TeamAnimations;

    /**
     * Player team animations.
     */
    player: TeamAnimations;

    /**
     * Animation for a battle starting.
     */
    start: OnStart;
}

/**
 * Animation for when the battle is complete.
 *
 * @param outcome   Descriptor of what finished the battle.
 * @param onComplete   Callback for when it's safe to dispose of battle info.
 */
export type OnBattleComplete = (outcome: BattleOutcome, onComplete?: () => void) => void;

/**
 * Animation for when an actor's health changes.
 *
 * @param health   New value for the actor's health.
 * @param onComplete   Callback for when this is done.
 */
export type OnHealthChange = (health: number, onComplete: () => void) => void;

/**
 * Animation for a battle starting.
 *
 * @param onComplete   Callback for when this is done.
 */
export type OnStart = (onComplete: () => void) => void;

/**
 * Animations for actors switching positions.
 */
export interface SwitchingAnimations {
    /**
     * Animation for an actor entering battle.
     */
    enter: OnEnter;

    /**
     * Animation for an actor exiting battle.
     */
    exit: OnExit;

    /**
     * Animation for an actor getting knocked out.
     */
    knockout: OnKnockout;

    /**
     * Animations for actors switching positions.
     */
    switch: OnAction<SwitchAction>;
}

/**
 * Animation for when an actor enters battle.
 *
 * @param onComplete   Callback for when this is done.
 */
export type OnEnter = (onComplete: () => void) => void;

/**
 * Animation for when an actor exits battle.
 *
 * @param onComplete   Callback for when this is done.
 */
export type OnExit = (onComplete: () => void) => void;

/**
 * Animation for when an actor gets knocked out.
 *
 * @param onComplete   Callback for when this is done.
 */
export type OnKnockout = (onComplete: () => void) => void;
