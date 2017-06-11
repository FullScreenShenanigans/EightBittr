import { IFlagSwappr, IFlagSwapprSettings, IGenerations } from "./IFlagSwappr";

/**
 * Creates a get-only version of a matched flags object.
 *
 * @type TFlags   Generation-variant flags.
 * @param matchedFlags   Matched flags for a generation.
 * @returns A get-only version of the matched flags object.
 */
const generateGettableFlags = <TFlags>(matchedFlags: Partial<TFlags>): TFlags => {
    const flags = {} as TFlags;

    for (const flagName in matchedFlags) {
        Object.defineProperty(flags, flagName, {
            get() {
                return matchedFlags[flagName];
            },
            enumerable: true
        });
    }

    return flags;
};

/**
 * Swaps flags behind generational gaps.
 *
 * @type TFlags   Generation-variant flags.
 */
export class FlagSwappr<TFlags> implements IFlagSwappr<TFlags> {
    /**
     * Generation-variant flags.
     */
    public get flags(): TFlags {
        return this.cachedFlags;
    }

    /**
     * Groups of flag settings, in order.
     */
    private readonly generations: IGenerations<TFlags>;

    /**
     * Names of the available flag generations.
     */
    private readonly generationNames: string[];

    /**
     * Flag availabilities cached by this.reset.
     */
    private cachedFlags: TFlags;

    /**
     * Initializes a new instance of the FlagSwappr class.
     *
     * @param settings  Settings to be used for initialization.
     */
    public constructor(settings: IFlagSwapprSettings<TFlags>) {
        this.generations = settings.generations;
        this.generationNames = Object.keys(this.generations);

        this.setGeneration(settings.generation || Object.keys(this.generations)[0]);
    }

    /**
     * Sets flags to a generation.
     *
     * @param generation   Generation for flag availability.
     */
    public setGeneration(generationName: string): void {
        const indexOf: number = this.generationNames.indexOf(generationName);

        if (indexOf === -1) {
            throw new Error(`Unknown generation: '${generationName}'.`);
        }

        const matchedFlags: Partial<TFlags> = {};

        for (let i: number = 0; i <= indexOf; i += 1) {
            const generation = this.generations[this.generationNames[i]];

            for (const flagName in generation) {
                matchedFlags[flagName] = generation[flagName];
            }
        }

        this.cachedFlags = generateGettableFlags(matchedFlags);
    }
}
