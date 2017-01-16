import { IAction, IFleeAction, IItemAction, IMoveAction, ISwitchAction } from "../Actions";
import { ITeamAnimations } from "../Animations";
import { ITeamAndAction, Team } from "../Teams";
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
    public run<TAction extends IAction>(teamAction: ITeamAndAction<TAction>, onComplete: () => void): void {
        if (this.battleInfo.teams[Team[teamAction.source.team]].selectedActor !== teamAction.source.actor) {
            onComplete();
            return;
        }

        const animations: ITeamAnimations = teamAction.source.team === Team.opponent
            ? this.animations.opponent
            : this.animations.player;

        switch (teamAction.action.type) {
            case "flee":
                animations.actions.flee(teamAction as ITeamAndAction<IFleeAction>, onComplete);
                break;

            case "item":
                animations.actions.item(teamAction as ITeamAndAction<IItemAction>, onComplete);
                break;

            case "move":
                animations.actions.move(teamAction as ITeamAndAction<IMoveAction>, onComplete);
                break;

            case "switch":
                animations.switching.switch(teamAction as ITeamAndAction<ISwitchAction>, onComplete);
                break;

            default:
                throw new Error(`Unkown action: '${(teamAction.action as IAction).type}'.`);
        }
    }
}
