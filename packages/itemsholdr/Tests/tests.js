var prefix = "MyStatsHoldr::",
    autoSave = true,
    callbackArgs = ["hello", "world"],
    values = {
        "lives": {
            "valueDefault": 3
        },
        "tries": {
            "value": 0
        }
    },
    displayChanges = {
        "9": "max"
    },
    storage = {},
    StatsHolder;

describe("constructor", function () {
    it("doesn't throw an error", function () {
        new StatsHoldr.StatsHoldr();
    });

    it("correctly sets general settings", function () {
        StatsHolder = new StatsHoldr.StatsHoldr({
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
        chai.expect(StatsHolder.getItem("lives")).to.be.equal(3);
    });

    it("initializes values to a given value", function () {
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(0);
    });

    it("sets values", function () {
        StatsHolder.setItem("tries", 3);
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(3);
    });

    it("increases values", function () {
        StatsHolder.increase("tries");
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(4);
    });

    it("decreases values", function () {
        StatsHolder.decrease("tries");
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(3);
    });

    it("toggles values", function () {
        StatsHolder.toggle("tries");
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(0);
        StatsHolder.toggle("tries");
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(1);
    });
});

describe("storage", function () {
    var storage = {};

    it("may take in a localStorage", function () {
        StatsHolder = new StatsHoldr.StatsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "values": values,
            "localStorage": storage
        });

        chai.expect(StatsHolder.getLocalStorage()).to.be.equal(storage);
    });

    it("saves values", function () {
        StatsHolder.saveAll();
        chai.expect(StatsHolder.getLocalStorage()).to.be.deep.equal({
            "MyStatsHoldr::lives": "3",
            "MyStatsHoldr::tries": "0"
        });
    });

    it("retrieves values", function () {
        StatsHolder = new StatsHoldr.StatsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "values": values,
            "localStorage": storage
        });

        chai.expect(StatsHolder.getItem("lives")).to.be.equal(3);
        chai.expect(StatsHolder.getItem("tries")).to.be.equal(0);
    });
});

describe("HTML", function () {
    it("creates the container", function () {
        var container;

        values.lives.hasElement = true;
        values.tries.hasElement = true;

        StatsHolder = new StatsHoldr.StatsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "values": values,
            "displayChanges": displayChanges,
            "doMakeContainer": true,
            "containersArguments": [
                [
                    "div",
                    {
                        "id": "ContainerOut"
                    }
                ],
                [
                    "span",
                    {
                        "id": "ContainerIn"
                    }
                ]
            ]
        });

        container = StatsHolder.getContainer();

        chai.expect(container).to.not.be.undefined;
        chai.expect(container.tagName).to.be.equal("DIV");
        chai.expect(container.id).to.be.equal("ContainerOut");
        chai.expect(container.children).to.have.length(1);
        chai.expect(container.children[0].tagName).to.be.equal("SPAN");
        chai.expect(container.children[0].id).to.be.equal("ContainerIn");
    });

    it("creates value elements", function () {
        var children = StatsHolder.getContainer().children[0].children;

        chai.expect(children[0].className).to.be.equal("MyStatsHoldr::_value lives");
        chai.expect(children[1].className).to.be.equal("MyStatsHoldr::_value tries");

        chai.expect(children[0].children[0].innerText).to.be.equal("lives");
        chai.expect(children[1].children[0].innerText).to.be.equal("tries");

        chai.expect(children[0].children[1].innerText).to.be.equal("3");
        chai.expect(children[1].children[1].innerText).to.be.equal("0");
    });

    it("updates value elements", function () {
        var children = StatsHolder.getContainer().children[0].children;

        StatsHolder.setItem("lives", 7);
        StatsHolder.setItem("tries", 1);

        chai.expect(children[0].children[1].innerText).to.be.equal("7");
        chai.expect(children[1].children[1].innerText).to.be.equal("1");
    });
});