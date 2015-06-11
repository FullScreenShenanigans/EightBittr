var getTimestamp,
    settings = {
        "maxKept": 35
    };

if (typeof performance === "undefined") {
    getTimestamp = function () {
        return Date.now();
    };
} else {
    getTimestamp = (
        performance.now
        || performance.webkitNow
        || performance.mozNow
        || performance.msNow
        || performance.oNow
     ).bind(performance);
}

describe("constructor", function () {
    var FPSAnalyzer;

    it("doesn't error", function () {
        FPSAnalyzer = new FPSAnalyzr.FPSAnalyzr(settings);
    });

    it("initializes maxKept", function () {
        chai.expect(FPSAnalyzer.getMaxKept()).to.equal(settings.maxKept);
    });

    it("initializes numRecorded", function () {
        chai.expect(FPSAnalyzer.getNumRecorded()).to.equal(0);
    });

    it("initializes ticker", function () {
        chai.expect(FPSAnalyzer.getTicker()).to.equal(-1);
    });

    it("initializes getTimestamp", function () {
        var timestamp = getTimestamp(),
            difference = FPSAnalyzer.getTimestamp() - timestamp;

        chai.expect(difference).to.be.lessThan(7);
    });
});

describe("basic measuring", function () {
    var FPSAnalyzer = new FPSAnalyzr.FPSAnalyzr(),
        ticks = 60,
        fps = 60,
        dt = 1000 / fps,
        difference,
        i;

    it("defaults measurements to the current time", function () {
        FPSAnalyzer.measure();
        difference = FPSAnalyzer.getTimeCurrent() - getTimestamp();
        chai.expect(difference).to.be.lessThan(7);
    });

    FPSAnalyzer = new FPSAnalyzr.FPSAnalyzr(settings);

    for (i = 0; i < ticks; i += 1) {
        setTimeout(function () {
            FPSAnalyzer.measure();
        }, dt * i);
    }

    it("computes average FPS", function (done) {
        setTimeout(function () {
            difference = Math.abs(FPSAnalyzer.getAverage() - fps);
            chai.expect(difference).to.be.lessThan(14);
            done();
        }, dt * i);
    });
});

describe("advanced measuring", function () {
    var FPSAnalyzer = new FPSAnalyzr.FPSAnalyzr(settings),
        differences = [-3, 0, 5, 14, 0, 14, 14, 14, -2, -1, 0, 1, 14, 0, 0, 3, 7],
        times = [0],
        fps = 60,
        dt = 1000 / fps,
        difference,
        i;


    for (i = 0; i < differences.length; i += 1) {
        times.push(times[times.length - 1] + dt + differences[i]);
    }

    for (i = 0; i < times.length; i += 1) {
        FPSAnalyzer.measure(times[i]);
    }

    it("takes manual measurements", function () {
        difference = Math.abs(FPSAnalyzer.getAverage() - 49);
        chai.expect(difference).to.be.lessThan(1);
    });

    it("computes median FPS", function () {
        difference = Math.abs(FPSAnalyzer.getMedian() - 56);
        chai.expect(difference).to.be.lessThan(1);
    });

    it("computes FPS extremes", function () {
        var extremes = FPSAnalyzer.getExtremes();

        chai.expect(Math.abs(extremes[0] - 32.6)).to.be.lessThan(1);
        chai.expect(Math.abs(extremes[1] - 68)).to.be.lessThan(1);
    });

    it("computes FPS range", function () {
        chai.expect(Math.abs(FPSAnalyzer.getRange() - 35.7)).to.be.lessThan(1);
    });
});