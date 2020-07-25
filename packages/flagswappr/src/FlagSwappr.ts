import { FlagSwapprSettings, Generations } from "./types";

/**
 * Gates feature flags behind generational gaps.
 *
 * @template TFlags   Generation-variant flags.
 */
export class FlagSwappr<TFlags> {
    /**
     * Generation-variant flags.
     */
    public get flags(): TFlags {
        return this.cachedFlags;
    }

    /**
     * Groups of flag settings, in order.
     */
    private readonly generations: Generations<TFlags>;

    /**
     * Names of the available flag generations.
     */
    private readonly generationNames: string[];

    /**
     * Flag availabilities cached by this.setGeneration.
     */
    private cachedFlags: TFlags;

    /**
     * Initializes a new instance of the FlagSwappr class.
     *
     * @param settings  Settings to be used for initialization.
     */
    public constructor(settings: FlagSwapprSettings<TFlags>) {
        this.generations = settings.generations;
        this.generationNames =
            settings.generationNames === undefined
                ? Object.keys(this.generations)
                : settings.generationNames;

        if (settings.generation === undefined) {
            this.setGeneration(this.generationNames[0]);
        } else {
            this.setGeneration(settings.generation);
        }
    }

    /**
     * Sets flags to a generation.
     *
     * @param generation   Generation for flag setting.
     */
    public setGeneration(generationName: string): void {
        const indexOf: number = this.generationNames.indexOf(generationName);
        if (indexOf === -1) {
            throw new Error(`Unknown generation: '${generationName}'.`);
        }

        const matchedFlags: Partial<TFlags> = {};

        for (let i = 0; i <= indexOf; i += 1) {
            const generation = this.generations[this.generationNames[i]];

            for (const flagName in generation) {
                matchedFlags[flagName] = generation[flagName];
            }
        }

        this.cachedFlags = matchedFlags as TFlags;
    }
}
