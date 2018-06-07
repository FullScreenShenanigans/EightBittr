/**
 * Generations of swappable flags.
 */
export interface IGenerations<TFlags> {
    [i: string]: Partial<TFlags>;
}

/**
 * Settings to initialize a new instance of the FlagSwappr class.
 *
 * @template TFlags   Generation-variant flags.
 */
export interface IFlagSwapprSettings<TFlags> {
    /**
     * Starting generation to enable, if not the first from generationNames.
     */
    generation?: keyof TFlags;

    /**
     * Ordered names of the available generations, if not Object.keys(generations).
     */
    generationNames?: (keyof TFlags)[];

    /**
     * Groups of feature settings, in order.
     */
    generations: IGenerations<TFlags>;
}

/**
 * Gates feature flags behind generational gaps.
 */
export interface IFlagSwappr<TFlags> {
    /**
     * Generation-variant flags.
     */
    readonly flags: TFlags;

    /**
     * Sets flags to a generation.
     *
     * @param generation   Generation for flag setting.
     */
    setGeneration(generationName: keyof TFlags): void;
}
