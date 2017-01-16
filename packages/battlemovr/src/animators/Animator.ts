import { IAnimations } from "../Animations";
import { IBattleInfo } from "../Battles";

/**
 * Settings to initialize a new instance of the Animator class.
 */
export interface IAnimatorSettings {
    /**
     * Animations for various battle activities.
     */
    readonly animations: IAnimations;

    /**
     * Battle info for the battle.
     */
    readonly battleInfo: IBattleInfo;
}

/**
 * Runs battle animations.
 */
export abstract class Animator {
    /**
     * Animations for various battle activities.
     */
    public readonly animations: IAnimations;

    /**
     * Battle info for the battle.
     */
    public readonly battleInfo: IBattleInfo;

    /**
     * Initializes a new instance of the Animator class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IAnimatorSettings | Animator) {
        this.animations = settings.animations;
        this.battleInfo = settings.battleInfo;
    }
}
