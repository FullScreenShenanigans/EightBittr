var total = 0,
    games = [
        function () {
            total += 7;
        },
        function () {
            total *= 3;
        }
    ],
    interval = 16,
    speed = 1,
    onPause = function () {
        return "Paused!";
    },
    onPlay = function () {
        return "Playing!";
    },
    callbackArguments = [],
    upkeepScheduler = function (handler, timeout) {
        return setTimeout(handler, timeout);
    },
    upkeepCanceller = function (handle) {
        clearTimeout(handle);
    },
    FPSAnalyzer = new FPSAnalyzr.FPSAnalyzr({}),
    adjustFramerate = true,
    scope = {},
    getTimestamp,
    GamesRunner;

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
    it("throws an error if not given games", function () {
        chai.expect(function () {
            new GamesRunnr.GamesRunnr({});
        }).to.throw("No games given to GamesRunnr.");
    });

    it("doesn't throw an error when given games", function () {
        new GamesRunnr.GamesRunnr({
            "games": []
        });
    });

    it("stores the given member variables", function () {
        GamesRunner = new GamesRunnr.GamesRunnr({
            "games": games,
            "interval": interval,
            "speed": speed,
            "onPause": onPause,
            "onPlay": onPlay,
            "callbackArguments": callbackArguments,
            "upkeepScheduler": upkeepScheduler,
            "upkeepCanceller": upkeepCanceller,
            "FPSAnalyzer": FPSAnalyzer,
            "adjustFramerate": adjustFramerate,
            "scope": scope
        });

        chai.expect(GamesRunner.getGames()).to.be.equal(games);
        chai.expect(GamesRunner.getInterval()).to.be.equal(interval);
        chai.expect(GamesRunner.getSpeed()).to.be.equal(speed);
        chai.expect(GamesRunner.getOnPause()).to.be.equal(onPause);
        chai.expect(GamesRunner.getOnPlay()).to.be.equal(onPlay);
        chai.expect(GamesRunner.getCallbackArguments()).to.be.equal(callbackArguments);
        chai.expect(GamesRunner.getUpkeepScheduler()).to.be.equal(upkeepScheduler);
    });
});

describe("upkeep", function () {
    it("runs games in order", function (done) {
        GamesRunner = new GamesRunnr.GamesRunnr({
            "games": games
        });
        
        chai.expect(total).to.be.equal(0);
        GamesRunner.play();
        chai.expect(total).to.be.equal(21);
        GamesRunner.pause();
        chai.expect(total).to.be.equal(21);
        
        setTimeout(function () {
            chai.expect(total).to.be.equal(21);
            done();
        }, GamesRunner.getInterval() * 2 + 1);
    });
    
    it("schedules the next upkeep", function (done) {
        total = 0;
        
        GamesRunner.play();
        chai.expect(total).to.be.equal(21);
        
        setTimeout(function () {
            GamesRunner.pause();
            chai.expect(total).to.be.equal(84);
            done();
        }, GamesRunner.getInterval() + 1);
    });
});