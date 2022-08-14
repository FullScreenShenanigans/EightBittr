import { Action } from "./Actions";
import { Actor } from "./Actors";
import { Team, TeamDescriptor, TeamId, UnderEachTeam } from "./Teams";

/**
 * Options to start a battle.
 */
export interface BattleOptions {
    /**
     * Opposing teams in the battle.
     */
    teams: UnderEachTeam<TeamDescriptor>;
}

/**
 * State for an ongoing battle.
 */
export interface BattleInfo {
    /**
     * What each team has decided to do, if anything yet.
     */
    choices: Partial<UnderEachTeam<Action | undefined>>;

    /**
     * Which team is currently acting, if either.
     */
    currentTurn?: TeamId;

    /**
     * Opposing teams in the battle.
     */
    teams: UnderEachTeam<BattleTeam>;
}

/**
 * Extended team information during a battle.
 */
export interface BattleTeam extends Team {
    /**
     * Original (immutable) order of actors in the current battle.
     */
    readonly orderedActors: Actor[];

    /**
     * Currently selected actor.
     */
    selectedActor: Actor;

    /**
     * Index of the currently selected actor.
     */
    selectedIndex: number;
}
