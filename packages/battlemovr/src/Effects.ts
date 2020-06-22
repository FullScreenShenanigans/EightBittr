/**
 * Which actor should be affected by a move's effect.
 */
export enum EffectTarget {
    /**
     * The attacking actor should be affected.
     */
    attacker,

    /**
     * The defending actor should be affected.
     */
    defender,
}

/**
 * Base description for a move.
 */
export interface IEffectBase {
    /**
     * Probability of the move occuring as a number in (0, 100], if not 100.
     */
    probability?: number;

    /**
     * Which actor should be affected by the move.
     */
    target: EffectTarget;
}

/**
 * Effect description for a battle move.
 */
export type IMoveEffect =
    | IDamageEffect
    | IStatisticEffect
    | IStatusEffect
    | ISwitchEffect;

/**
 * Move effect that deals damage.
 */
export interface IDamageEffect extends IEffectBase {
    /**
     * How much damage should be dealt.
     */
    damage: number;

    /**
     * What type of effect this is.
     */
    type: "damage";
}

/**
 * Move effect that changes a statistic.
 */
export interface IStatisticEffect extends IEffectBase {
    /**
     * How much the statistic should change.
     */
    change: number;

    /**
     * Which statistic is being affected.
     */
    statistic: string;

    /**
     * What type of effect this is.
     */
    type: "statistic";
}

/**
 * Move effect that applies a status.
 */
export interface IStatusEffect extends IEffectBase {
    /**
     * Which status is being applied.
     */
    status: string;

    /**
     * What type of effect this is.
     */
    type: "status";
}

/**
 * Move effect that switches actors.
 */
export interface ISwitchEffect extends IEffectBase {
    /**
     * Index of the actor replacing the current actor.
     */
    replacement: number;

    /**
     * What type of effect this is.
     */
    type: "switch";
}
