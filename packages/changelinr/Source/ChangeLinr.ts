interface ChangeLinrSettings {
    pipeline: string[];
    transforms: Object;
    doMakeCache?: boolean;
    doUseCache?: boolean;
}

/**
 * ChangeLinr.js
 *
 * A general utility for transforming raw input to processed output. This is
 * done by keeping an Array of transform Functions to process input on.
 * Outcomes for inputs are cached so repeat runs are O(1).
 *
 * @example
 * // Creating and using a ChangeLinr to square numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *          "square": function (number) {
 *              return number * number;
 *          }
 *      },
 *     "pipeline": ["square"]
 * });
 * console.log(ChangeLiner.process(7), "Test"); // 49
 * console.log(ChangeLiner.getCached("Test")); // 49
 *
 * @example
 * // Creating and using a ChangeLinr to calculate Fibonacci numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "fibonacci": function (number, key, attributes, ChangeLiner) {
 *             if (!number) {
 *                 return 0;
 *             } else if (number === 1) {
 *                 return 1;
 *             }
 *             return ChangeLiner.process(number - 1) + ChangeLiner.process(number - 2);
 *         }
 *     },
 *     "pipeline": ["fibonacci"]
 * });
 * console.log(ChangeLiner.process(7)); // 13
 * console.log(ChangeLiner.getCache()); // {0: 0, 1: 1, ... 6: 8, 7: 13}
 *
 * @example
 * // Creating and using a ChangeLinr to lowercase a string, remove whitespace,
 * // and sum the character codes of the result.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "toLowerCase": function (string) {
 *             return string.toLowerCase();
 *         },
 *         "removeWhitespace": function (string) {
 *             return string.replace(/\s/g, '');
 *         },
 *         "sum": function (string) {
 *             var total = 0,
 *                 i;
 *             for (i = 0; i < string.length; i += 1) {
 *                 total += string.charCodeAt(i);
 *             }
 *             return total;
 *         }
 *     },
 *     "pipeline": ["toLowerCase", "removeWhitespace", "sum"]
 * });
 * console.log(ChangeLiner.process("Hello world!", "Test")); // 1117
 * console.log(ChangeLiner.getCached("Test")); // 1117
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class ChangeLinr {
    // Associative array of Functions that may be used to transform data
    private transforms: Object;

    // Ordered array of Function names to be applied to raw input
    private pipeline: string[];

    // Cached output of the pipeline: out-facing and inward, respectively
    private cache: Object;
    private cacheFull: Object;

    // Whether this should be caching responses
    private doMakeCache: boolean;

    // Whether this should be retrieving cached results
    private doUseCache: boolean;
    
    /**
     * Resets the ChangeLinr.
     * 
     * @constructor
     * @param {String[]} pipeline   The ordered pipeline of String names of the
     *                              transforms to call.
     * @param {Object} [transforms]   An Object containing Functions keyed by
     *                                their String name.
     * @param {Boolean} [doMakeCache]   Whether a cache should be constructed
     *                                  from inputs (defaults to true).
     * @param {Boolean} [doUseCache]   Whether the cache should be used to 
     *                                 cache outputs (defaults to true).
     * @param {Boolean} [doUseGlobals]   Whether global Functions may be 
     *                                   referenced by the pipeline Strings,
     *                                   rather than just ones in transforms
     *                                   (defaults to false).
     */
    constructor(settings: ChangeLinrSettings) {
        var i;

        if (typeof settings.pipeline === "undefined") {
            throw new Error("No pipeline given to ChangeLinr.");
        }
        this.pipeline = settings.pipeline || [];

        if (typeof settings.transforms === "undefined") {
            throw new Error("No transforms given to ChangeLinr.");
        }
        this.transforms = settings.transforms || {};

        this.doMakeCache = typeof settings.doMakeCache === "undefined"
            ? true : settings.doMakeCache;

        this.doUseCache = typeof settings.doUseCache === "undefined"
            ? true : settings.doUseCache;

        this.cache = {};
        this.cacheFull = {};

        // Ensure the pipeline is formatted correctly
        for (i = 0; i < this.pipeline.length; ++i) {
            // Don't allow null/false transforms
            if (!this.pipeline[i]) {
                throw new Error("Pipe[" + i + "] is invalid.");
            }

            // Make sure each part of the pipeline exists
            if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                    throw new Error(
                        "Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                        + "not found in transforms."
                    );
                }
            }

            // Also make sure each part of the pipeline is a Function
            if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                throw new Error(
                    "Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                    + "is not a valid Function from transforms."
                );
            }

            this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
        }
    }


    /* Simple gets
    */

    /**
     * @return {Object} The cached output of self.process and self.processFull.
     */
    getCache(): Object {
        return this.cache;
    }

    /**
     * @param {String} key   The key under which the output was processed
     * @return {Mixed} The cached output filed under the given key.
     */
    getCached(key: string): any {
        return this.cache[key];
    }

    /**
     * @return {Object} A complete listing of the cached outputs from all 
     *                  processed information, from each pipeline transform.
     */
    getCacheFull(): Object {
        return this.cacheFull;
    }

    /**
     * @return {Boolean} Whether the cache object is being kept.
     */
    getDoMakeCache(): boolean {
        return this.doMakeCache;
    }

    /**
     * @return {Boolean} Whether previously cached output is being used in new
     *                   process requests.
     */
    getDoUseCache(): boolean {
        return this.doUseCache;
    }
    

    /* Core processing
    */

    /**
     * Applies a series of transforms to input data. If doMakeCache is on, the
     * outputs of this are stored in cache and cacheFull.
     * 
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Mixed} The final output of the pipeline.
     */
    process(data: any, key: string, attributes: any): any {
        var i: number;

        if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
            key = data;
        }

        // If this keyed input was already processed, get that
        if (this.doUseCache && this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }

        // Apply (and optionally cache) each transform in order
        for (i = 0; i < this.pipeline.length; ++i) {
            data = this.transforms[this.pipeline[i]](data, key, attributes, self);

            if (this.doMakeCache) {
                this.cacheFull[this.pipeline[i]][key] = data;
            }
        }

        if (this.doMakeCache) {
            this.cache[key] = data;
        }

        return data;
    }

    /**
     * A version of self.process that returns the complete output from each 
     * pipelined transform Function in an Object.
     * 
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Object} The complete output of the transforms.
     */
    processFull(raw: any, key: string, attributes: any): any {
        var output: any = {},
            i: number;

        this.process(raw, key, attributes);

        for (i = 0; i < this.pipeline.length; ++i) {
            output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
        }

        return output;
    }
}