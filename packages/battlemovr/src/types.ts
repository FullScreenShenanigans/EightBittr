import { Animations } from "./Animations";
import { SelectorFactories } from "./Selectors";
import { ActionsOrderer } from "./Teams";

/**
 * Settings to initialize a new BattleMovr.
 */
export interface BattleMovrSettings {
    /**
     * Orders teams' chosen actions.
     */
    actionsOrderer: ActionsOrderer;

    /**
     * Animations for various battle activities.
     */
    animations: Animations;

    /**
     * Selector factories keyed by type name.
     */
    selectorFactories: SelectorFactories;
}
