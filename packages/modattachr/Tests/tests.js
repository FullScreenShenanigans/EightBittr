var storeLocally = true,
    mods = [{
        "name": "Testing Mod",
        "description": "A mod used for testing a ModAttachr.",
        "author": {
            "name": "Josh Goldberg",
            "email": "josh@fullscreenmario.com"
        },
        "enabled": false,
        "events": {
            "onModEnable": function () {
                return "I am enabled!";
            },
            "onModDisable": function () {
                return "I am disabled!";
            },
            "log": function (mod) {
                var numLog = (mod.settings.numLogs += 1);
            }
        },
        "settings": {
            "numLogs": 0
        }
    }],
    ModAttacher;

describe("constructor", function () {
    it("runs", function () {
        ModAttacher = new ModAttachr.ModAttachr({
            "storeLocally": true,
            "mods": mods
        });
    });

    it("doesn't create a StatsHoldr when not required", function () {
        chai.expect(new ModAttachr.ModAttachr().getStatsHolder()).to.be.undefined;
        
    });

    it("creates a StatsHoldr when required", function () {
        chai.expect(ModAttacher.getStatsHolder()).to.not.be.undefined;
    });

    it("stores mods", function () {
        chai.expect(ModAttacher.getMods()).to.be.deep.equal({
            "Testing Mod": mods[0]
        });
    });

    it("creates an events listing", function () {
        chai.expect(ModAttacher.getEvents()).to.be.deep.equal({
            "onModEnable": [mods[0]],
            "onModDisable": [mods[0]],
            "log": [mods[0]]
        });
    });
});

describe("triggering and enabling", function () {
    it("enables mods", function () {
        chai.expect(ModAttacher.enableMod("Testing Mod")).to.be.equal("I am enabled!");
    });

    it("fires events", function () {
        var settings = ModAttacher.getMod("Testing Mod").settings;

        ModAttacher.fireEvent("log");
        chai.expect(settings.numLogs).to.be.equal(1);

        ModAttacher.fireEvent("log");
        chai.expect(settings.numLogs).to.be.equal(2);
    });

    it("disables mods", function () {
        chai.expect(ModAttacher.toggleMod("Testing Mod")).to.be.equal("I am disabled!");
    });
});
