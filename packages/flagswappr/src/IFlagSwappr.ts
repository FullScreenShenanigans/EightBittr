/**
 * Generations of swappable flags.
 */
export interface IGenerations<TFlags> {
    [i: string]: Partial<TFlags>;
}

/**
 * Settings to initialize a new instance of the FlagSwappr class.
 *
 * @type TFeatures   Generation-variant flags.
 */
export interface IFlagSwapprSettings<TFeatures> {
    /**
     * Groups of feature settings, in order.
     */
    generations: IGenerations<TFeatures>;

    /**
     * Starting generation to enable, if not the first keyed.
     */
    generation?: string;
}

/**
 * Swaps flags behind generational gaps.
 */
export interface IFlagSwappr<TFlags> {
    /**
     * Generation-variant flags.
     */
    readonly flags: TFlags;

    /**
     * Sets flags to a generation.
     *
     * @param generation   Generation for flag availability.
     */
    setGeneration(generationName: string): void;
}
