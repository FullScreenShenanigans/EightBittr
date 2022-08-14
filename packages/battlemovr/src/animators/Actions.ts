import { Action, FleeAction, ItemAction, MoveAction, SwitchAction } from "../Actions";
import { TeamAnimations } from "../Animations";
import { TeamAndAction, TeamId } from "../Teams";
import { Animator } from "./Animator";

/**
 * Animator for teams' actions.
 */
export class Actions extends Animator {
    /**
     * Runs a team's action.
     *
     * @param teamAction    Action with the team that wants to execute it.
     * @param onComplete   Callback for when this is done.
     * @type TAction   Type of action being performed.
     */
    public run<TAction extends Action>(
        teamAction: TeamAndAction<TAction>,
        onComplete: () => void
    ): void {
        if (
            this.battleInfo.teams[TeamId[teamAction.source.team]].selectedActor !==
            teamAction.source.actor
        ) {
            onComplete();
            return;
        }

        const animations: TeamAnimations =
            teamAction.source.team === TeamId.opponent
                ? this.animations.opponent
                : this.animations.player;

        switch (teamAction.action.type) {
            case "flee":
                animations.actions.flee(teamAction as TeamAndAction<FleeAction>, onComplete);
                break;

            case "item":
                animations.actions.item(teamAction as TeamAndAction<ItemAction>, onComplete);
                break;

            case "move":
                animations.actions.move(teamAction as TeamAndAction<MoveAction>, onComplete);
                break;

            case "switch":
                animations.switching.switch(
                    teamAction as TeamAndAction<SwitchAction>,
                    onComplete
                );
                break;

            default:
                throw new Error(`Unkown action: '${(teamAction.action as Action).type}'.`);
        }
    }
}
