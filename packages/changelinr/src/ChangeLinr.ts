import { ICache, ICacheFull, IChangeLinr, IChangeLinrSettings, ITransforms } from "./IChangeLinr";

/**
 * A chained automator for applying and caching transforms.
 */
export class ChangeLinr implements IChangeLinr {
    /**
     * Functions that may be used to transform data, keyed by name.
     */
    private readonly transforms: ITransforms;

    /**
     * Ordered listing of Function names to be applied to raw input.
     */
    private readonly pipeline: string[];

    /**
     * Cached output of previous results of the the pipeline.
     */
    private readonly cache: ICache;

    /**
     * Cached output of each step of the pipeline.
     */
    private readonly cacheFull: ICacheFull;

    /**
     * Whether this should be caching responses.
     */
    private readonly doMakeCache: boolean;

    /**
     * Whether this should be retrieving and using cached results.
     */
    private readonly doUseCache: boolean;

    /**
     * Initializes a new instance of the ChangeLinr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IChangeLinrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to ChangeLinr.");
        }
        if (typeof settings.pipeline === "undefined") {
            throw new Error("No pipeline given to ChangeLinr.");
        }
        if (typeof settings.transforms === "undefined") {
            throw new Error("No transforms given to ChangeLinr.");
        }

        this.pipeline = settings.pipeline || [];
        this.transforms = settings.transforms || {};

        this.doMakeCache = typeof settings.doMakeCache === "undefined"
            ? true : settings.doMakeCache;

        this.doUseCache = typeof settings.doUseCache === "undefined"
            ? true : settings.doUseCache;

        this.cache = {};
        this.cacheFull = {};

        for (let i: number = 0; i < this.pipeline.length; i += 1) {
            if (!this.pipeline[i]) {
                throw new Error("Pipe[" + i + "] is invalid.");
            }

            if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                throw new Error("Pipe[" + i + "] ('" + this.pipeline[i] + "') not found in transforms.");
            }

            if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                throw new Error("Pipe[" + i + "] ('" + this.pipeline[i] + "') is not a valid Function from transforms.");
            }

            this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
        }
    }

    /**
     * @returns The cached output of this.process and this.processFull.
     */
    public getCache(): ICache {
        return this.cache;
    }

    /**
     * @param key   The key under which the output was processed
     * @returns The cached output filed under the given key.
     */
    public getCached(key: string): any {
        return this.cache[key];
    }

    /**
     * @returns A complete listing of the cached outputs from all
     *          processed information, from each pipeline transform.
     */
    public getCacheFull(): ICacheFull {
        return this.cacheFull;
    }

    /**
     * @returns Whether the cache object is being kept.
     */
    public getDoMakeCache(): boolean {
        return this.doMakeCache;
    }

    /**
     * @returns Whether previously cached output is being used in new
     *          process requests.
     */
    public getDoUseCache(): boolean {
        return this.doUseCache;
    }

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
    public process(data: any, key?: string, attributes?: any): any {
        // tslint:disable:no-parameter-reassignment
        if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
            key = data;
        }

        // If this keyed input was already processed, get that
        if (this.doUseCache && this.cache.hasOwnProperty(key!)) {
            return this.cache[key!];
        }

        // Apply (and optionally cache) each transform in order
        for (const pipe of this.pipeline) {
            data = this.transforms[pipe](data, key, attributes, this);

            if (typeof key !== "undefined" && this.doMakeCache) {
                this.cacheFull[pipe][key] = data;
            }
        }

        if (typeof key !== "undefined" && this.doMakeCache) {
            this.cache[key] = data;
        }

        return data;
        // tslint:enable:no-parameter-reassignment
    }

    /**
     * A version of this.process that returns the complete output from each
     * pipelined transform Function in an Object.
     *
     * @param data   The data to be transformed.
     * @param key   The key under which the data is to be stored.
     * @param attributes   Any extra attributes to be given to the transforms.
     * @returns The final output of the transforms.
     */
    public processFull(data: any, key: string, attributes?: any): any {
        const output: any = {};

        this.process(data, key, attributes);

        for (let i: number = 0; i < this.pipeline.length; i += 1) {
            output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
        }

        return output;
    }
}
