/**
 * Highest and lowest computed FPS.
 */
export interface Extremes {
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
 * Settings to initialize a new IFPSAnalyzr.
 */
export interface FpsAnalyzrSettings {
    /**
     * How many FPS measurements to keep at any given time, at most.
     */
    maximumKept?: number;
}
