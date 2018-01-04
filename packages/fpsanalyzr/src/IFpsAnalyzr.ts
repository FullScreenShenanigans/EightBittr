/**
 * Highest and lowest computed FPS.
 */
export interface IExtremes {
    /**
     * Lowest computed FPS.
     */
    lowest: number;

    /**
     * Highest computed FPS.
     */
    highest: number;
}

/**
 * Generates a current timestamp, such as performance.now.
 */
export type ITimestampGetter = () => number;

/**
 * Settings to initialize a new IFPSAnalyzr.
 */
export interface IFpsAnalyzrSettings {
    /**
     * A Function to generate a current timestamp, such as performance.now.
     */
    getTimestamp?: ITimestampGetter;

    /**
     * How many FPS measurements to keep at any given time, at most.
     */
    maximumKept?: number;
}

/**
 * Storage and analysis for framerate measurements.
 */
export interface IFpsAnalyzr {
    /**
     * Records a frame tick.
     */
    tick(): void;

    /**
     * Gets the average computed FPS.
     *
     * @returns Average computed FPS.
     */
    getAverage(): number;

    /**
     * Gets the highest and lowest computed FPS.
     *
     * @returns Highest and lowest computed FPS.
     */
    getExtremes(): IExtremes;

    /**
     * Gets the median computed FPS.
     *
     * @returns Median computed FPS.
     */
    getMedian(): number;

    /**
     * Gets how many ticks have been recorded in total.
     *
     * @returns Total number of recorded ticks.
     */
    getRecordedTicks(): number;
}
