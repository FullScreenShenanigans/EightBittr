define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Converts between character aliases and their key strings.
     */
    var AliasConverter = (function () {
        /**
         * Initializes a new instance of the AliasConverter class.
         *
         * @param settings   Settings to be used for initialization.
         */
        function AliasConverter(settings) {
            if (settings === void 0) { settings = {}; }
            this.keyAliasesToCodes = settings.keyAliasesToCodes || {
                shift: 16,
                ctrl: 17,
                space: 32,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            this.keyCodesToAliases = settings.keyCodesToAliases || {
                16: "shift",
                17: "ctrl",
                32: "space",
                37: "left",
                38: "up",
                39: "right",
                40: "down"
            };
        }
        /**
         * @returns The stored mapping of aliases to values, with values
         *          mapped to their equivalent key Strings.
         */
        AliasConverter.prototype.getAliasesAsKeyStrings = function () {
            var output = {};
            for (var alias in this.aliases) {
                output[alias] = this.getAliasAsKeyStrings(alias);
            }
            return output;
        };
        /**
         * Determines the allowed key strings for a given alias.
         *
         * @param alias   An alias allowed to be passed in, typically a
         *                character code.
         * @returns The mapped key Strings corresponding to that alias,
         *          typically the human-readable Strings representing
         *          input names, such as "a" or "left".
         */
        AliasConverter.prototype.getAliasAsKeyStrings = function (alias) {
            return this.aliases[alias].map(this.convertAliasToKeyString.bind(this));
        };
        /**
         * @param alias   The alias of an input, typically a character code.
         * @returns The human-readable String representing the input name,
         *          such as "a" or "left".
         */
        AliasConverter.prototype.convertAliasToKeyString = function (alias) {
            if (alias.constructor === String) {
                return alias;
            }
            if (alias > 96 && alias < 105) {
                return String.fromCharCode(alias - 48);
            }
            if (alias > 64 && alias < 97) {
                return String.fromCharCode(alias);
            }
            return typeof this.keyCodesToAliases[alias] !== "undefined"
                ? this.keyCodesToAliases[alias]
                : "?";
        };
        /**
         * @param key   The number code of an input.
         * @returns The machine-usable character code of the input.
         */
        AliasConverter.prototype.convertKeyStringToAlias = function (key) {
            if (typeof key === "number") {
                return key;
            }
            if (key.length === 1) {
                return key.charCodeAt(0) - 32;
            }
            return typeof this.keyAliasesToCodes[key] !== "undefined"
                ? this.keyAliasesToCodes[key]
                : -1;
        };
        return AliasConverter;
    }());
    exports.AliasConverter = AliasConverter;
});
