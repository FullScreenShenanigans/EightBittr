var ChangeLinr;
(function (ChangeLinr_1) {
    "use strict";
    /**
     * A general utility for transforming raw input to processed output. This is
     * done by keeping an Array of transform Functions to process input on.
     * Outcomes for inputs are cached so repeat runs are O(1).
     */
    var ChangeLinr = (function () {
        /**
         * @param {IChangeLinrSettings} settings
         */
        function ChangeLinr(settings) {
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
                        throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                            + "not found in transforms.");
                    }
                }
                // Also make sure each part of the pipeline is a Function
                if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                    throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") "
                        + "is not a valid Function from transforms.");
                }
                this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
            }
        }
        /* Simple gets
        */
        /**
         * @return {Mixed} The cached output of this.process and this.processFull.
         */
        ChangeLinr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @param {String} key   The key under which the output was processed
         * @return {Mixed} The cached output filed under the given key.
         */
        ChangeLinr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * @return {Object} A complete listing of the cached outputs from all
         *                  processed information, from each pipeline transform.
         */
        ChangeLinr.prototype.getCacheFull = function () {
            return this.cacheFull;
        };
        /**
         * @return {Boolean} Whether the cache object is being kept.
         */
        ChangeLinr.prototype.getDoMakeCache = function () {
            return this.doMakeCache;
        };
        /**
         * @return {Boolean} Whether previously cached output is being used in new
         *                   process requests.
         */
        ChangeLinr.prototype.getDoUseCache = function () {
            return this.doUseCache;
        };
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
        ChangeLinr.prototype.process = function (data, key, attributes) {
            if (key === void 0) { key = undefined; }
            if (attributes === void 0) { attributes = undefined; }
            var i;
            if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
                key = data;
            }
            // If this keyed input was already processed, get that
            if (this.doUseCache && this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Apply (and optionally cache) each transform in order
            for (i = 0; i < this.pipeline.length; ++i) {
                data = this.transforms[this.pipeline[i]](data, key, attributes, this);
                if (this.doMakeCache) {
                    this.cacheFull[this.pipeline[i]][key] = data;
                }
            }
            if (this.doMakeCache) {
                this.cache[key] = data;
            }
            return data;
        };
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Object} The complete output of the transforms.
         */
        ChangeLinr.prototype.processFull = function (raw, key, attributes) {
            if (attributes === void 0) { attributes = undefined; }
            var output = {}, i;
            this.process(raw, key, attributes);
            for (i = 0; i < this.pipeline.length; ++i) {
                output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
            }
            return output;
        };
        return ChangeLinr;
    })();
    ChangeLinr_1.ChangeLinr = ChangeLinr;
})(ChangeLinr || (ChangeLinr = {}));
var StringFilr;
(function (StringFilr_1) {
    "use strict";
    /**
     * A general utility for retrieving data from an Object based on nested class
     * names. You can think of the internal "library" Object as a tree structure,
     * such that you can pass in a listing (in any order) of the path to data for
     * retrieval.
     */
    var StringFilr = (function () {
        /**
         * @param {IStringFilrSettings} settings
         */
        function StringFilr(settings) {
            if (!settings) {
                throw new Error("No settings given to StringFilr.");
            }
            if (!settings.library) {
                throw new Error("No library given to StringFilr.");
            }
            this.library = settings.library;
            this.normal = settings.normal;
            this.requireNormalKey = settings.requireNormalKey;
            this.cache = {};
            if (this.requireNormalKey) {
                if (typeof this.normal === "undefined") {
                    throw new Error("StringFilr is given requireNormalKey, but no normal class.");
                }
                this.ensureLibraryNormal();
            }
        }
        /**
         * @return {Object} The base library of stored information.
         */
        StringFilr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         * @return {String} The optional normal class String.
         */
        StringFilr.prototype.getNormal = function () {
            return this.normal;
        };
        /**
         * @return {Object} The complete cache of cached output.
         */
        StringFilr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @return {Mixed} A cached value, if it exists/
         */
        StringFilr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * Completely clears the cache Object.
         */
        StringFilr.prototype.clearCache = function () {
            this.cache = {};
        };
        /**
         * Clears the cached entry for a key.
         *
         * @param {String} key
         */
        StringFilr.prototype.clearCached = function (key) {
            if (this.normal) {
                key = key.replace(this.normal, "");
            }
            delete this.cache[key];
        };
        /**
         * Retrieves the deepest matching data in the library for a key.
         *
         * @param {String} keyRaw
         * @return {Mixed}
         */
        StringFilr.prototype.get = function (keyRaw) {
            var key, result;
            if (this.normal) {
                key = keyRaw.replace(this.normal, "");
            }
            else {
                key = keyRaw;
            }
            // Quickly return a cached result if it exists
            if (this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Since no existed, it must be found deep within the library
            result = this.followClass(key.split(/\s+/g), this.library);
            this.cache[key] = this.cache[keyRaw] = result;
            return result;
        };
        /**
         * Utility helper to recursively check for tree branches in the library
         * that don't have a key equal to the normal. For each sub-directory that
         * is caught, the path to it is added to output.
         *
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @param {String} path   The current path within the library.
         * @param {String[]} output   An Array of the String paths to parts that
         *                           don't have a matching key.
         * @return {String[]} output
         */
        StringFilr.prototype.findLackingNormal = function (current, path, output) {
            var i;
            if (!current.hasOwnProperty(this.normal)) {
                output.push(path);
            }
            if (typeof current[i] === "object") {
                for (i in current) {
                    if (current.hasOwnProperty(i)) {
                        this.findLackingNormal(current[i], path + " " + i, output);
                    }
                }
            }
            return output;
        };
        /**
         * Utility function to follow a path into the library (this is the driver
         * for searching into the library). For each available key, if it matches
         * a key in current, it is removed from keys and recursion happens on the
         * sub-directory in current.
         *
         * @param {String[]} keys   The currently available keys to search within.
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @return {Mixed} The most deeply matched part of the library.
         */
        StringFilr.prototype.followClass = function (keys, current) {
            var key, i;
            // If keys runs out, we're done
            if (!keys || !keys.length) {
                return current;
            }
            // For each key in the current array...
            for (i = 0; i < keys.length; i += 1) {
                key = keys[i];
                // ...if it matches, recurse on the other keys
                if (current.hasOwnProperty(key)) {
                    keys.splice(i, 1);
                    return this.followClass(keys, current[key]);
                }
            }
            // If no key matched, try the normal (default)
            if (this.normal && current.hasOwnProperty(this.normal)) {
                return this.followClass(keys, current[this.normal]);
            }
            // Nothing matches anything; we're done.
            return current;
        };
        /**
         * Driver for this.findLackingNormal. If library directories are found to
         * not have a normal, it throws an error.
         */
        StringFilr.prototype.ensureLibraryNormal = function () {
            var caught = this.findLackingNormal(this.library, "base", []);
            if (caught.length) {
                throw new Error("Found " + caught.length + " library "
                    + "sub-directories missing the normal: "
                    + "\r\n  " + caught.join("\r\n  "));
            }
        };
        return StringFilr;
    })();
    StringFilr_1.StringFilr = StringFilr;
})(StringFilr || (StringFilr = {}));
// @echo '/// <reference path="ChangeLinr-0.2.0.ts" />'
// @echo '/// <reference path="StringFilr-0.2.1.ts" />'
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ChangeLinr-0.2.0.ts" />
/// <reference path="References/StringFilr-0.2.1.ts" />
/// <reference path="PixelRendr.d.ts" />
// @endif
// @include ../Source/PixelRendr.d.ts
var PixelRendr;
(function (PixelRendr_1) {
    "use strict";
    /**
     * A moderately unusual graphics module designed to compress images as
     * compressed text blobs and store the text blobs in a StringFilr. These tasks
     * are performed and cached quickly enough for use in real-time environments,
     * such as real-time video games.
     *
     * @todo
     * The first versions of this library were made many years ago by an
     * inexperienced author, and have undergone only moderate structural revisions
     * since. There are two key improvements that should happen:
     * 1. On reset, the source library should be mapped to a PartialRender class
     *    that stores loading status and required ("post") references, to enable
     *    lazy loading. See #71.
     * 2. Once lazy loading is implemented for significantly shorter startup times,
     *    an extra layer of compression should be added to compress the technically
     *    human-readable String sources to a binary-ish format. See #236.
     * 3. Rewrite the heck out of this piece of crap.
     */
    var PixelRendr = (function () {
        /**
         * @param {IPixelRendrSettings} settings
         */
        function PixelRendr(settings) {
            if (!settings) {
                throw new Error("No settings given to PixelRendr.");
            }
            if (!settings.paletteDefault) {
                throw new Error("No paletteDefault given to PixelRendr.");
            }
            this.paletteDefault = settings.paletteDefault;
            this.digitsizeDefault = this.getDigitSize(this.paletteDefault);
            this.digitsplit = new RegExp(".{1," + this.digitsizeDefault + "}", "g");
            this.library = {
                "raws": settings.library || {},
                "posts": []
            };
            this.filters = settings.filters || {};
            this.scale = settings.scale || 1;
            this.flipVert = settings.flipVert || "flip-vert";
            this.flipHoriz = settings.flipHoriz || "flip-horiz";
            this.spriteWidth = settings.spriteWidth || "spriteWidth";
            this.spriteHeight = settings.spriteHeight || "spriteHeight";
            this.Uint8ClampedArray = (settings.Uint8ClampedArray
                || window.Uint8ClampedArray
                || window.Uint8Array);
            // The first ChangeLinr does the raw processing of Strings to sprites
            // This is used to load & parse sprites into memory on startup
            this.ProcessorBase = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteUnravel": this.spriteUnravel.bind(this),
                    "spriteApplyFilter": this.spriteApplyFilter.bind(this),
                    "spriteExpand": this.spriteExpand.bind(this),
                    "spriteGetArray": this.spriteGetArray.bind(this)
                },
                "pipeline": [
                    "spriteUnravel",
                    "spriteApplyFilter",
                    "spriteExpand",
                    "spriteGetArray"
                ]
            });
            // The second ChangeLinr does row repeating and flipping
            // This is done on demand when given a sprite's settings Object
            this.ProcessorDims = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "spriteRepeatRows": this.spriteRepeatRows.bind(this),
                    "spriteFlipDimensions": this.spriteFlipDimensions.bind(this)
                },
                "pipeline": [
                    "spriteRepeatRows",
                    "spriteFlipDimensions"
                ]
            });
            // As a utility, a processor is included to encode image data to sprites
            this.ProcessorEncode = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "imageGetData": this.imageGetData.bind(this),
                    "imageGetPixels": this.imageGetPixels.bind(this),
                    "imageMapPalette": this.imageMapPalette.bind(this),
                    "imageCombinePixels": this.imageCombinePixels.bind(this)
                },
                "pipeline": [
                    "imageGetData",
                    "imageGetPixels",
                    "imageMapPalette",
                    "imageCombinePixels"
                ],
                "doUseCache": false
            });
            this.library.sprites = this.libraryParse(this.library.raws, "");
            // Post commands are evaluated after the first processing run
            this.libraryPosts();
            // The BaseFiler provides a searchable 'view' on the library of sprites
            this.BaseFiler = new StringFilr.StringFilr({
                "library": this.library.sprites,
                "normal": "normal" // to do: put this somewhere more official?
            });
        }
        /* Simple gets
        */
        /**
         * @return {Object} The base container for storing sprite information.
         */
        PixelRendr.prototype.getBaseLibrary = function () {
            return this.BaseFiler.getLibrary();
        };
        /**
         * @return {StringFilr} The StringFilr interface on top of the base library.
         */
        PixelRendr.prototype.getBaseFiler = function () {
            return this.BaseFiler;
        };
        /**
         * @return {ChangeLinr} The processor that turns raw strings into partial
         * sprites.
         */
        PixelRendr.prototype.getProcessorBase = function () {
            return this.ProcessorBase;
        };
        /**
         * @return {ChangeLinr} The processor that turns partial sprites and repeats
         *                      rows.
         */
        PixelRendr.prototype.getProcessorDims = function () {
            return this.ProcessorDims;
        };
        /**
         * @return {ChangeLinr} The processor that takes real images and compresses
         *                      their data into sprite Strings.
         */
        PixelRendr.prototype.getProcessorEncode = function () {
            return this.ProcessorEncode;
        };
        /**
         * @param {String} key
         * @return {Mixed} Returns the base sprite for a key. This will either be a
         *                 Uint8ClampedArray if a sprite is found, or the deepest
         *                 Object in the library.
         */
        PixelRendr.prototype.getSpriteBase = function (key) {
            return this.BaseFiler.get(key);
        };
        /* External APIs
        */
        /**
         * Standard render function. Given a key, this finds the raw information via
         * BaseFiler and processes it using ProcessorDims. Attributes are needed so
         * the ProcessorDims can stretch it on width and height.
         *
         * @param {String} key   The general key for the sprite to be passed
         *                       directly to BaseFiler.get.
         * @param {Object} attributes   Additional attributes for the sprite; width
         *                              and height Numbers are required.
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.decode = function (key, attributes) {
            // BaseFiler stores the cache of the base sprites. Note that it doesn't
            // actually require the extra attributes
            var sprite = this.BaseFiler.get(key);
            if (!sprite) {
                throw new Error("No raw sprite found for " + key + ".");
            }
            // Multiple sprites have their sizings taken from attributes
            if (sprite.multiple) {
                if (!sprite.processed) {
                    this.processSpriteMultiple(sprite, key, attributes);
                }
            }
            else {
                // Single (actual) sprites process for size (row) scaling, and flipping
                if (!(sprite instanceof this.Uint8ClampedArray)) {
                    throw new Error("No single raw sprite found for: '" + key + "'");
                }
                sprite = this.ProcessorDims.process(sprite, key, attributes);
            }
            return sprite;
        };
        /**
         * Encodes an image into a sprite via ProcessorEncode.process.
         *
         * @param {HTMLImageElement} image
         * @param {Function} [callback]   An optional callback to call on the image
         *                                with source as an extra argument.
         * @param {Mixed} [source]   An optional extra argument for callback,
         *                           commonly provided by this.encodeUri as the
         *                           image source.
         */
        PixelRendr.prototype.encode = function (image, callback, source) {
            var result = this.ProcessorEncode.process(image);
            if (callback) {
                callback(result, image, source);
            }
            return result;
        };
        /**
         * Fetches an image from a source and encodes it into a sprite via
         * ProcessEncode.process. An HtmlImageElement is created and given an onload
         * of this.encode.
         *
         * @param {String} uri
         * @param {Function} callback   A callback for when this.encode finishes to
         *                              call on the results.
         */
        PixelRendr.prototype.encodeUri = function (uri, callback) {
            var image = document.createElement("img");
            image.onload = function () {
                console.log("This is", this);
                this.encode.bind(this, image, callback);
            }.bind(this);
            image.src = uri;
        };
        /**
         * Miscellaneous utility to generate a complete palette from raw image pixel
         * data. Unique [r,g,b,a] values are found using tree-based caching, and
         * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
         * pixel has a=0, it's completely transparent and goes before anything else
         * in the palette. Grayscale colors come next in order of light to dark, and
         * general colors come next sorted by decreasing r, g, and b in order.
         *
         * @param {Uint8ClampedArray} data   The equivalent data from a context's
         *                                   getImageData(...).data.
         * @param {Boolean} [forceZeroColor]   Whether the palette should have a
         *                                     [0,0,0,0] color as the first element
         *                                     even if data does not contain it (by
         *                                     default, false).
         * @param {Boolean} [giveArrays]   Whether the resulting palettes should be
         *                                 converted to Arrays (by default, false).
         * @return {Uint8ClampedArray[]} A working palette that may be used in
         *                               sprite settings (Array[] if giveArrays is
         *                               true).
         */
        PixelRendr.prototype.generatePaletteFromRawData = function (data, forceZeroColor, giveArrays) {
            if (forceZeroColor === void 0) { forceZeroColor = false; }
            if (giveArrays === void 0) { giveArrays = false; }
            var tree = {}, colorsGeneral = [], colorsGrayscale = [], output, i;
            for (i = 0; i < data.length; i += 4) {
                if (data[i + 3] === 0) {
                    forceZeroColor = true;
                    continue;
                }
                if (tree[data[i]]
                    && tree[data[i]][data[i + 1]]
                    && tree[data[i]][data[i + 1]][data[i + 2]]
                    && tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    continue;
                }
                if (!tree[data[i]]) {
                    tree[data[i]] = {};
                }
                if (!tree[data[i]][data[i + 1]]) {
                    tree[data[i]][data[i + 1]] = {};
                }
                if (!tree[data[i]][data[i + 1]][data[i + 2]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]] = {};
                }
                if (!tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                    tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]] = true;
                    if (data[i] === data[i + 1] && data[i + 1] === data[i + 2]) {
                        colorsGrayscale.push(data.subarray(i, i + 4));
                    }
                    else {
                        colorsGeneral.push(data.subarray(i, i + 4));
                    }
                }
            }
            // It's safe to sort grayscale colors just on their first values, since
            // grayscale implies they're all the same.
            colorsGrayscale.sort(function (a, b) {
                return a[0] - b[0];
            });
            // For regular colors, sort by the first color that's not equal, so in 
            // order red, green, blue, alpha.
            colorsGeneral.sort(function (a, b) {
                for (i = 0; i < 4; i += 1) {
                    if (a[i] !== b[i]) {
                        return b[i] - a[i];
                    }
                }
            });
            if (forceZeroColor) {
                output = [new this.Uint8ClampedArray([0, 0, 0, 0])]
                    .concat(colorsGrayscale)
                    .concat(colorsGeneral);
            }
            else {
                output = colorsGrayscale.concat(colorsGeneral);
            }
            if (!giveArrays) {
                return output;
            }
            for (i = 0; i < output.length; i += 1) {
                output[i] = Array.prototype.slice.call(output[i]);
            }
            return output;
        };
        /**
         * Copies a stretch of members from one Uint8ClampedArray or number[] to
         * another. This is a useful utility Function for code that may use this
         * PixelRendr to draw its output sprites, such as PixelDrawr.
         *
         * @param {Uint8ClampedArray} source
         * @param {Uint8ClampedArray} destination
         * @param {Number} readloc   Where to start reading from in the source.
         * @param {Number} writeloc   Where to start writing to in the source.
         * @param {Number} writelength   How many members to copy over.
         * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
         * @see http://www.javascripture.com/Uint8ClampedArray
         */
        PixelRendr.prototype.memcpyU8 = function (source, destination, readloc, writeloc, writelength) {
            if (readloc === void 0) { readloc = 0; }
            if (writeloc === void 0) { writeloc = 0; }
            if (writelength === void 0) { writelength = Math.max(0, Math.min(source.length, destination.length)); }
            if (!source || !destination || readloc < 0 || writeloc < 0 || writelength <= 0) {
                return;
            }
            if (readloc >= source.length || writeloc >= destination.length) {
                // console.log("Alert: memcpyU8 requested out of bounds!");
                // console.log("source, destination, readloc, writeloc, writelength");
                // console.log(arguments);
                return;
            }
            // JIT compilcation help
            var lwritelength = writelength + 0, lwriteloc = writeloc + 0, lreadloc = readloc + 0;
            while (lwritelength--) {
                destination[lwriteloc++] = source[lreadloc++];
            }
        };
        /* Library parsing
         */
        /**
         * Recursive Function to go throw a library and parse it. A copy of the
         * structure is made where each result is either a parsed sprite, a
         * placeholder for a post command, or a recursively generated child Object.
         *
         * @param {Object} reference   The raw source structure to be parsed.
         * @param {String} path   The path to the current place within the library.
         * @return {Object} The parsed library Object.
         */
        PixelRendr.prototype.libraryParse = function (reference, path) {
            var setnew = {}, objref, i;
            // For each child of the current layer:
            for (i in reference) {
                if (!reference.hasOwnProperty(i)) {
                    continue;
                }
                objref = reference[i];
                switch (objref.constructor) {
                    // If it's a string, parse it
                    case String:
                        setnew[i] = this.ProcessorBase.process(objref, path + " " + i);
                        break;
                    // If it's an array, it should have a command such as 'same' to be post-processed
                    case Array:
                        this.library.posts.push({
                            caller: setnew,
                            name: i,
                            command: reference[i],
                            path: path + " " + i
                        });
                        break;
                    // If it's anything else, simply recurse
                    default:
                        setnew[i] = this.libraryParse(objref, path + " " + i);
                        break;
                }
            }
            return setnew;
        };
        /**
         * Driver to evaluate post-processing commands, such as copies and filters.
         * This is run after the main processing finishes. Each post command is
         * given to evaluatePost.
         */
        PixelRendr.prototype.libraryPosts = function () {
            var posts = this.library.posts, post, i;
            for (i = 0; i < posts.length; i += 1) {
                post = posts[i];
                post.caller[post.name] = this.evaluatePost(post.caller, post.command, post.path);
            }
        };
        /**
         * Evaluates a post command and returns the result to be used in the
         * library. It can be "same", "filter", or "vertical".
         *
         * @param {Object} caller   The place within the library store results in.
         * @param {Array} command   The command from the library, represented as
         *                          ["type", [info...]]
         * @param {String} path   The path to the caller.
         */
        PixelRendr.prototype.evaluatePost = function (caller, command, path) {
            var spriteRaw, filter;
            switch (command[0]) {
                // Same: just returns a reference to the target
                // ["same", ["container", "path", "to", "target"]]
                case "same":
                    spriteRaw = this.followPath(this.library.raws, command[1], 0);
                    if (spriteRaw.constructor === String) {
                        return this.ProcessorBase.process(spriteRaw, path);
                    }
                    else if (spriteRaw.constructor === Array) {
                        return this.evaluatePost(caller, spriteRaw, path);
                    }
                    return this.libraryParse(spriteRaw, path);
                // Filter: takes a reference to the target, and applies a filter to it
                // ["filter", ["container", "path", "to", "target"], filters.DoThisFilter]
                case "filter":
                    // Find the sprite this should be filtering from
                    spriteRaw = this.followPath(this.library.raws, command[1], 0);
                    filter = this.filters[command[2]];
                    if (!filter) {
                        console.warn("Invalid filter provided:", command[2], this.filters);
                        filter = {};
                    }
                    return this.evaluatePostFilter(spriteRaw, path, filter);
                // Multiple: uses more than one image, either vertically or horizontally
                // Not to be confused with having .repeat = true.
                // ["multiple", "vertical", {
                //    top: "...",       // (just once at the top)
                //    middle: "..."     // (repeated after top)
                //  }
                case "multiple":
                    return this.evaluatePostMultiple(path, command);
                // Commands not evaluated by the switch are unknown and bad
                default:
                    console.warn("Unknown post command: '" + command[0] + "'.", caller, command, path);
            }
        };
        /**
         * Driver function to recursively apply a filter on a sprite or Object.
         *
         * @param {Mixed} spriteRaw   What the filter is being applied on (either a
         *                            sprite, or a collection of sprites).
         * @param {String} path   The path to the spriteRaw in the library.
         * @param {Object} filter   The pre-determined filter to apply.
         */
        PixelRendr.prototype.evaluatePostFilter = function (spriteRaw, path, filter) {
            // If it's just a String, process the sprite normally
            if (spriteRaw.constructor === String) {
                return this.ProcessorBase.process(spriteRaw, path, {
                    filter: filter
                });
            }
            // If it's an Array, that's a post that hasn't yet been evaluated: evaluate it by the path
            if (spriteRaw instanceof Array) {
                return this.evaluatePostFilter(this.followPath(this.library.raws, spriteRaw[1], 0), spriteRaw[1].join(" "), filter);
            }
            // If it's a generic Object, go recursively on its children
            if (spriteRaw instanceof Object) {
                var output = {}, i;
                for (i in spriteRaw) {
                    if (spriteRaw.hasOwnProperty(i)) {
                        output[i] = this.evaluatePostFilter(spriteRaw[i], path + " " + i, filter);
                    }
                }
                return output;
            }
            // Anything else is a complaint
            console.warn("Invalid sprite provided for a post filter.", spriteRaw, path, filter);
        };
        /**
         * Creates a SpriteMultiple based on a library's command.
         *
         * @param {String} path   The path to the SpriteMultiple.
         * @param {Array} command   The instructions from the library, in the form
         *                          ["multiple", "{direction}", {Information}].
         */
        PixelRendr.prototype.evaluatePostMultiple = function (path, command) {
            var direction = command[1], sections = command[2], output = {
                "direction": direction,
                "multiple": true,
                "sprites": {},
                "processed": false,
                "topheight": sections.topheight | 0,
                "rightwidth": sections.rightwidth | 0,
                "bottomheight": sections.bottomheight | 0,
                "leftwidth": sections.leftwidth | 0,
                "middleStretch": sections.middleStretch || false
            }, i;
            for (i in sections) {
                if (sections.hasOwnProperty(i)) {
                    output.sprites[i] = this.ProcessorBase.process(sections[i], path + direction + i);
                }
            }
            return output;
        };
        /**
         * Processes each of the components in a SpriteMultiple. These are all
         * individually processed using the attributes by the dimensions processor.
         * Each sub-sprite will be processed as if it were in a sub-Object referred
         * to by the path (so if path is "foo bar", "foo bar middle" will be the
         * middle sprite's key).
         *
         * @param {SpriteMultiple} sprite
         * @param {String} key
         * @param {Object} attributes
         */
        PixelRendr.prototype.processSpriteMultiple = function (sprite, key, attributes) {
            var i;
            for (i in sprite.sprites) {
                if (sprite.sprites[i] instanceof this.Uint8ClampedArray) {
                    sprite.sprites[i] = this.ProcessorDims.process(sprite.sprites[i], key + " " + i, attributes);
                }
            }
            sprite.processed = true;
        };
        /* Core pipeline functions
        */
        /**
         * Given a compressed raw sprite data string, this 'unravels' it. This is
         * the first Function called in the base processor. It could output the
         * Uint8ClampedArray immediately if given the area - deliberately does not
         * to simplify sprite library storage.
         *
         * @param {String} colors   The raw sprite String, including commands like
         *                          "p" and "x".
         * @return {String} A version of the sprite with no fancy commands, just
         *                  the numbers.
         */
        PixelRendr.prototype.spriteUnravel = function (colors) {
            var paletteref = this.getPaletteReferenceStarting(this.paletteDefault), digitsize = this.digitsizeDefault, clength = colors.length, current, rep, nixloc, output = "", loc = 0;
            while (loc < clength) {
                switch (colors[loc]) {
                    // A loop, ordered as 'x char times ,'
                    case "x":
                        // Get the location of the ending comma
                        nixloc = colors.indexOf(",", ++loc);
                        // Get the color
                        current = this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        // Get the rep times
                        rep = Number(colors.slice(loc, nixloc));
                        // Add that int to output, rep many times
                        while (rep--) {
                            output += current;
                        }
                        loc = nixloc + 1;
                        break;
                    // A palette changer, in the form 'p[X,Y,Z...]' (or "p" for default)
                    case "p":
                        // If the next character is a "[", customize.
                        if (colors[++loc] === "[") {
                            nixloc = colors.indexOf("]");
                            // Isolate and split the new palette's numbers
                            paletteref = this.getPaletteReference(colors.slice(loc + 1, nixloc).split(","));
                            loc = nixloc + 1;
                            digitsize = 1;
                        }
                        else {
                            // Otherwise go back to default
                            paletteref = this.getPaletteReference(this.paletteDefault);
                            digitsize = this.digitsizeDefault;
                        }
                        break;
                    // A typical number
                    default:
                        output += this.makeDigit(paletteref[colors.slice(loc, loc += digitsize)], this.digitsizeDefault);
                        break;
                }
            }
            return output;
        };
        /**
         * Repeats each number in the given string a number of times equal to the
         * scale. This is the second Function called by the base processor.
         *
         * @param {String} colors
         * @return {String}
         */
        PixelRendr.prototype.spriteExpand = function (colors) {
            var output = "", clength = colors.length, i = 0, j, current;
            // For each number,
            while (i < clength) {
                current = colors.slice(i, i += this.digitsizeDefault);
                // Put it into output as many times as needed
                for (j = 0; j < this.scale; ++j) {
                    output += current;
                }
            }
            return output;
        };
        /**
         * Used during post-processing before spriteGetArray to filter colors. This
         * is the third Function used by the base processor, but it just returns the
         * original sprite if no filter should be applied from attributes.
         * Filters are applied here because the sprite is just the numbers repeated,
         * so it's easy to loop through and replace them.
         *
         * @param {String} colors
         * @param {String} key
         * @param {Object} attributes
         * @return {String}
         */
        PixelRendr.prototype.spriteApplyFilter = function (colors, key, attributes) {
            // If there isn't a filter (as is the normal), just return the sprite
            if (!attributes || !attributes.filter) {
                return colors;
            }
            var filter = attributes.filter, filterName = filter[0];
            if (!filterName) {
                return colors;
            }
            switch (filterName) {
                // Palette filters switch all instances of one color with another
                case "palette":
                    // Split the colors on on each digit
                    // ("...1234..." => [..., "12", "34", ...]
                    var split = colors.match(this.digitsplit), i;
                    // For each color filter to be applied, replace it
                    for (i in filter[1]) {
                        if (filter[1].hasOwnProperty(i)) {
                            this.arrayReplace(split, i, filter[1][i]);
                        }
                    }
                    return split.join("");
                default:
                    console.warn("Unknown filter: '" + filterName + "'.");
            }
            return colors;
        };
        /**
         * Converts an unraveled String of sprite numbers to the equivalent RGBA
         * Uint8ClampedArray. Each colors number will be represented by four numbers
         * in the output. This is the fourth Function called in the base processor.
         *
         * @param {String} colors
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteGetArray = function (colors) {
            var clength = colors.length, numcolors = clength / this.digitsizeDefault, split = colors.match(this.digitsplit), olength = numcolors * 4, output = new this.Uint8ClampedArray(olength), reference, i, j, k;
            // For each color,
            for (i = 0, j = 0; i < numcolors; ++i) {
                // Grab its RGBA ints
                reference = this.paletteDefault[Number(split[i])];
                // Place each in output
                for (k = 0; k < 4; ++k) {
                    output[j + k] = reference[k];
                }
                j += 4;
            }
            return output;
        };
        /**
         * Repeats each row of a sprite based on the container attributes to create
         * the actual sprite (before now, the sprite was 1 / scale as high as it
         * should have been). This is the first Function called in the dimensions
         * processor.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes   The container Object (commonly a Thing in
         *                              GameStarter), which must contain width and
         *                              height numbers.
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteRepeatRows = function (sprite, key, attributes) {
            var parsed = new this.Uint8ClampedArray(sprite.length * this.scale), rowsize = attributes[this.spriteWidth] * 4, heightscale = attributes[this.spriteHeight] * this.scale, readloc = 0, writeloc = 0, si, sj;
            // For each row:
            for (si = 0; si < heightscale; ++si) {
                // Add it to parsed x scale
                for (sj = 0; sj < this.scale; ++sj) {
                    this.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                    writeloc += rowsize;
                }
                readloc += rowsize;
            }
            return parsed;
        };
        /**
         * Optionally flips a sprite based on the flipVert and flipHoriz keys. This
         * is the second Function in the dimensions processor and the last step
         * before a sprite is deemed usable.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {String} key
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.spriteFlipDimensions = function (sprite, key, attributes) {
            if (key.indexOf(this.flipHoriz) !== -1) {
                if (key.indexOf(this.flipVert) !== -1) {
                    return this.flipSpriteArrayBoth(sprite);
                }
                else {
                    return this.flipSpriteArrayHoriz(sprite, attributes);
                }
            }
            else if (key.indexOf(this.flipVert) !== -1) {
                return this.flipSpriteArrayVert(sprite, attributes);
            }
            return sprite;
        };
        /**
         * Flips a sprite horizontally by reversing the pixels within each row. Rows
         * are computing using the spriteWidth in attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayHoriz = function (sprite, attributes) {
            var length = sprite.length, width = attributes[this.spriteWidth] + 0, newsprite = new this.Uint8ClampedArray(length), rowsize = width * 4, newloc, oldloc, i, j, k;
            // For each row:
            for (i = 0; i < length; i += rowsize) {
                newloc = i;
                oldloc = i + rowsize - 4;
                // For each pixel:
                for (j = 0; j < rowsize; j += 4) {
                    // Copy it over
                    for (k = 0; k < 4; ++k) {
                        newsprite[newloc + k] = sprite[oldloc + k];
                    }
                    newloc += 4;
                    oldloc -= 4;
                }
            }
            return newsprite;
        };
        /**
         * Flips a sprite horizontally by reversing the order of the rows. Rows are
         * computing using the spriteWidth in attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @param {Object} attributes
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayVert = function (sprite, attributes) {
            var length = sprite.length, width = attributes[this.spriteWidth] + 0, newsprite = new this.Uint8ClampedArray(length), rowsize = width * 4, newloc = 0, oldloc = length - rowsize, i, j;
            // For each row
            while (newloc < length) {
                // For each pixel in the rows
                for (i = 0; i < rowsize; i += 4) {
                    // For each rgba value
                    for (j = 0; j < 4; ++j) {
                        newsprite[newloc + i + j] = sprite[oldloc + i + j];
                    }
                }
                newloc += rowsize;
                oldloc -= rowsize;
            }
            return newsprite;
        };
        /**
         * Flips a sprite horizontally and vertically by reversing the order of the
         * pixels. This doesn't actually need attributes.
         *
         * @param {Uint8ClampedArray} sprite
         * @return {Uint8ClampedArray}
         */
        PixelRendr.prototype.flipSpriteArrayBoth = function (sprite) {
            var length = sprite.length, newsprite = new this.Uint8ClampedArray(length), oldloc = sprite.length - 4, newloc = 0, i;
            while (newloc < length) {
                for (i = 0; i < 4; ++i) {
                    newsprite[newloc + i] = sprite[oldloc + i];
                }
                newloc += 4;
                oldloc -= 4;
            }
            return newsprite;
        };
        /* Encoding pipeline functions
        */
        /**
         * Retrives the raw pixel data from an image element. It is copied onto a
         * canvas, which as its context return the .getImageDate().data results.
         * This is the first Fiunction used in the encoding processor.
         *
         * @param {HTMLImageElement} image
         */
        PixelRendr.prototype.imageGetData = function (image) {
            var canvas = document.createElement("canvas"), context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height).data;
        };
        /**
         * Determines which pixels occur in the data and at what frequency. This is
         * the second Function used in the encoding processor.
         *
         * @param {Uint8ClampedArray} data   The raw pixel data obtained from the
         *                                   imageData of a canvas.
         * @return {Array} [pixels, occurences], where pixels is an array of [rgba]
         *                 values and occurences is an Object mapping occurence
         *                 frequencies of palette colors in pisels.
         */
        PixelRendr.prototype.imageGetPixels = function (data) {
            var pixels = new Array(data.length / 4), occurences = {}, pixel, i, j;
            for (i = 0, j = 0; i < data.length; i += 4, j += 1) {
                pixel = this.getClosestInPalette(this.paletteDefault, data.subarray(i, i + 4));
                pixels[j] = pixel;
                if (occurences.hasOwnProperty(pixel)) {
                    occurences[pixel] += 1;
                }
                else {
                    occurences[pixel] = 1;
                }
            }
            return [pixels, occurences];
        };
        /**
         * Concretely defines the palette to be used for a new sprite. This is the
         * third Function used in the encoding processor, and creates a technically
         * usable (but uncompressed) sprite with information to compress it.
         *
         * @param {Array} information   [pixels, occurences], a result directly from
         *                              imageGetPixels.
         * @return {Array} [palette, numbers, digitsize], where palette is a
         *                 String[] of palette numbers, numbers is the actual sprite
         *                 data, and digitsize is the sprite's digit size.
         */
        PixelRendr.prototype.imageMapPalette = function (information) {
            var pixels = information[0], occurences = information[1], palette = Object.keys(occurences), digitsize = this.getDigitSize(palette), paletteIndices = this.getValueIndices(palette), numbers = pixels.map(this.getKeyValue.bind(this, paletteIndices));
            return [palette, numbers, digitsize];
        };
        /**
         * Compresses a nearly complete sprite from imageMapPalette into a
         * compressed, storage-ready String. This is the last Function in the
         * encoding processor.
         *
         * @param {Array} information   [palette, numbers, digitsize], a result
         *                              directly from imageMapPalette.
         * @return {String}
         */
        PixelRendr.prototype.imageCombinePixels = function (information) {
            var palette = information[0], numbers = information[1], digitsize = information[2], threshold = Math.max(3, Math.round(4 / digitsize)), output, current, digit, i = 0, j;
            output = "p[" + palette.map(this.makeSizedDigit.bind(this, digitsize)).join(",") + "]";
            while (i < numbers.length) {
                j = i + 1;
                current = numbers[i];
                digit = this.makeDigit(current, digitsize);
                while (current === numbers[j]) {
                    j += 1;
                }
                if (j - i > threshold) {
                    output += "x" + digit + String(j - i) + ",";
                    i = j;
                }
                else {
                    do {
                        output += digit;
                        i += 1;
                    } while (i < j);
                }
            }
            return output;
        };
        /* Misc. utility functions
        */
        /**
         * @param {Array} palette
         * @return {Number} What the digitsize for a sprite that uses the palette
         *                  should be (how many digits it would take to represent
         *                  any index of the palettte).
         */
        PixelRendr.prototype.getDigitSize = function (palette) {
            return Math.floor(Math.log(palette.length) / Math.LN10) + 1;
        };
        /**
         * Generates an actual palette Object for a given palette, using a digitsize
         * calculated from the palette.
         *
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        PixelRendr.prototype.getPaletteReference = function (palette) {
            var output = {}, digitsize = this.getDigitSize(palette), i;
            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, digitsize)] = this.makeDigit(palette[i], digitsize);
            }
            return output;
        };
        /**
         * Generates an actual palette Object for a given palette, using the default
         * digitsize.
         *
         * @param {Array} palette
         * @return {Object} The actual palette Object for the given palette, with
         *                  an index for every palette member.
         */
        PixelRendr.prototype.getPaletteReferenceStarting = function (palette) {
            var output = {}, i;
            for (i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, this.digitsizeDefault)] = this.makeDigit(i, this.digitsizeDefault);
            }
            return output;
        };
        /**
         * Finds which rgba value in a palette is closest to a given value. This is
         * useful for determining which color in a pre-existing palette matches up
         * with a raw image's pixel. This is determined by which palette color has
         * the lowest total difference in integer values between r, g, b, and a.
         *
         * @param {Array} palette   The palette of pre-existing colors.
         * @param {Array} rgba   The RGBA values being assigned a color, as Numbers
         *                       in [0, 255].
         * @return {Number} The closest matching color index.
         */
        PixelRendr.prototype.getClosestInPalette = function (palette, rgba) {
            var bestDifference = Infinity, difference, bestIndex, i;
            for (i = palette.length - 1; i >= 0; i -= 1) {
                difference = this.arrayDifference(palette[i], rgba);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestIndex = i;
                }
            }
            return bestIndex;
        };
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param {String} string   The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         * @return {String}
         */
        PixelRendr.prototype.stringOf = function (str, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
        };
        /**
         * Turns a Number into a String with a prefix added to pad it to a certain
         * number of digits.
         *
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @param {String} [prefix]   A prefix to repeat for padding (by default,
         *                            "0").
         * @return {String}
         * @example
         * makeDigit(7, 3); // '007'
         * makeDigit(7, 3, 1); // '117'
         */
        PixelRendr.prototype.makeDigit = function (num, size, prefix) {
            if (prefix === void 0) { prefix = "0"; }
            return this.stringOf(prefix, Math.max(0, size - String(num).length)) + num;
        };
        /**
         * Curry wrapper around makeDigit that reverses size and number argument
         * order. Useful for binding makeDigit.
         *
         * @param {Number} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @return {String}
         */
        PixelRendr.prototype.makeSizedDigit = function (size, num) {
            return this.makeDigit(num, size, "0");
        };
        /**
         * Replaces all instances of an element in an Array.
         *
         * @param {Array}
         * @param {Mixed} removed   The element to remove.
         * @param {Mixed} inserted   The element to insert.
         */
        PixelRendr.prototype.arrayReplace = function (array, removed, inserted) {
            for (var i = array.length - 1; i >= 0; i -= 1) {
                if (array[i] === removed) {
                    array[i] = inserted;
                }
            }
            return array;
        };
        /**
         * Computes the sum of the differences of elements between two Arrays of
         * equal length.
         *
         * @param {Array} a
         * @param {Array} b
         * @return {Number}
         */
        PixelRendr.prototype.arrayDifference = function (a, b) {
            var sum = 0, i;
            for (i = a.length - 1; i >= 0; i -= 1) {
                sum += Math.abs(a[i] - b[i]) | 0;
            }
            return sum;
        };
        /**
         * @param {Array}
         * @return {Object} An Object with an index equal to each element of the
         *                  Array.
         */
        PixelRendr.prototype.getValueIndices = function (array) {
            var output = {}, i;
            for (i = 0; i < array.length; i += 1) {
                output[array[i]] = i;
            }
            return output;
        };
        /**
         * Curry Function to retrieve a member of an Object. Useful for binding.
         *
         * @param {Object} object
         * @param {String} key
         * @return {Mixed}
         */
        PixelRendr.prototype.getKeyValue = function (object, key) {
            return object[key];
        };
        /**
         * Follows a path inside an Object recursively, based on a given path.
         *
         * @param {Mixed} object
         * @param {String[]} path   The ordered names of attributes to descend into.
         * @param {Number} num   The starting index in path.
         * @return {Mixed}
         */
        PixelRendr.prototype.followPath = function (obj, path, num) {
            if (num < path.length && obj.hasOwnProperty(path[num])) {
                return this.followPath(obj[path[num]], path, num + 1);
            }
            return obj;
        };
        return PixelRendr;
    })();
    PixelRendr_1.PixelRendr = PixelRendr;
})(PixelRendr || (PixelRendr = {}));
