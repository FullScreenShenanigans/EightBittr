/**
 * A team actor that can participate in a battle.
 */
export interface IActor {
    /**
     * Battle moves the actor knows.
     */
    moves: IMove[];

    /**
     * Textual name for the actor.
     */
    nickname: string[];

    /**
     * Battle attribute statistics.
     */
    statistics: IStatistics;

    /**
     * Sprite title for the actor's Thing.
     */
    title: string[];
}

/**
 * Statistic attributes of an actor.
 */
export interface IStatistics {
    /**
     * How much health the actor has.
     */
    health: IStatistic;

    [i: string]: IStatistic;
}

/**
 * An actor's knowledge of a battle move.
 */
export interface IMove {
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
export interface IStatistic {
    /**
     * Current in-battle value for the statistic.
     */
    current: number;

    /**
     * Normal value for the statistic.
     */
    normal: number;
}
