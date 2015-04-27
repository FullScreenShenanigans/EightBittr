var prefix = "MyStatsHoldr",
    autoSave = true,
    callbackArgs = ["hello", "world"],
    defaults = {
        "valueDefault": 0,
        "onModular": 10
    },
    displayChanges = {
        "9": "max"
    },
    values = ["lives", "tries"],
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
            "defaults": defaults,
            "displayChanges": displayChanges,
            "values": values
        });

        chai.expect(StatsHolder.getPrefix()).to.be.equal(prefix);
        chai.expect(StatsHolder.getAutoSave()).to.be.equal(autoSave);
        chai.expect(StatsHolder.getCallbackArgs()).to.be.equal(callbackArgs);
        chai.expect(StatsHolder.getDefaults()).to.be.equal(defaults);
        chai.expect(StatsHolder.getDisplayChanges()).to.be.equal(displayChanges);
    });
})