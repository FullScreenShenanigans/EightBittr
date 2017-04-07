define(["require", "exports", "./AliasConverter"], function (require, exports, AliasConverter_1) {
    "use strict";
    /**
     * Bridges input events to known actions.
     */
    var InputWritr = (function () {
        /**
         * Initializes a new instance of the InputWritr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        function InputWritr(settings) {
            if (settings === void 0) { settings = {}; }
            this.triggers = settings.triggers || {};
            // Headless browsers like PhantomJS might not contain the performance
            // class, so Date.now is used as a backup
            if (typeof settings.getTimestamp === "undefined") {
                if (typeof performance === "undefined") {
                    this.getTimestamp = function () { return Date.now(); };
                }
                else {
                    this.getTimestamp = (performance.now
                        || performance.webkitNow
                        || performance.mozNow
                        || performance.msNow
                        || performance.oNow).bind(performance);
                }
            }
            else {
                this.getTimestamp = settings.getTimestamp;
            }
            if ("canTrigger" in settings) {
                this.canTrigger = typeof settings.canTrigger === "function"
                    ? settings.canTrigger
                    : function () { return settings.canTrigger; };
            }
            else {
                this.canTrigger = function () { return true; };
            }
            this.aliasConverter = new AliasConverter_1.AliasConverter(settings.aliasConversions);
            this.aliases = {};
            this.addAliases(settings.aliases || {});
        }
        /**
         * Adds a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is being given aliases,
         *               such as "left".
         * @param values   An array of aliases by which the event will also
         *                 be callable.
         */
        InputWritr.prototype.addAliasValues = function (name, values) {
            if (!this.aliases[name]) {
                this.aliases[name] = values;
            }
            else {
                this.aliases[name].push.apply(this.aliases[name], values);
            }
            // triggerName = "onkeydown", "onkeyup", ...
            for (var triggerName in this.triggers) {
                // triggerGroup = { "left": function, ... }, ...
                var triggerGroup = this.triggers[triggerName];
                if (triggerGroup[name]) {
                    // values[i] = 37, 65, ...
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var value = values_1[_i];
                        triggerGroup[value] = triggerGroup[name];
                    }
                }
            }
        };
        /**
         * Removes a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is having aliases removed,
         *               such as "left".
         * @param values   Aliases by which the event will no longer be callable.
         */
        InputWritr.prototype.removeAliasValues = function (name, values) {
            if (!this.aliases[name]) {
                return;
            }
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                this.aliases[name].splice(this.aliases[name].indexOf(value, 1));
            }
            // triggerName = "onkeydown", "onkeyup", ...
            for (var triggerName in this.triggers) {
                // triggerGroup = { "left": function, ... }, ...
                var triggerGroup = this.triggers[triggerName];
                if (triggerGroup[name]) {
                    // values[i] = 37, 65, ...
                    for (var _a = 0, values_3 = values; _a < values_3.length; _a++) {
                        var value = values_3[_a];
                        if (triggerGroup[value]) {
                            delete triggerGroup[value];
                        }
                    }
                }
            }
        };
        /**
         * Shortcut to remove old alias values and add new ones in.
         *
         * @param name   The name of the event that is having aliases
         *               added and removed, such as "left".
         * @param valuesOld   An array of aliases by which the event will no
         *                    longer be callable.
         * @param valuesNew   An array of aliases by which the event will
         *                    now be callable.
         */
        InputWritr.prototype.switchAliasValues = function (name, valuesOld, valuesNew) {
            this.removeAliasValues(name, valuesOld);
            this.addAliasValues(name, valuesNew);
        };
        /**
         * Adds a set of alises from an Object containing "name" => [values] pairs.
         *
         * @param aliasesRaw   Aliases to be added via this.addAliasvalues.
         */
        InputWritr.prototype.addAliases = function (aliasesRaw) {
            for (var aliasName in aliasesRaw) {
                this.addAliasValues(aliasName, aliasesRaw[aliasName]);
            }
        };
        /**
         * Adds a triggerable event by marking a new callback under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         * @param callback   The callback Function to be triggered.
         */
        InputWritr.prototype.addEvent = function (trigger, label, callback) {
            if (!this.triggers[trigger]) {
                throw new Error("Unknown trigger requested: '" + trigger + "'.");
            }
            this.triggers[trigger][label] = callback;
            if (this.aliases[label]) {
                for (var _i = 0, _a = this.aliases[label]; _i < _a.length; _i++) {
                    var alias = _a[_i];
                    this.triggers[trigger][alias] = callback;
                }
            }
        };
        /**
         * Removes a triggerable event by deleting any callbacks under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         */
        InputWritr.prototype.removeEvent = function (trigger, label) {
            if (!this.triggers[trigger]) {
                throw new Error("Unknown trigger requested: '" + trigger + "'.");
            }
            delete this.triggers[trigger][label];
            if (this.aliases[label]) {
                for (var _i = 0, _a = this.aliases[label]; _i < _a.length; _i++) {
                    var alias = _a[_i];
                    if (this.triggers[trigger][alias]) {
                        delete this.triggers[trigger][alias];
                    }
                }
            }
        };
        /**
         * Primary driver function to run a triggers event.
         *
         * @param event   The event function (or string alias thereof) to call.
         * @param keyCode   The alias of the event Function under triggers[event],
         *                  if event is a string.
         * @param sourceEvent   The raw event that caused the calling Pipe
         *                      to be triggered, such as a MouseEvent.
         * @returns The result of calling the triggered event.
         */
        InputWritr.prototype.callEvent = function (event, keyCode, sourceEvent) {
            if (!event) {
                throw new Error("Blank event given to InputWritr.");
            }
            if (!this.canTrigger(event, keyCode, sourceEvent)) {
                return;
            }
            if (typeof event === "string") {
                event = this.triggers[event][keyCode];
            }
            return event(sourceEvent);
        };
        /**
         * Creates and returns a pipe to run a trigger.
         *
         * @param trigger   The label for the array of functions that the
         *                  pipe function should choose from.
         * @param codeLabel   A mapping string for the alias to get the
         *                    alias from the event.
         * @param preventDefaults   Whether the input to the pipe Function
         *                           will be an DOM-style event, where
         *                           .preventDefault() should be called.
         * @returns A Function that, when called on an event, runs this.callEvent
         *          on the appropriate trigger event.
         */
        InputWritr.prototype.makePipe = function (trigger, codeLabel, preventDefaults) {
            var _this = this;
            var functions = this.triggers[trigger];
            if (!functions) {
                throw new Error("No trigger of label '" + trigger + "' defined.");
            }
            return function (event) {
                var alias = event[codeLabel];
                // Typical usage means alias will be an event from a key/mouse input
                if (preventDefaults && event.preventDefault instanceof Function) {
                    event.preventDefault();
                }
                // If there's a Function under that alias, run it
                if (functions[alias]) {
                    _this.callEvent(functions[alias], alias, event);
                }
            };
        };
        return InputWritr;
    }());
    exports.InputWritr = InputWritr;
    console.log("sup");
});
