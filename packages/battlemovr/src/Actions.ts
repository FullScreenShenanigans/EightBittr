import { Actor } from "./Actors";
import { TeamAndAction } from "./Teams";

/**
 * Animation for when a team performs a move action.
 *
 * @param teamAction   Team and action being performed.
 * @param onComplete   Callback for when the action is done.
 * @type TAction   Type of action being performed.
 */
export type OnAction<TAction extends Action> = (
    teamAction: TeamAndAction<TAction>,
    onComplete: () => void
) => void;

/**
 * Action animations, keyed by their type codes.
 */
export interface OnActions {
    /**
     * Action for a team attempting to leave the battle.
     */
    flee: OnAction<FleeAction>;

    /**
     * Action for a team using an item.
     */
    item: OnAction<ItemAction>;

    /**
     * Action for a team's selected actor using a move.
     */
    move: OnAction<MoveAction>;

    /**
     * Action for a team switching actors.
     */
    switch: OnAction<SwitchAction>;
}

/**
 * Titles of actions that a team may take in battle.
 */
export type ActionType = "flee" | "item" | "move" | "switch";

/**
 * A chosen action to be performed by a team in battle.
 */
export type Action = FleeAction | ItemAction | MoveAction | SwitchAction;

/**
 * Action for a team attempting to leave the battle.
 */
export interface FleeAction {
    /**
     * What type of action this is.
     */
    type: "flee";
}

/**
 * Action for a team using an item.
 */
export interface ItemAction {
    /**
     * Descriptor of the item being used.
     */
    item: string;

    /**
     * What type of action this is.
     */
    type: "item";
}

/**
 * Action for a team's selected actor using a move.
 */
export interface MoveAction {
    /**
     * Descriptor of the move being used.
     */
    move: string;

    /**
     * What type of action this is.
     */
    type: "move";
}

/**
 * Action for a team switching actors.
 */
export interface SwitchAction {
    /**
     * Another actor to bring out.
     */
    newActor: Actor;

    /**
     * What type of action this is.
     */
    type: "switch";
}
