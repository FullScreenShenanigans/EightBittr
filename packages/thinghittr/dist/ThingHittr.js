define("IThingHittr", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("ThingHittr", ["require", "exports"], function (require, exports) {
    "use strict";
    var ThingHittr = (function () {
        function ThingHittr(settings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to ThingHittr.");
            }
            if (typeof settings.globalCheckGenerators === "undefined") {
                throw new Error("No globalCheckGenerators given to ThingHittr.");
            }
            if (typeof settings.hitCheckGenerators === "undefined") {
                throw new Error("No hitCheckGenerators given to ThingHittr.");
            }
            if (typeof settings.hitCallbackGenerators === "undefined") {
                throw new Error("No hitCallbackGenerators given to ThingHittr.");
            }
            this.globalCheckGenerators = settings.globalCheckGenerators;
            this.hitCheckGenerators = settings.hitCheckGenerators;
            this.hitCallbackGenerators = settings.hitCallbackGenerators;
            this.generatedHitChecks = {};
            this.generatedHitCallbacks = {};
            this.generatedGlobalChecks = {};
            this.generatedHitsChecks = {};
            this.groupHitLists = this.generateGroupHitLists(this.hitCheckGenerators);
        }
        ThingHittr.prototype.cacheChecksForType = function (typeName, groupName) {
            if (!this.generatedGlobalChecks.hasOwnProperty(typeName) && this.globalCheckGenerators.hasOwnProperty(groupName)) {
                this.generatedGlobalChecks[typeName] = this.globalCheckGenerators[groupName]();
                this.generatedHitsChecks[typeName] = this.generateHitsCheck(typeName);
            }
        };
        ThingHittr.prototype.checkHitsForThing = function (thing) {
            this.generatedHitsChecks[thing.type](thing);
        };
        ThingHittr.prototype.checkHitForThings = function (thing, other) {
            return this.runThingsFunctionSafely(this.generatedHitChecks, thing, other, this.hitCheckGenerators);
        };
        ThingHittr.prototype.runHitCallbackForThings = function (thing, other) {
            this.runThingsFunctionSafely(this.generatedHitCallbacks, thing, other, this.hitCallbackGenerators);
        };
        ThingHittr.prototype.generateHitsCheck = function (typeName) {
            var _this = this;
            return function (thing) {
                if (!_this.generatedGlobalChecks[typeName](thing)) {
                    return;
                }
                var groupNames = _this.groupHitLists[thing.groupType];
                for (var i = 0; i < thing.numQuadrants; i += 1) {
                    for (var j = 0; j < groupNames.length; j += 1) {
                        var groupName = groupNames[j];
                        var others = thing.quadrants[i].things[groupName];
                        for (var k = 0; k < others.length; k += 1) {
                            var other = others[k];
                            if (thing === other) {
                                break;
                            }
                            if (!_this.generatedGlobalChecks[other.type](other)) {
                                continue;
                            }
                            if (_this.checkHitForThings(thing, other)) {
                                _this.runHitCallbackForThings(thing, other);
                            }
                        }
                    }
                }
            };
        };
        ThingHittr.prototype.runThingsFunctionSafely = function (group, thing, other, generators) {
            var typeThing = thing.type;
            var typeOther = other.type;
            var container = group[typeThing];
            if (!container) {
                container = group[typeThing] = {};
            }
            var check = container[typeOther];
            if (!check) {
                check = container[typeOther] = generators[thing.groupType][other.groupType]();
            }
            return check(thing, other);
        };
        ThingHittr.prototype.generateGroupHitLists = function (group) {
            var output = {};
            for (var i in group) {
                if (group.hasOwnProperty(i)) {
                    output[i] = Object.keys(group[i]);
                }
            }
            return output;
        };
        return ThingHittr;
    }());
    exports.ThingHittr = ThingHittr;
});
