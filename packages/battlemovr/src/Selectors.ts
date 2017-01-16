import { IAction } from "./Actions";
import { IBattleInfo } from "./Battles";
import { Team } from "./Teams";

/**
 * Callback for a selector choosing an action.
 * 
 * @param action   The chosen action.
 */
export interface IOnChoice {
    (action: IAction): void;
}

/**
 * Methods for a team to choose their next move.
 */
export interface ISelector {
    /**
     * Reacts to an actor getting knocked out.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    afterKnockout(battleInfo: IBattleInfo, team: Team, onComplete: () => void): void;

    /**
     * Determines the next action to take.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when an action is chosen.
     */
    nextAction(battleInfo: IBattleInfo, team: Team, onChoice: IOnChoice): void;
}

/**
 * Creates selectors of a single type.
 */
export interface ISelectorFactory {
    (): ISelector;
}

/**
 * Selector factories keyed by type name.
 */
export interface ISelectorFactories {
    [i: string]: ISelectorFactory;
}
