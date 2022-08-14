/**
 * Generations of swappable flags.
 */
export type Generations<TFlags> = Record<string, Partial<TFlags>>;

/**
 * Settings to initialize a new instance of the FlagSwappr class.
 *
 * @template TFlags   Generation-variant flags.
 */
export interface FlagSwapprSettings<TFlags> {
    /**
     * Starting generation to enable, if not the first from generationNames.
     */
    generation?: string;

    /**
     * Ordered names of the available generations, if not Object.keys(generations).
     */
    generationNames?: string[];

    /**
     * Groups of feature settings, in order.
     */
    generations: Generations<TFlags>;
}
