/**
 * A team actor that can participate in a battle.
 */
export interface Actor {
    /**
     * Battle moves the actor knows.
     */
    moves: Move[];

    /**
     * Textual name for the actor.
     */
    nickname: string[];

    /**
     * Battle attribute statistics.
     */
    statistics: Statistics;

    /**
     * Sprite title for the actor's Actor.
     */
    title: string[];
}

/**
 * Statistic attributes of an actor.
 */
export interface Statistics {
    /**
     * How much health the actor has.
     */
    health: Statistic;

    [i: string]: Statistic;
}

/**
 * An actor's knowledge of a battle move.
 */
export interface Move {
    /**
     * The name of the battle move.
     */
    title: string;

    /**
     * How many uses are remaining.
     */
    remaining: number;

    /**
     * How many total uses of this move are allowed.
     */
    uses: number;
}

/**
 * A single statistic for an actor.
 */
export interface Statistic {
    /**
     * Current in-battle value for the statistic.
     */
    current: number;

    /**
     * Normal value for the statistic.
     */
    normal: number;
}
