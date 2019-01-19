import { IActor } from "./Actors";
import { BattleOutcome, IAnimations } from "./Animations";
import { IBattleInfo, IBattleOptions } from "./Battles";
import { ISelectorFactories } from "./Selectors";
import { IActionsOrderer, Team } from "./Teams";

/**
 * Settings to initialize a new IBattleMovr.
 */
export interface IBattleMovrSettings {
    /**
     * Orders teams' chosen actions.
     */
    actionsOrderer: IActionsOrderer;

    /**
     * Animations for various battle activities.
     */
    animations: IAnimations;

    /**
     * Selector factories keyed by type name.
     */
    selectorFactories: ISelectorFactories;
}

/**
 * Drives RPG-like battles between two teams of actors.
 */
export interface IBattleMovr {
    /**
     * Gets whether there is a current battle.
     *
     * @returns Whether there is a current battle.
     */
    inBattle(): boolean;

    /**
     * Gets battle info for the current battle.
     *
     * @returns Battle info for the current battle.
     */
    getBattleInfo(): IBattleInfo;

    /**
     * Starts a new battle.
     *
     * @param options   Options to start the battle.
     * @returns Battle info for the new battle.
     */
    startBattle(options: IBattleOptions): IBattleInfo;

    /**
     * Stops the current battle.
     *
     * @param outcome   Why the battle stopped.
     * @param onComplete   Callback for when this is done.
     */
    stopBattle(outcome: BattleOutcome, onComplete?: () => void): void;

    /**
     * Switches the selected actor for a team.
     *
     * @param team   Team switching actors.
     * @param newActor   New selected actor for the team.
     */
    switchSelectedActor(team: Team, newActor: IActor): void;
}
