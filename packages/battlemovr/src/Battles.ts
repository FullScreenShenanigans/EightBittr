import { IAction } from "./Actions";
import { IActor } from "./Actors";
import { ITeam, ITeamDescriptor, IUnderEachTeam, Team } from "./Teams";

/**
 * Options to start a battle.
 */
export interface IBattleOptions {
    /**
     * Opposing teams in the battle.
     */
    teams: IUnderEachTeam<ITeamDescriptor>;
}

/**
 * State for an ongoing battle.
 */
export interface IBattleInfo {
    /**
     * What each team has decided to do, if anything yet.
     */
    choices: Partial<IUnderEachTeam<IAction | undefined>>;

    /**
     * Which team is currently acting, if either.
     */
    currentTurn?: Team;

    /**
     * Opposing teams in the battle.
     */
    teams: IUnderEachTeam<IBattleTeam>;
}

/**
 * Extended team information during a battle.
 */
export interface IBattleTeam extends ITeam {
    /**
     * Original (immutable) order of actors in the current battle.
     */
    readonly orderedActors: IActor[];

    /**
     * Currently selected actor.
     */
    selectedActor: IActor;

    /**
     * Index of the currently selected actor.
     */
    selectedIndex: number;
}
