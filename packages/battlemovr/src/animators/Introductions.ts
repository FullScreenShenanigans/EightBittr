import { IUnderEachTeam } from "../Teams";
import { Animator } from "./Animator";
import { Queue } from "./Queue";

/**
 * Animation for a team introducing themselves.
 * 
 * @param onComplete   Callback for when the animation is done.
 */
export interface IOnIntroduction {
    (onComplete: () => void): void;
}

/**
 * Animations for teams introducing themselves.
 */
export interface IIntroductionAnimations extends IUnderEachTeam<IOnIntroduction> { }

/**
 * Animator for teams introducing themselves.
 */
export class Introductions extends Animator {
    /**
     * Runs the animations.
     * 
     * @param onComplete   Handler for when the animations are done.
     */
    public run(onComplete: () => void): void {
        const queue: Queue = new Queue();

        queue.add((next: () => void): void => {
            this.animations.opponent.introduction(next);
        });

        queue.add((next: () => void): void => {
            this.animations.player.introduction(next);
        });

        queue.add((next: () => void): void => {
            this.animations.opponent.switching.enter(next);
        });

        queue.add((next: () => void): void => {
            this.animations.player.switching.enter(next);
        });

        queue.run(onComplete);
    }
}
