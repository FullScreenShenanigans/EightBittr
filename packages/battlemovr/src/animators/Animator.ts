import { Animations } from "../Animations";
import { BattleInfo } from "../Battles";

/**
 * Settings to initialize a new instance of the Animator class.
 */
export interface AnimatorSettings {
    /**
     * Animations for various battle activities.
     */
    readonly animations: Animations;

    /**
     * Battle info for the battle.
     */
    readonly battleInfo: BattleInfo;
}

/**
 * Runs battle animations.
 */
export abstract class Animator {
    /**
     * Animations for various battle activities.
     */
    public readonly animations: Animations;

    /**
     * Battle info for the battle.
     */
    public readonly battleInfo: BattleInfo;

    /**
     * Initializes a new instance of the Animator class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: AnimatorSettings | Animator) {
        this.animations = settings.animations;
        this.battleInfo = settings.battleInfo;
    }
}
