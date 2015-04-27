var prefix = "MyStatsHoldr",
    autoSave = true,
    callbackArgs = ["hello", "world"],
    displayChanges = {
        "9": "max"
    },
    values = {
        "lives": {
            "valueDefault": 3
        },
        "tries": {
            "value": 0
        }
    },
    StatsHolder;

describe("constructor", function () {
    it("doesn't throw an error", function () {
        new StatsHoldr();
    });

    it("correctly sets general settings", function () {
        StatsHolder = new StatsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "displayChanges": displayChanges,
            "values": values
        });

        chai.expect(StatsHolder.getPrefix()).to.be.equal(prefix);
        chai.expect(StatsHolder.getAutoSave()).to.be.equal(autoSave);
        chai.expect(StatsHolder.getCallbackArgs()).to.be.equal(callbackArgs);
        chai.expect(StatsHolder.getDisplayChanges()).to.be.equal(displayChanges);
    });
});

describe("storage", function () {
    it("initializes values to a given valueDefault", function () {
        chai.expect(StatsHolder.get("lives")).to.be.equal(3);
    });

    it("initializes values to a given value", function () {
        chai.expect(StatsHolder.get("tries")).to.be.equal(0);
    });

    it("sets values", function () {
        StatsHolder.set("tries", 3);
        chai.expect(StatsHolder.get("tries")).to.be.equal(3);
    });

    it("increases values", function () {
        StatsHolder.increase("tries");
        chai.expect(StatsHolder.get("tries")).to.be.equal(4);
    });

    it("decreases values", function () {
        StatsHolder.decrease("tries");
        chai.expect(StatsHolder.get("tries")).to.be.equal(3);
    });

    it("toggles values", function () {
        StatsHolder.toggle("tries");
        chai.expect(StatsHolder.get("tries")).to.be.equal(0);
        StatsHolder.toggle("tries");
        chai.expect(StatsHolder.get("tries")).to.be.equal(1);
    });
});