import { IAction } from "./Actions";
import { IBattleInfo } from "./Battles";
import { Team } from "./Teams";

/**
 * Callback for a selector choosing an action.
 *
 * @param action   The chosen action.
 */
export type IOnChoice = (action: IAction) => void;

/**
 * Methods for a team to choose their next move.
 */
export interface ISelector {
    /**
     * Reacts to the selected actor having just been knocked out.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    afterKnockout(
        battleInfo: IBattleInfo,
        team: Team,
        onComplete: () => void
    ): void;

    /**
     * Determines the next action while there is still a selected actor.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when an action is chosen.
     */
    nextAction(battleInfo: IBattleInfo, team: Team, onChoice: IOnChoice): void;
}

/**
 * Creates action selectors for a type of team.
 */
export type ISelectorFactory = () => ISelector;

/**
 * Selector factories keyed by type name.
 */
export interface ISelectorFactories {
    [i: string]: ISelectorFactory | undefined;
}
