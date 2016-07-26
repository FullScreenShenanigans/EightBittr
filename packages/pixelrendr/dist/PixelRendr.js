define("IPixelRendr", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Render", ["require", "exports"], function (require, exports) {
    "use strict";
    var Render = (function () {
        function Render(source, filter) {
            this.source = source;
            this.filter = filter;
            this.sprites = {};
            this.containers = [];
        }
        return Render;
    }());
    exports.Render = Render;
});
define("SpriteMultiple", ["require", "exports"], function (require, exports) {
    "use strict";
    var SpriteMultiple = (function () {
        function SpriteMultiple(sprites, render) {
            var sources = render.source[2];
            this.sprites = sprites;
            this.direction = render.source[1];
            if (this.direction === "vertical" || this.direction === "corners") {
                this.topheight = sources.topheight | 0;
                this.bottomheight = sources.bottomheight | 0;
            }
            if (this.direction === "horizontal" || this.direction === "corners") {
                this.rightwidth = sources.rightwidth | 0;
                this.leftwidth = sources.leftwidth | 0;
            }
            this.middleStretch = sources.middleStretch || false;
        }
        return SpriteMultiple;
    }());
    exports.SpriteMultiple = SpriteMultiple;
});
define("PixelRendr", ["require", "exports", "ChangeLinr", "StringFilr", "Render", "SpriteMultiple"], function (require, exports, ChangeLinr_1, StringFilr_1, Render_1, SpriteMultiple_1) {
    "use strict";
    var PixelRendr = (function () {
        function PixelRendr(settings) {
            if (!settings) {
                throw new Error("No settings given to PixelRendr.");
            }
            if (!settings.paletteDefault) {
                throw new Error("No paletteDefault given to PixelRendr.");
            }
            this.paletteDefault = settings.paletteDefault;
            this.digitsizeDefault = this.getDigitSizeFromArray(this.paletteDefault);
            this.digitsplit = new RegExp(".{1," + this.digitsizeDefault + "}", "g");
            this.scale = settings.scale || 1;
            this.filters = settings.filters || {};
            this.flipVert = settings.flipVert || "flip-vert";
            this.flipHoriz = settings.flipHoriz || "flip-horiz";
            this.spriteWidth = settings.spriteWidth || "spriteWidth";
            this.spriteHeight = settings.spriteHeight || "spriteHeight";
            this.Uint8ClampedArray = settings.Uint8ClampedArray || window.Uint8ClampedArray || window.Uint8Array;
            this.ProcessorBase = new ChangeLinr_1.ChangeLinr({
                transforms: {
                    spriteUnravel: this.spriteUnravel.bind(this),
                    spriteApplyFilter: this.spriteApplyFilter.bind(this),
                    spriteExpand: this.spriteExpand.bind(this),
                    spriteGetArray: this.spriteGetArray.bind(this)
                },
                pipeline: ["spriteUnravel", "spriteApplyFilter", "spriteExpand", "spriteGetArray"]
            });
            this.ProcessorDims = new ChangeLinr_1.ChangeLinr({
                transforms: {
                    spriteRepeatRows: this.spriteRepeatRows.bind(this),
                    spriteFlipDimensions: this.spriteFlipDimensions.bind(this)
                },
                pipeline: ["spriteRepeatRows", "spriteFlipDimensions"]
            });
            this.ProcessorEncode = new ChangeLinr_1.ChangeLinr({
                transforms: {
                    imageGetData: this.imageGetData.bind(this),
                    imageGetPixels: this.imageGetPixels.bind(this),
                    imageMapPalette: this.imageMapPalette.bind(this),
                    imageCombinePixels: this.imageCombinePixels.bind(this)
                },
                pipeline: ["imageGetData", "imageGetPixels", "imageMapPalette", "imageCombinePixels"],
                doUseCache: false
            });
            this.commandGenerators = {
                multiple: this.generateSpriteCommandMultipleFromRender.bind(this),
                same: this.generateSpriteCommandSameFromRender.bind(this),
                filter: this.generateSpriteCommandFilterFromRender.bind(this)
            };
            this.resetLibrary(settings.library || {});
        }
        PixelRendr.prototype.getPaletteDefault = function () {
            return this.paletteDefault;
        };
        PixelRendr.prototype.getScale = function () {
            return this.scale;
        };
        PixelRendr.prototype.getBaseLibrary = function () {
            return this.BaseFiler.getLibrary();
        };
        PixelRendr.prototype.getBaseFiler = function () {
            return this.BaseFiler;
        };
        PixelRendr.prototype.getProcessorBase = function () {
            return this.ProcessorBase;
        };
        PixelRendr.prototype.getProcessorDims = function () {
            return this.ProcessorDims;
        };
        PixelRendr.prototype.getProcessorEncode = function () {
            return this.ProcessorEncode;
        };
        PixelRendr.prototype.getSpriteBase = function (key) {
            return this.BaseFiler.get(key);
        };
        PixelRendr.prototype.resetLibrary = function (library) {
            this.library = {
                "raws": library || {}
            };
            this.library.sprites = this.libraryParse(this.library.raws);
            this.BaseFiler = new StringFilr_1.StringFilr({
                library: this.library.sprites,
                normal: "normal"
            });
        };
        PixelRendr.prototype.resetRender = function (key) {
            var render = this.BaseFiler.get(key);
            if (!render || !render.sprites) {
                throw new Error("No render found for '" + key + "'.");
            }
            render.sprites = {};
        };
        PixelRendr.prototype.decode = function (key, attributes) {
            var render = this.BaseFiler.get(key);
            if (!render) {
                throw new Error("No sprite found for '" + key + "'.");
            }
            if (!render.sprites.hasOwnProperty(key)) {
                this.generateRenderSprite(render, key, attributes);
            }
            var sprite = render.sprites[key];
            if (!sprite || (sprite.constructor === this.Uint8ClampedArray && sprite.length === 0)) {
                throw new Error("Could not generate sprite for '" + key + "'.");
            }
            return sprite;
        };
        PixelRendr.prototype.encode = function (image, callback) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result = this.ProcessorEncode.process(image);
            if (callback) {
                callback.apply(void 0, [result, image].concat(args));
            }
            return result;
        };
        PixelRendr.prototype.encodeUri = function (uri, callback) {
            var image = document.createElement("img");
            image.onload = this.encode.bind(this, image, callback);
            image.src = uri;
        };
        PixelRendr.prototype.generatePaletteFromRawData = function (data, forceZeroColor, giveArrays) {
            var tree = {};
            var colorsGeneral = [];
            var colorsGrayscale = [];
            for (var i = 0; i < data.length; i += 4) {
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
            colorsGrayscale.sort(function (a, b) {
                return a[0] - b[0];
            });
            colorsGeneral.sort(function (a, b) {
                for (var i = 0; i < 4; i += 1) {
                    if (a[i] !== b[i]) {
                        return b[i] - a[i];
                    }
                }
            });
            var output;
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
            for (var i = 0; i < output.length; i += 1) {
                output[i] = Array.prototype.slice.call(output[i]);
            }
            return output;
        };
        PixelRendr.prototype.memcpyU8 = function (source, destination, readloc, writeloc, writelength) {
            if (readloc === void 0) { readloc = 0; }
            if (writeloc === void 0) { writeloc = 0; }
            if (writelength === void 0) { writelength = Math.max(0, Math.min(source.length, destination.length)); }
            var lwritelength = writelength + 0;
            var lwriteloc = writeloc + 0;
            var lreadloc = readloc + 0;
            while (lwritelength--) {
                destination[lwriteloc++] = source[lreadloc++];
            }
        };
        PixelRendr.prototype.libraryParse = function (reference) {
            var setNew = {};
            for (var i in reference) {
                if (!reference.hasOwnProperty(i)) {
                    continue;
                }
                var source = reference[i];
                switch (source.constructor) {
                    case String:
                        setNew[i] = new Render_1.Render(source);
                        break;
                    case Array:
                        setNew[i] = new Render_1.Render(source, source[1]);
                        break;
                    default:
                        setNew[i] = this.libraryParse(source);
                        break;
                }
                if (setNew[i].constructor === Render_1.Render) {
                    setNew[i].containers.push({
                        container: setNew,
                        key: i
                    });
                }
            }
            return setNew;
        };
        PixelRendr.prototype.generateRenderSprite = function (render, key, attributes) {
            var sprite;
            if (render.source.constructor === String) {
                sprite = this.generateSpriteSingleFromRender(render, key, attributes);
            }
            else {
                sprite = this.commandGenerators[render.source[0]](render, key, attributes);
            }
            render.sprites[key] = sprite;
        };
        PixelRendr.prototype.generateSpriteSingleFromRender = function (render, key, attributes) {
            var base = this.ProcessorBase.process(render.source, key, render.filter);
            return this.ProcessorDims.process(base, key, attributes);
        };
        PixelRendr.prototype.generateSpriteCommandMultipleFromRender = function (render, key, attributes) {
            var sources = render.source[2];
            var sprites = {};
            var output = new SpriteMultiple_1.SpriteMultiple(sprites, render);
            for (var i in sources) {
                if (sources.hasOwnProperty(i)) {
                    var path = key + " " + i;
                    var sprite = this.ProcessorBase.process(sources[i], path, render.filter);
                    sprites[i] = this.ProcessorDims.process(sprite, path, attributes);
                }
            }
            return output;
        };
        PixelRendr.prototype.generateSpriteCommandSameFromRender = function (render, key, attributes) {
            var replacement = this.followPath(this.library.sprites, render.source[1], 0);
            this.replaceRenderInContainers(render, replacement);
            this.BaseFiler.clearCached(key);
            return this.decode(key, attributes);
        };
        PixelRendr.prototype.generateSpriteCommandFilterFromRender = function (render, key, attributes) {
            var filter = this.filters[render.source[2]];
            if (!filter) {
                throw new Error("Invalid filter provided: " + render.source[2]);
            }
            var found = this.followPath(this.library.sprites, render.source[1], 0);
            var filtered;
            if (found.constructor === Render_1.Render) {
                filtered = new Render_1.Render(found.source, { filter: filter });
                this.generateRenderSprite(filtered, key, attributes);
            }
            else {
                filtered = this.generateRendersFromFilter(found, filter);
            }
            this.replaceRenderInContainers(render, filtered);
            if (filtered.constructor === Render_1.Render) {
                return filtered.sprites[key];
            }
            this.BaseFiler.clearCached(key);
            return this.decode(key, attributes);
        };
        PixelRendr.prototype.generateRendersFromFilter = function (directory, filter) {
            var output = {};
            for (var i in directory) {
                if (!directory.hasOwnProperty(i)) {
                    continue;
                }
                var child = directory[i];
                if (child instanceof Render_1.Render) {
                    output[i] = new Render_1.Render(child.source, {
                        "filter": filter
                    });
                }
                else {
                    output[i] = this.generateRendersFromFilter(child, filter);
                }
            }
            return output;
        };
        PixelRendr.prototype.replaceRenderInContainers = function (render, replacement) {
            for (var i = 0; i < render.containers.length; i += 1) {
                var listing = render.containers[i];
                listing.container[listing.key] = replacement;
                if (replacement.constructor === Render_1.Render) {
                    replacement.containers.push(listing);
                }
            }
        };
        PixelRendr.prototype.spriteUnravel = function (colors) {
            var paletteReference = this.getPaletteReferenceStarting(this.paletteDefault);
            var digitsize = this.digitsizeDefault;
            var location = 0;
            var output = "";
            while (location < colors.length) {
                switch (colors[location]) {
                    case "x":
                        var commaLocation = colors.indexOf(",", ++location);
                        if (commaLocation === -1) {
                            throw new Error("Unclosed repeat loop at " + location);
                        }
                        var current = this.makeDigit(paletteReference[colors.slice(location, location += digitsize)], this.digitsizeDefault);
                        var repetitions = parseInt(colors.slice(location, commaLocation));
                        while (repetitions--) {
                            output += current;
                        }
                        location = commaLocation + 1;
                        break;
                    case "p":
                        if (colors[++location] === "[") {
                            var commaLocation_1 = colors.indexOf("]");
                            if (commaLocation_1 === -1) {
                                throw new Error("Unclosed palette brackets at " + location);
                            }
                            paletteReference = this.getPaletteReference(colors.slice(location + 1, commaLocation_1).split(","));
                            location = commaLocation_1 + 1;
                            digitsize = this.getDigitSizeFromObject(paletteReference);
                        }
                        else {
                            paletteReference = this.getPaletteReference(this.paletteDefault);
                            digitsize = this.digitsizeDefault;
                        }
                        break;
                    default:
                        output += this.makeDigit(paletteReference[colors.slice(location, location += digitsize)], this.digitsizeDefault);
                        break;
                }
            }
            return output;
        };
        PixelRendr.prototype.spriteExpand = function (colors) {
            var output = "";
            var i = 0;
            while (i < colors.length) {
                var current = colors.slice(i, i += this.digitsizeDefault);
                for (var j = 0; j < this.scale; j += 1) {
                    output += current;
                }
            }
            return output;
        };
        PixelRendr.prototype.spriteApplyFilter = function (colors, key, attributes) {
            if (!attributes || !attributes.filter) {
                return colors;
            }
            var filter = attributes.filter;
            var filterName = filter[0];
            if (!filterName) {
                return colors;
            }
            switch (filterName) {
                case "palette":
                    var split = colors.match(this.digitsplit);
                    for (var i in filter[1]) {
                        if (filter[1].hasOwnProperty(i)) {
                            this.arrayReplace(split, i, filter[1][i]);
                        }
                    }
                    return split.join("");
                default:
                    throw new Error("Unknown filter: '" + filterName + "'.");
            }
        };
        PixelRendr.prototype.spriteGetArray = function (colors) {
            var numColors = colors.length / this.digitsizeDefault;
            var split = colors.match(this.digitsplit);
            var output = new this.Uint8ClampedArray(numColors * 4);
            var i = 0;
            var j = 0;
            while (i < numColors) {
                var reference = this.paletteDefault[Number(split[i])];
                for (var k = 0; k < 4; k += 1) {
                    output[j + k] = reference[k];
                }
                i += 1;
                j += 4;
            }
            return output;
        };
        PixelRendr.prototype.spriteRepeatRows = function (sprite, key, attributes) {
            var parsed = new this.Uint8ClampedArray(sprite.length * this.scale);
            var rowsize = attributes[this.spriteWidth] * 4;
            var height = attributes[this.spriteHeight] / this.scale;
            var readloc = 0;
            var writeloc = 0;
            for (var i = 0; i < height; i += 1) {
                for (var j = 0; j < this.scale; j += 1) {
                    this.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                    writeloc += rowsize;
                }
                readloc += rowsize;
            }
            return parsed;
        };
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
        PixelRendr.prototype.flipSpriteArrayHoriz = function (sprite, attributes) {
            var length = sprite.length + 0;
            var width = attributes[this.spriteWidth] + 0;
            var spriteFlipped = new this.Uint8ClampedArray(length);
            var rowsize = width * 4;
            for (var i = 0; i < length; i += rowsize) {
                var newloc = i;
                var oldloc = i + rowsize - 4;
                for (var j = 0; j < rowsize; j += 4) {
                    for (var k = 0; k < 4; k += 1) {
                        spriteFlipped[newloc + k] = sprite[oldloc + k];
                    }
                    newloc += 4;
                    oldloc -= 4;
                }
            }
            return spriteFlipped;
        };
        PixelRendr.prototype.flipSpriteArrayVert = function (sprite, attributes) {
            var length = sprite.length + 0;
            var width = attributes[this.spriteWidth] + 0;
            var spriteFlipped = new this.Uint8ClampedArray(length);
            var rowsize = width * 4;
            var oldIndex = length - rowsize;
            var newIndex = 0;
            while (newIndex < length) {
                for (var i = 0; i < rowsize; i += 4) {
                    for (var j = 0; j < 4; j += 1) {
                        spriteFlipped[newIndex + i + j] = sprite[oldIndex + i + j];
                    }
                }
                newIndex += rowsize;
                oldIndex -= rowsize;
            }
            return spriteFlipped;
        };
        PixelRendr.prototype.flipSpriteArrayBoth = function (sprite) {
            var length = sprite.length + 0;
            var spriteFlipped = new this.Uint8ClampedArray(length);
            var oldIndex = length - 4;
            var newIndex = 0;
            while (newIndex < length) {
                for (var i = 0; i < 4; i += 1) {
                    spriteFlipped[newIndex + i] = sprite[oldIndex + i];
                }
                newIndex += 4;
                oldIndex -= 4;
            }
            return spriteFlipped;
        };
        PixelRendr.prototype.imageGetData = function (image) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height).data;
        };
        PixelRendr.prototype.imageGetPixels = function (data) {
            var pixels = new Array(data.length / 4);
            var occurences = {};
            var i;
            var j;
            while (i < data.length) {
                var pixel = this.getClosestInPalette(this.paletteDefault, data.subarray(i, i + 4));
                pixels[j] = pixel;
                if (occurences.hasOwnProperty(pixel)) {
                    occurences[pixel] += 1;
                }
                else {
                    occurences[pixel] = 1;
                }
                i += 4;
                j += 1;
            }
            return [pixels, occurences];
        };
        PixelRendr.prototype.imageMapPalette = function (information) {
            var pixels = information[0];
            var occurences = information[1];
            var palette = Object.keys(occurences);
            var digitsize = this.getDigitSizeFromArray(palette);
            var paletteIndices = this.getValueIndices(palette);
            var numbers = pixels.map(function (pixel) { return paletteIndices[pixel]; });
            return [palette, numbers, digitsize];
        };
        PixelRendr.prototype.imageCombinePixels = function (information) {
            var palette = information[0];
            var numbers = information[1];
            var digitsize = information[2];
            var threshold = Math.max(3, Math.round(4 / digitsize));
            var output = "p[" + palette.map(this.makeSizedDigit.bind(this, digitsize)).join(",") + "]";
            var i = 0;
            while (i < numbers.length) {
                var j = i + 1;
                var current = numbers[i];
                var digit = this.makeDigit(current, digitsize);
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
        PixelRendr.prototype.getDigitSizeFromArray = function (palette) {
            var digitsize = 0;
            for (var i = palette.length; i >= 1; i /= 10) {
                digitsize += 1;
            }
            return digitsize;
        };
        PixelRendr.prototype.getDigitSizeFromObject = function (palette) {
            return this.getDigitSizeFromArray(Object.keys(palette));
        };
        PixelRendr.prototype.getPaletteReference = function (palette) {
            var output = {};
            var digitsize = this.getDigitSizeFromArray(palette);
            for (var i = 0; i < palette.length; i += 1) {
                output[this.makeDigit(i, digitsize)] = this.makeDigit(palette[i], digitsize);
            }
            return output;
        };
        PixelRendr.prototype.getPaletteReferenceStarting = function (palette) {
            var output = {};
            for (var i = 0; i < palette.length; i += 1) {
                var digit = this.makeDigit(i, this.digitsizeDefault);
                output[digit] = digit;
            }
            return output;
        };
        PixelRendr.prototype.getClosestInPalette = function (palette, rgba) {
            var bestDifference = Infinity;
            var difference;
            var bestIndex;
            for (var i = palette.length - 1; i >= 0; i -= 1) {
                difference = this.arrayDifference(palette[i], rgba);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestIndex = i;
                }
            }
            return bestIndex;
        };
        PixelRendr.prototype.stringOf = function (text, times) {
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(text);
        };
        PixelRendr.prototype.makeDigit = function (num, size, prefix) {
            if (prefix === void 0) { prefix = "0"; }
            return this.stringOf(prefix, Math.max(0, size - String(num).length)) + num;
        };
        PixelRendr.prototype.makeSizedDigit = function (size, digit) {
            return this.makeDigit(digit, size, "0");
        };
        PixelRendr.prototype.arrayReplace = function (array, removed, inserted) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i] === removed) {
                    array[i] = inserted;
                }
            }
            return array;
        };
        PixelRendr.prototype.arrayDifference = function (a, b) {
            var sum = 0;
            for (var i = a.length - 1; i >= 0; i -= 1) {
                sum += Math.abs(a[i] - b[i]) | 0;
            }
            return sum;
        };
        PixelRendr.prototype.getValueIndices = function (array) {
            var output = {};
            for (var i = 0; i < array.length; i += 1) {
                output[array[i]] = i;
            }
            return output;
        };
        PixelRendr.prototype.followPath = function (object, path, index) {
            if (index < path.length && object.hasOwnProperty(path[index])) {
                return this.followPath(object[path[index]], path, index + 1);
            }
            return object;
        };
        return PixelRendr;
    }());
    exports.PixelRendr = PixelRendr;
});
