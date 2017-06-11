export interface IGenerations<TFeatures> {
    [i: string]: Partial<TFeatures>;
}

/**
 * Settings to initialize a new instance of the FeatureBoxr class.
 *
 * @type TFeatures   Generation-variant features.
 */
export interface IFeatureBoxrSettings<TFeatures> {
    /**
     * Groups of feature settings, in order.
     */
    generations: IGenerations<TFeatures>;

    /**
     * Starting generation to enable, if not the first keyed.
     */
    generation?: string;
}

export interface IFeatureBoxr<TFeatures> {
    readonly features: TFeatures;

    setGeneration(generationName: string): void;
}
