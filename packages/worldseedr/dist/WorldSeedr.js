define("IWorldSeedr", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("ISpacingCalculator", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("SpacingCalculator", ["require", "exports"], function (require, exports) {
    "use strict";
    var SpacingCalculator = (function () {
        function SpacingCalculator(randomBetween, chooseAmong) {
            this.randomBetween = randomBetween;
            this.chooseAmong = chooseAmong;
        }
        SpacingCalculator.prototype.calculateFromSpacing = function (spacing) {
            if (!spacing) {
                return 0;
            }
            switch (spacing.constructor) {
                case Array:
                    if (spacing[0].constructor === Number) {
                        return this.randomBetween(spacing[0], spacing[1]);
                    }
                    return this.calculateFromPossibilities(spacing);
                case Object:
                    return this.calculateFromPossibility(spacing);
                case Number:
                    return spacing;
                default:
                    throw new Error("Unknown spacing requested: '" + spacing + "'.");
            }
        };
        SpacingCalculator.prototype.calculateFromPossibility = function (spacing) {
            var spacingObject = spacing;
            var min = spacingObject.min;
            var max = spacingObject.max;
            var units = spacingObject.units || 1;
            return this.randomBetween(min / units, max / units) * units;
        };
        SpacingCalculator.prototype.calculateFromPossibilities = function (spacing) {
            return this.calculateFromPossibility(this.chooseAmong(spacing).value);
        };
        return SpacingCalculator;
    }());
    exports.SpacingCalculator = SpacingCalculator;
});
define("WorldSeedr", ["require", "exports", "SpacingCalculator"], function (require, exports, SpacingCalculator_1) {
    "use strict";
    var directionOpposites = {
        "top": "bottom",
        "right": "left",
        "bottom": "top",
        "left": "right"
    };
    var directionSizing = {
        "top": "height",
        "right": "width",
        "bottom": "height",
        "left": "width"
    };
    var directionNames = ["top", "right", "bottom", "left"];
    var sizingNames = ["width", "height"];
    var WorldSeedr = (function () {
        function WorldSeedr(settings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to WorldSeedr.");
            }
            if (typeof settings.possibilities === "undefined") {
                throw new Error("No possibilities given to WorldSeedr.");
            }
            this.possibilities = settings.possibilities;
            this.random = settings.random || Math.random.bind(Math);
            this.onPlacement = settings.onPlacement || console.log.bind(console, "Got:");
            this.spacingCalculator = new SpacingCalculator_1.SpacingCalculator(this.randomBetween.bind(this), this.chooseAmong.bind(this));
            this.clearGeneratedCommands();
        }
        WorldSeedr.prototype.getPossibilities = function () {
            return this.possibilities;
        };
        WorldSeedr.prototype.setPossibilities = function (possibilities) {
            this.possibilities = possibilities;
        };
        WorldSeedr.prototype.getOnPlacement = function () {
            return this.onPlacement;
        };
        WorldSeedr.prototype.setOnPlacement = function (onPlacement) {
            this.onPlacement = onPlacement;
        };
        WorldSeedr.prototype.clearGeneratedCommands = function () {
            this.generatedCommands = [];
        };
        WorldSeedr.prototype.runGeneratedCommands = function () {
            this.onPlacement(this.generatedCommands);
        };
        WorldSeedr.prototype.generate = function (name, command) {
            var schema = this.possibilities[name];
            if (!schema) {
                throw new Error("No possibility exists under '" + name + "'");
            }
            if (!schema.contents) {
                throw new Error("Possibility '" + name + "' has no possibile outcomes.");
            }
            return this.generateChildren(schema, this.objectCopy(command));
        };
        WorldSeedr.prototype.generateFull = function (schema) {
            var generated = this.generate(schema.title, schema);
            if (!generated || !generated.children) {
                return;
            }
            for (var i = 0; i < generated.children.length; i += 1) {
                var child = generated.children[i];
                switch (child.type) {
                    case "Known":
                        this.generatedCommands.push(child);
                        break;
                    case "Random":
                        this.generateFull(child);
                        break;
                    default:
                        throw new Error("Unknown child type: " + child.type);
                }
            }
        };
        WorldSeedr.prototype.generateChildren = function (schema, position, direction) {
            var contents = schema.contents;
            var spacing = contents.spacing || 0;
            var objectMerged = this.objectMerge(schema, position);
            var children;
            direction = contents.direction || direction;
            switch (contents.mode) {
                case "Random":
                    children = this.generateRandom(contents, objectMerged, direction, spacing);
                    break;
                case "Certain":
                    children = this.generateCertain(contents, objectMerged, direction, spacing);
                    break;
                case "Repeat":
                    children = this.generateRepeat(contents, objectMerged, direction, spacing);
                    break;
                case "Multiple":
                    children = this.generateMultiple(contents, objectMerged, direction, spacing);
                    break;
                default:
                    throw new Error("Unknown contents mode: " + contents.mode);
            }
            return this.wrapChoicePositionExtremes(children);
        };
        WorldSeedr.prototype.generateCertain = function (contents, position, direction, spacing) {
            var _this = this;
            return contents.children
                .map(function (choice) {
                if (choice.type === "Final") {
                    return _this.parseChoiceFinal(choice, position, direction);
                }
                var output = _this.parseChoice(choice, position, direction);
                if (output) {
                    if (output.type !== "Known") {
                        output.contents = _this.generate(output.title, position);
                    }
                    _this.shrinkPositionByChild(position, output, direction, spacing);
                }
                return output;
            })
                .filter(function (child) { return child !== undefined; });
        };
        WorldSeedr.prototype.generateRepeat = function (contents, position, direction, spacing) {
            var choices = contents.children;
            var children = [];
            var i = 0;
            while (this.positionIsNotEmpty(position, direction)) {
                var choice = choices[i];
                var child = void 0;
                if (choice.type === "Final") {
                    child = this.parseChoiceFinal(choice, position, direction);
                }
                else {
                    child = this.parseChoice(choice, position, direction);
                    if (child && child.type !== "Known") {
                        child.contents = this.generate(child.title, position);
                    }
                }
                if (child && this.choiceFitsPosition(child, position)) {
                    this.shrinkPositionByChild(position, child, direction, spacing);
                    children.push(child);
                }
                else {
                    break;
                }
                i += 1;
                if (i >= choices.length) {
                    i = 0;
                }
            }
            return children;
        };
        WorldSeedr.prototype.generateRandom = function (contents, position, direction, spacing) {
            var children = [];
            while (this.positionIsNotEmpty(position, direction)) {
                var child = this.generateChild(contents, position, direction);
                if (!child) {
                    break;
                }
                this.shrinkPositionByChild(position, child, direction, spacing);
                children.push(child);
                if (contents.limit && children.length > contents.limit) {
                    return;
                }
            }
            return children;
        };
        WorldSeedr.prototype.generateMultiple = function (contents, position, direction, spacing) {
            var _this = this;
            return contents.children.map(function (choice) {
                var output = _this.parseChoice(choice, _this.objectCopy(position), direction);
                if (direction) {
                    _this.movePositionBySpacing(position, direction, spacing);
                }
                return output;
            });
        };
        WorldSeedr.prototype.generateChild = function (contents, position, direction) {
            var choice = this.chooseAmongPosition(contents.children, position);
            if (!choice) {
                return undefined;
            }
            return this.parseChoice(choice, position, direction);
        };
        WorldSeedr.prototype.parseChoice = function (choice, position, direction) {
            var title = choice.title;
            var schema = this.possibilities[title];
            var output = {
                "title": title,
                "type": choice.type,
                "arguments": choice.arguments instanceof Array
                    ? (this.chooseAmong(choice.arguments)).values
                    : choice.arguments,
                "width": undefined,
                "height": undefined,
                "top": undefined,
                "right": undefined,
                "bottom": undefined,
                "left": undefined
            };
            this.ensureSizingOnChoice(output, choice, schema);
            this.ensureDirectionBoundsOnChoice(output, position);
            output[direction] =
                output[directionOpposites[direction]]
                    + output[directionSizing[direction]];
            switch (schema.contents.snap) {
                case "top":
                    output.bottom = output.top - output.height;
                    break;
                case "right":
                    output.left = output.right - output.width;
                    break;
                case "bottom":
                    output.top = output.bottom + output.height;
                    break;
                case "left":
                    output.right = output.left + output.width;
                    break;
                default:
                    break;
            }
            if (choice.stretch) {
                if (!output.arguments) {
                    output.arguments = {};
                }
                if (choice.stretch.width) {
                    output.left = position.left;
                    output.right = position.right;
                    output.width = output.right - output.left;
                    output.arguments.width = output.width;
                }
                if (choice.stretch.height) {
                    output.top = position.top;
                    output.bottom = position.bottom;
                    output.height = output.top - output.bottom;
                    output.arguments.height = output.height;
                }
            }
            return output;
        };
        WorldSeedr.prototype.parseChoiceFinal = function (choice, position, direction) {
            var schema = this.possibilities[choice.source];
            var output = {
                "type": "Known",
                "title": choice.title,
                "arguments": choice.arguments,
                "width": schema.width,
                "height": schema.height,
                "top": position.top,
                "right": position.right,
                "bottom": position.bottom,
                "left": position.left
            };
            return output;
        };
        WorldSeedr.prototype.chooseAmong = function (choices) {
            if (!choices.length) {
                return undefined;
            }
            if (choices.length === 1) {
                return choices[0];
            }
            var choice = this.randomPercentage();
            var sum = 0;
            for (var i = 0; i < choices.length; i += 1) {
                sum += choices[i].percent;
                if (sum >= choice) {
                    return choices[i];
                }
            }
        };
        WorldSeedr.prototype.chooseAmongPosition = function (choices, position) {
            var _this = this;
            var width = position.right - position.left;
            var height = position.top - position.bottom;
            return this.chooseAmong(choices.filter(function (choice) {
                return _this.choiceFitsSize(_this.possibilities[choice.title], width, height);
            }));
        };
        WorldSeedr.prototype.choiceFitsSize = function (choice, width, height) {
            return choice.width <= width && choice.height <= height;
        };
        WorldSeedr.prototype.choiceFitsPosition = function (choice, position) {
            return this.choiceFitsSize(choice, position.right - position.left, position.top - position.bottom);
        };
        WorldSeedr.prototype.positionIsNotEmpty = function (position, direction) {
            if (direction === "right" || direction === "left") {
                return position.left < position.right;
            }
            else {
                return position.top > position.bottom;
            }
        };
        WorldSeedr.prototype.shrinkPositionByChild = function (position, child, direction, spacing) {
            if (spacing === void 0) { spacing = 0; }
            switch (direction) {
                case "top":
                    position.bottom = child.top + this.spacingCalculator.calculateFromSpacing(spacing);
                    break;
                case "right":
                    position.left = child.right + this.spacingCalculator.calculateFromSpacing(spacing);
                    break;
                case "bottom":
                    position.top = child.bottom - this.spacingCalculator.calculateFromSpacing(spacing);
                    break;
                case "left":
                    position.right = child.left - this.spacingCalculator.calculateFromSpacing(spacing);
                    break;
                default:
                    break;
            }
        };
        WorldSeedr.prototype.movePositionBySpacing = function (position, direction, spacing) {
            if (spacing === void 0) { spacing = 0; }
            var space = this.spacingCalculator.calculateFromSpacing(spacing);
            switch (direction) {
                case "top":
                    position.top += space;
                    position.bottom += space;
                    break;
                case "right":
                    position.left += space;
                    position.right += space;
                    break;
                case "bottom":
                    position.top -= space;
                    position.bottom -= space;
                    break;
                case "left":
                    position.left -= space;
                    position.right -= space;
                    break;
                default:
                    throw new Error("Unknown direction: " + direction);
            }
        };
        WorldSeedr.prototype.wrapChoicePositionExtremes = function (children) {
            if (!children || !children.length) {
                return undefined;
            }
            var position = {
                "title": undefined,
                "top": children[0].top,
                "right": children[0].right,
                "bottom": children[0].bottom,
                "left": children[0].left,
                "width": undefined,
                "height": undefined,
                "children": children
            };
            if (children.length === 1) {
                return position;
            }
            for (var i = 1; i < children.length; i += 1) {
                var child = children[i];
                if (!Object.keys(child).length) {
                    return position;
                }
                position.top = Math.max(position.top, child.top);
                position.right = Math.max(position.right, child.right);
                position.bottom = Math.min(position.bottom, child.bottom);
                position.left = Math.min(position.left, child.left);
            }
            position.width = position.right - position.left;
            position.height = position.top - position.bottom;
            return position;
        };
        WorldSeedr.prototype.ensureSizingOnChoice = function (output, choice, schema) {
            for (var i in sizingNames) {
                if (!sizingNames.hasOwnProperty(i)) {
                    continue;
                }
                var name_1 = sizingNames[i];
                output[name_1] = (choice.sizing && typeof choice.sizing[name_1] !== "undefined")
                    ? choice.sizing[name_1]
                    : schema[name_1];
            }
        };
        WorldSeedr.prototype.ensureDirectionBoundsOnChoice = function (output, position) {
            for (var i in directionNames) {
                if (directionNames.hasOwnProperty(i)) {
                    output[directionNames[i]] = position[directionNames[i]];
                }
            }
        };
        WorldSeedr.prototype.randomPercentage = function () {
            return Math.floor(this.random() * 100) + 1;
        };
        WorldSeedr.prototype.randomBetween = function (min, max) {
            return Math.floor(this.random() * (1 + max - min)) + min;
        };
        WorldSeedr.prototype.objectCopy = function (original) {
            var output = {};
            for (var i in original) {
                if (original.hasOwnProperty(i)) {
                    output[i] = original[i];
                }
            }
            return output;
        };
        WorldSeedr.prototype.objectMerge = function (primary, secondary) {
            var output = this.objectCopy(primary);
            for (var i in secondary) {
                if (secondary.hasOwnProperty(i) && !output.hasOwnProperty(i)) {
                    output[i] = secondary[i];
                }
            }
            return output;
        };
        return WorldSeedr;
    }());
    exports.WorldSeedr = WorldSeedr;
});
