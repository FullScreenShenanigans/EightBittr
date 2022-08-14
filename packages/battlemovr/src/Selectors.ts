import { Action } from "./Actions";
import { BattleInfo } from "./Battles";
import { TeamId } from "./Teams";

/**
 * Callback for a selector choosing an action.
 *
 * @param action   The chosen action.
 */
export type OnChoice = (action: Action) => void;

/**
 * Methods for a team to choose their next move.
 */
export interface Selector {
    /**
     * Reacts to the selected actor having just been knocked out.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param teamId   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    afterKnockout(battleInfo: BattleInfo, teamId: TeamId, onComplete: () => void): void;

    /**
     * Determines the next action while there is still a selected actor.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param teamId   Which team is selecting an action.
     * @param onChoice   Callback for when an action is chosen.
     */
    nextAction(battleInfo: BattleInfo, teamId: TeamId, onChoice: OnChoice): void;
}

/**
 * Creates action selectors for a type of team.
 */
export type SelectorFactory = () => Selector;

/**
 * Selector factories keyed by type name.
 */
export type SelectorFactories = Record<string, SelectorFactory | undefined>;
