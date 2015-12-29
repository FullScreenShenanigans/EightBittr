declare module ChangeLinr {
    /**
     * A container of transform Functions, referenced by their keys.
     */
    export interface IChangeLinrTransforms {
        [i: string]: IChangeLinrTransform;
    }

    /**
     * A transformation Function to apply to input.
     * 
     * @param data   The raw input data to be transformed.
     * @param [key]   They key under which the data is to be stored.
     * @param [attributes]   Any extra attributes to be given to the transforms.
     * @param [scope]   The ChangeLinr calling the transformation.
     * @returns The input data, transformed.
     * @remarks All the parameters after data are listed as optional, but they 
     *          will be passed in by the calling ChangeLinr.
     */
    export interface IChangeLinrTransform {
        (data: any, key?: string, attributes?: any, scope?: IChangeLinr): any;
    }

    /**
     * Cached storage for outputs of transformations, keyed by their request key.
     */
    export interface IChangeLinrCache {
        [i: string]: any;
    }

    /**
     * Complete cached storage for transforms, keyed by their request key to
     * a mapping of transforms to results.
     */
    export interface IChangeLinrCacheFull {
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
        transforms: IChangeLinrTransforms;

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

    /**
     * A general utility class for transforming raw input to processed output. 
     * Transformation functions for inputs are kept along with an order.
     */
    export interface IChangeLinr {
        /**
         * @returns The cached output of this.process and this.processFull.
         */
        getCache(): IChangeLinrCache;

        /**
         * @param key   The key under which the output was processed
         * @returns The cached output filed under the given key.
         */
        getCached(key: string): any;

        /**
         * @returns A complete listing of the cached outputs from all 
         *          processed information, from each pipeline transform.
         */
        getCacheFull(): IChangeLinrCacheFull;

        /**
         * @returns Whether the cache object is being kept.
         */
        getDoMakeCache(): boolean;

        /**
         * @returns Whether previously cached output is being used in new
         *          process requests.
         */
        getDoUseCache(): boolean;

        /**
         * Applies a series of transforms to input data. If doMakeCache is on, the
         * outputs of this are stored in cache and cacheFull.
         * 
         * @param data   The data to be transformed.
         * @param [key]   They key under which the data is to be stored.
         *                If needed but not provided, defaults to data.
         * @param [attributes]   Any extra attributes to be given to the
         *                       transform Functions.
         * @returns The final output of the pipeline.
         */
        process(data: any, key?: string, attributes?: any): any;

        /**
         * A version of this.process that returns the complete output from each 
         * pipelined transform Function in an Object.
         * 
         * @param data   The data to be transformed.
         * @param key   They key under which the data is to be stored.
         * @param [attributes]   Any extra attributes to be given to the transforms.
         * @returns The final output of the transforms.
         */
        processFull(data: any, key: string, attributes?: any): any;
    }
}
