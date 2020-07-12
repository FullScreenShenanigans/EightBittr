import { IAnimations } from "./Animations";
import { ISelectorFactories } from "./Selectors";
import { IActionsOrderer } from "./Teams";

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
