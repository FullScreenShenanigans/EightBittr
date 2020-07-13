import { ITransform } from "./types";

/**
 * Binds a series of transforms into a single transform.
 *
 * @param transforms   Ordered transforms to apply to inputs.
 * @returns Equivalent transform to piping all transforms in order.
 */
export const bindTransforms = (transforms: ITransform[]): ITransform => {
    const cache: Record<string, any> = {};

    /**
     * Applies a series of transforms to input data. If doMakeCache is on, the
     * outputs of this are stored in cache and cacheFull.
     *
     * @param data   The data to be transformed.
     * @param key   The key under which the data is to be stored. If needed
     *              for caching but not provided, defaults to data.
     * @param attributes   Any extra attributes to be given to transforms.
     * @returns The final output of the pipeline.
     */
    return (data: any, key: string, attributes: any) => {
        // If this keyed input was already processed, get that
        if ({}.hasOwnProperty.call(cache, key)) {
            return cache[key];
        }

        // Apply each transform in order
        for (const transform of transforms) {
            data = transform(data, key, attributes);
        }

        cache[key] = data;

        return data;
    };
};
