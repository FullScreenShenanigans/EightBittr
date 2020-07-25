import { Action } from "./Actions";
import { Actor } from "./Actors";
import { Selector } from "./Selectors";

/**
 * Descriptor for a team.
 */
export enum TeamId {
    /**
     * The opponent's team.
     */
    opponent,

    /**
     * The player's team.
     */
    player,
}

/**
 * Data storage for something each team has.
 *
 * @type T   Data stored for each team.
 */
export interface UnderEachTeam<T> {
    /**
     * Opponent value for the data.
     */
    opponent: T;

    /**
     * Player value for the data.
     */
    player: T;

    [i: string /* "opponent" | "player" */]: T;
}

/**
 * Common attributes for teams of actors.
 */
export interface TeamBase {
    /**
     * Actors that will fight.
     */
    actors: Actor[];

    /**
     * Character appearing to direct the actors.
     */
    leader?: TeamLeader;
}

/**
 * External descriptor of a team of actors to be engaged in battle.
 */
export interface TeamDescriptor extends TeamBase {
    /**
     * How the team chooses their actions.
     */
    selector: string;
}

/**
 * A team of actors engaged in battle.
 */
export interface Team extends TeamBase {
    /**
     * How the team chooses their actions.
     */
    selector: Selector;
}

/**
 * A player or NPC leading a battle team.
 */
export interface TeamLeader {
    /**
     * Textual name for the leader.
     */
    nickname: string[];

    /**
     * Sprite title for the leader's Actor.
     */
    title: string[];
}

/**
 * A team and actor for an action.
 */
export interface TeamAndActor {
    /**
     * The team's selected actor.
     */
    actor: Actor;

    /**
     * The team.
     */
    team: TeamId;
}

/**
 * An action with the team that wants to execute it.
 *
 * @type TAction   Type of action being performed.
 */
export interface TeamAndAction<TAction extends Action> {
    /**
     * Action chosen by the team.
     */
    action: TAction;

    /**
     * Team and actor that chose the action.
     */
    source: TeamAndActor;

    /**
     * Team and actor being targeted.
     */
    target: TeamAndActor;
}

/**
 * Orders teams' chosen actions.
 *
 * @param actions   Actions chosen by each team.
 * @returns Team actions ordered for battle.
 */
export type ActionsOrderer = (actions: UnderEachTeam<Action>) => TeamAndAction<Action>[];
