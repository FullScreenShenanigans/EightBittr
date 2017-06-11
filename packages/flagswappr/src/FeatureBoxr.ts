import { IFeatureBoxr, IFeatureBoxrSettings, IGenerations } from "./IFeatureBoxr";

/**
 * Creates a get-only version of a matched features object.
 *
 * @type TFeatures   Generation-variant features.
 * @param matchedFeatures   Matched features for a generation.
 * @returns A get-only version of the matched features object.
 */
const generateGettableFeatures = <TFeatures>(matchedFeatures: Partial<TFeatures>): TFeatures => {
    const features = {} as TFeatures;

    for (const featureName in matchedFeatures) {
        Object.defineProperty(features, featureName, {
            get() {
                return matchedFeatures[featureName];
            }
        });
    }

    return features;
};

/**
 * Gates features behind generational gaps.
 *
 * @type TFeatures   Generation-variant features.
 */
export class FeatureBoxr<TFeatures> implements IFeatureBoxr<TFeatures> {
    /**
     * Generation-variant features.
     */
    public get features(): TFeatures {
        return this.cachedFeatures;
    }

    /**
     * Groups of feature settings, in order.
     */
    private readonly generations: IGenerations<TFeatures>;

    /**
     * Names of the available feature boxes.
     */
    private readonly generationNames: string[];

    /**
     * Feature availabilities cached by this.reset.
     */
    private cachedFeatures: TFeatures;

    /**
     * Initializes a new instance of the FeatureBoxr class.
     *
     * @param settings  Settings to be used for initialization.
     */
    public constructor(settings: IFeatureBoxrSettings<TFeatures>) {
        this.generations = settings.generations;
        this.generationNames = Object.keys(this.generations);

        this.setGeneration(settings.generation || Object.keys(this.generations)[0]);
    }

    /**
     * Sets features to a generation.
     *
     * @param generation   Generation for feature availability.
     */
    public setGeneration(generationName: string): void {
        const indexOf: number = this.generationNames.indexOf(generationName);

        if (indexOf === -1) {
            throw new Error(`Unknown generation: '${generationName}'.`);
        }

        const matchedFeatures: Partial<TFeatures> = {};

        for (let i: number = 0; i <= indexOf; i += 1) {
            const generation = this.generations[this.generationNames[i]];

            for (const featureName in generation) {
                matchedFeatures[featureName] = generation[featureName];
            }
        }

        this.cachedFeatures = generateGettableFeatures(matchedFeatures);
    }
}
