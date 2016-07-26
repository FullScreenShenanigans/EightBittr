define("INumberMakr", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("NumberMakr", ["require", "exports"], function (require, exports) {
    "use strict";
    var NumberMakr = (function () {
        function NumberMakr(settings) {
            if (settings === void 0) { settings = {}; }
            this.stateLength = settings.stateLength || 624;
            this.statePeriod = settings.statePeriod || 397;
            this.matrixA = settings.matrixA || 0x9908b0df;
            this.maskUpper = settings.maskUpper || 0x80000000;
            this.maskLower = settings.maskLower || 0x7fffffff;
            this.stateVector = new Array(this.stateLength);
            this.stateIndex = this.stateLength + 1;
            this.matrixAMagic = new Array(0x0, this.matrixA);
            this.resetFromSeed(settings.seed || new Date().getTime());
        }
        NumberMakr.prototype.getSeed = function () {
            return this.seed;
        };
        NumberMakr.prototype.getStateLength = function () {
            return this.stateLength;
        };
        NumberMakr.prototype.getStatePeriod = function () {
            return this.statePeriod;
        };
        NumberMakr.prototype.getMatrixA = function () {
            return this.matrixA;
        };
        NumberMakr.prototype.getMaskUpper = function () {
            return this.maskUpper;
        };
        NumberMakr.prototype.getMaskLower = function () {
            return this.maskLower;
        };
        NumberMakr.prototype.resetFromSeed = function (seedNew) {
            this.stateVector[0] = seedNew >>> 0;
            var s;
            for (this.stateIndex = 1; this.stateIndex < this.stateLength; this.stateIndex += 1) {
                s = this.stateVector[this.stateIndex - 1] ^ (this.stateVector[this.stateIndex - 1] >>> 30);
                this.stateVector[this.stateIndex] = ((((((s & 0xffff0000) >>> 16) * 1812433253) << 16)
                    + (s & 0x0000ffff) * 1812433253) + this.stateIndex) >>> 0;
            }
            this.seed = seedNew;
        };
        NumberMakr.prototype.resetFromArray = function (keyInitial, keyLength) {
            if (keyLength === void 0) { keyLength = keyInitial.length; }
            this.resetFromSeed(19650218);
            if (typeof (keyLength) === "undefined") {
                keyLength = keyInitial.length;
            }
            var i = 1;
            var j = 0;
            var k = this.stateLength > keyLength ? this.stateLength : keyLength;
            while (k > 0) {
                var s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = (this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16)
                    + ((s & 0x0000ffff) * 1664525)) + keyInitial[j] + j) >>> 0;
                i += 1;
                j += 1;
                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }
                if (j >= keyLength) {
                    j = 0;
                }
            }
            for (k = this.stateLength - 1; k; k -= 1) {
                var s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = ((this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16)
                    + (s & 0x0000ffff) * 1566083941)) - i) >>> 0;
                i += 1;
                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }
            }
            this.stateVector[0] = 0x80000000;
            this.seed = keyInitial;
        };
        NumberMakr.prototype.randomInt32 = function () {
            var y;
            if (this.stateIndex >= this.stateLength) {
                var kk = void 0;
                if (this.stateIndex === this.stateLength + 1) {
                    this.resetFromSeed(5489);
                }
                for (kk = 0; kk < this.stateLength - this.statePeriod; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                        | (this.stateVector[kk + 1] & this.maskLower);
                    this.stateVector[kk] = this.stateVector[kk + this.statePeriod]
                        ^ (y >>> 1)
                        ^ this.matrixAMagic[y & 0x1];
                }
                for (; kk < this.stateLength - 1; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                        | (this.stateVector[kk + 1] & this.maskLower);
                    this.stateVector[kk] = this.stateVector[kk + (this.statePeriod - this.stateLength)]
                        ^ (y >>> 1)
                        ^ this.matrixAMagic[y & 0x1];
                }
                y = (this.stateVector[this.stateLength - 1] & this.maskUpper)
                    | (this.stateVector[0] & this.maskLower);
                this.stateVector[this.stateLength - 1] = this.stateVector[this.statePeriod - 1]
                    ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];
                this.stateIndex = 0;
            }
            y = this.stateVector[this.stateIndex];
            this.stateIndex += 1;
            y ^= (y >>> 11);
            y ^= (y << 7) & 0x9d2c5680;
            y ^= (y << 15) & 0xefc60000;
            y ^= (y >>> 18);
            return y >>> 0;
        };
        NumberMakr.prototype.random = function () {
            return this.randomInt32() * (1.0 / 4294967296.0);
        };
        NumberMakr.prototype.randomInt31 = function () {
            return this.randomInt32() >>> 1;
        };
        NumberMakr.prototype.randomReal1 = function () {
            return this.randomInt32() * (1.0 / 4294967295.0);
        };
        NumberMakr.prototype.randomReal3 = function () {
            return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
        };
        NumberMakr.prototype.randomReal53Bit = function () {
            var a = this.randomInt32() >>> 5;
            var b = this.randomInt32() >>> 6;
            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        };
        NumberMakr.prototype.randomUnder = function (max) {
            return this.random() * max;
        };
        NumberMakr.prototype.randomWithin = function (min, max) {
            return this.randomUnder(max - min) + min;
        };
        NumberMakr.prototype.randomInt = function (max) {
            return this.randomUnder(max) | 0;
        };
        NumberMakr.prototype.randomIntWithin = function (min, max) {
            return (this.randomUnder(max - min) + min) | 0;
        };
        NumberMakr.prototype.randomBoolean = function () {
            return this.randomInt(2) === 1;
        };
        NumberMakr.prototype.randomBooleanProbability = function (probability) {
            return this.random() < probability;
        };
        NumberMakr.prototype.randomBooleanFraction = function (numerator, denominator) {
            return this.random() <= (numerator / denominator);
        };
        NumberMakr.prototype.randomArrayIndex = function (array) {
            return this.randomIntWithin(0, array.length);
        };
        NumberMakr.prototype.randomArrayMember = function (array) {
            return array[this.randomArrayIndex(array)];
        };
        return NumberMakr;
    }());
    exports.NumberMakr = NumberMakr;
});
