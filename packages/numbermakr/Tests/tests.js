var numTries = 350,
    numTriesBoolean = numTries * 2,
    numTriesEquality = 7,
    epsilon = .05,
    seed = new Date().getTime(),
    stateLength = 700,
    statePeriod = 420,
    matrixA = 0x9908a1df,
    maskUpper = 0x79000000,
    maskLower = 0x6fffffff,
    NumberMaker;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// mocha-phantomjs doesn't yet have Phantom 2.X, so an older version of Phantom
// is being used that is on an older version of Qt, which isn't fully ES5.
// In the meantime...
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP
                       ? this
                       : oThis,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

function tryMany(callback) {
    for (i = 0; i < numTries; i += 1) {
        callback(i, numTries);
    }
}

function tryManyRanged(min, max, generator) {
    var number;

    tryMany(function () {
        number = generator();

        if (number < min || number >= max) {
            throw new Error("Generated number out of bounds: " + number + ".");
        }
    })
}

function curryIt(method, min, max) {
    var args = [].slice.call(arguments, 3);

    it(method, tryManyRanged.bind(undefined, min, max, function () {
        return NumberMaker[method].apply(NumberMaker, args);
    }));
}

function curryItRounded(method, min, max) {
    var args = [].slice.call(arguments, 3);

    it(method, tryManyRanged.bind(undefined, min, max, function () {
        var number = NumberMaker[method].apply(NumberMaker, args);

        if (Math.round(number) !== number) {
            throw new Error(method + " does not always generate rounded numbers.");
        }

        return number;
    }));
}

function curryItBoolean(method, expected) {
    var args = [].slice.call(arguments, 2),
        numTrue = 0,
        actual;

    it(method, function () {
        for (i = 0; i < numTriesBoolean; i += 1) {
            if (NumberMaker[method].apply(NumberMaker, args)) {
                numTrue += 1;
            }
        }

        actual = numTrue / numTriesBoolean;

        if (Math.abs(actual - expected) > epsilon) {
            throw new Error(method + " probability is " + actual + ", which is too different from " + expected + ".");
        }
    });
}

function curryEquality(description, method, seed) {
    var args = [].slice.call(arguments, 2),
        NumberMaker = new NumberMakr.NumberMakr({
            "seed": seed
        }),
        numberOld, numberNew;

    numberOld = NumberMaker[method].apply(NumberMaker, args);

    it(description, function () {
        for (i = 0; i < numTriesEquality; i += 1) {
            NumberMaker = new NumberMakr.NumberMakr({
                "seed": seed
            }),
            numberNew = NumberMaker[method].apply(NumberMaker, args);

            chai.expect(numberNew).to.be.equal(numberOld);
            numberOld = numberNew;
        }
    });
}

describe("constructor", function () {
    it("takes settings", function () {
        NumberMaker = new NumberMakr.NumberMakr({
            "seed": seed,
            "stateLength": stateLength,
            "statePeriod": statePeriod,
            "matrixA": matrixA,
            "maskUpper": maskUpper,
            "maskLower": maskLower
        });
    });

    it("stores seed", function () {
        chai.expect(NumberMaker.getSeed()).to.be.equal(seed);
    });

    it("stores stateLength", function () {
        chai.expect(NumberMaker.getStateLength()).to.be.equal(stateLength);
    });

    it("stores statePeriod", function () {
        chai.expect(NumberMaker.getStatePeriod()).to.be.equal(statePeriod);
    });

    it("stores matrixA", function () {
        chai.expect(NumberMaker.getMatrixA()).to.be.equal(matrixA);
    });

    it("stores maskUpper", function () {
        chai.expect(NumberMaker.getMaskUpper()).to.be.equal(maskUpper);
    });

    it("stores maskLower", function () {
        chai.expect(NumberMaker.getMaskLower()).to.be.equal(maskLower);
    });

    it("doesn't error without settings", function () {
        NumberMaker = new NumberMakr.NumberMakr();
    });
});

describe("generation", function () {
    curryIt("randomInt32", 0, 0xffffffff);
    curryIt("random", 0, 1);
    curryIt("randomInt31", 0, 0x7fffffff);
    curryIt("randomReal1", 0, 1);
    curryIt("randomReal3", 0, 1);
    curryIt("randomReal53Bit", 0, 1);
    curryIt("randomUnder", 0, 7, 7);
    curryIt("randomWithin", 3, 7, 3, 7);
    curryItRounded("randomInt", 0, 3, 3);
    curryItRounded("randomIntWithin", 3, 7, 3, 7);
    curryItBoolean("randomBoolean", .5);
    curryItBoolean("randomBooleanProbability", .35, .35);
    curryItBoolean("randomBooleanFraction", 3 / 7, 3, 7);
    curryIt("randomArrayIndex", 0, 7, [0, 0, 0, 0, 0, 0, 0]);
    curryIt("randomArrayMember", 7, 14, [7, 8, 9, 10, 11, 12, 13]);
});

describe("state", function () {
    curryEquality("random from number", "random", 777);
    curryEquality("randomfrom number[]", "random", [35, 49, 77]);
    curryEquality("randomInt32 from number", "randomInt32", 777);
    curryEquality("randomInt32 from number[]", "randomInt32", [35, 49, 77]);
});