/**
 * A container of transform Functions, referenced by their keys.
 */
export interface ITransforms {
    [i: string]: ITransform;
}

/**
 * A transformation Function to apply to input.
 *
 * @param data   The raw input data to be transformed.
 * @param key   They key under which the data is to be stored.
 * @param attributes   Any extra attributes to be given to the transforms.
 * @returns The input data, transformed.
 * @remarks All the parameters after data are listed as optional, but they
 *          will be passed in by the calling ChangeLinr.
 */
export type ITransform = (data: any, key?: string, attributes?: any) => any;

/**
 * Cached storage for outputs of transformations, keyed by their request key.
 */
export interface ICache {
    [i: string]: any;
}

/**
 * Complete cached storage for transforms, keyed by their request key to
 * a mapping of transforms to results.
 */
export interface ICacheFull {
    [i: string]: {
        [j: string]: any;
    };
}

/**
 * Settings to initialize a new instance of an IChangeLinr.
 */
export interface IChangeLinrSettings {
    /**
     * Transformation functions to be applied to inputs.
     */
    transforms: ITransforms;

    /**
     * The order to apply transformation functions to inputs.
     */
    pipeline: string[];

    /**
     * Whether a cache should be created of transformation results.
     */
    doMakeCache?: boolean;

    /**
     * Whether cache results should be used for computations.
     */
    doUseCache?: boolean;
}
