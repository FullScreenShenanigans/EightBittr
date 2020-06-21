import { IAction } from "../Actions";
import { IActionsOrderer, IUnderEachTeam, Team } from "../Teams";

import { Actions } from "./Actions";
import { Animator, IAnimatorSettings } from "./Animator";
import { Introductions } from "./Introductions";
import { Queue } from "./Queue";

/**
 * Root animator for a battle.
 */
export class Main extends Animator {
    /**
     * Animator for teams' actions.
     */
    private readonly actions: Actions = new Actions(this);

    /**
     * Animator for teams introducing themselves.
     */
    private readonly introductions: Introductions = new Introductions(this);

    /**
     * Orders teams' chosen actions.
     */
    private readonly actionsOrderer: IActionsOrderer;

    /**
     * Initializes a new instance of the Animator class.
     *
     * @param settings   Settings to be used for initialization.
     * @param actionsOrderer   Battle info for the battle.
     */
    public constructor(settings: IAnimatorSettings | Animator, actionsOrderer: IActionsOrderer) {
        super(settings);

        this.actionsOrderer = actionsOrderer;
    }

    /**
     * Starts the battle's gameplay.
     */
    public run(): void {
        const queue: Queue = new Queue();

        queue.add((next: () => void): void => {
            this.animations.start(next);
        });

        queue.add((next: () => void): void => {
            this.introductions.run(next);
        });

        queue.run((): void => {
            this.waitForActions();
        });
    }

    /**
     * Waits for actions from each team's selector.
     */
    private waitForActions(): void {
        const actions: Partial<IUnderEachTeam<IAction>> = {};
        let completed = 0;

        const onChoice = (): void => {
            completed += 1;
            if (completed === 2) {
                this.executeActions(actions as IUnderEachTeam<IAction>);
            }
        };

        this.battleInfo.teams.opponent.selector.nextAction(
            this.battleInfo,
            Team.opponent,
            (action: IAction): void => {
                actions[Team[Team.opponent]] = action;
                onChoice();
            });

        this.battleInfo.teams.player.selector.nextAction(
            this.battleInfo,
            Team.player,
            (action: IAction): void => {
                actions[Team[Team.player]] = action;
                onChoice();
            });
    }

    /**
     * Executes each team's chosen actions.
     *
     * @param actions   Chosen actions by the teams.
     */
    private executeActions(actions: IUnderEachTeam<IAction>): void {
        const queue: Queue = new Queue();

        for (const action of this.actionsOrderer(actions)) {
            queue.add((next: () => void): void => {
                this.actions.run(action, next);
            });
        }

        queue.run((): void => {
            this.waitForActions();
        });
    }
}
