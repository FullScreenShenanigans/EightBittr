var prefix = "MyItemsHoldr::",
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
    ItemsHolder;

describe("constructor", function () {
    it("doesn't throw an error", function () {
        new ItemsHoldr.ItemsHoldr();
    });

    it("correctly sets general settings", function () {
        ItemsHolder = new ItemsHoldr.ItemsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "displayChanges": displayChanges,
            "values": values
        });

        chai.expect(ItemsHolder.getPrefix()).to.be.equal(prefix);
        chai.expect(ItemsHolder.getAutoSave()).to.be.equal(autoSave);
        chai.expect(ItemsHolder.getCallbackArgs()).to.be.equal(callbackArgs);
        chai.expect(ItemsHolder.getDisplayChanges()).to.be.equal(displayChanges);
    });
});

describe("storage", function () {
    it("initializes values to a given valueDefault", function () {
        chai.expect(ItemsHolder.getItem("lives")).to.be.equal(3);
    });

    it("initializes values to a given value", function () {
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(0);
    });

    it("sets values", function () {
        ItemsHolder.setItem("tries", 3);
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(3);
    });

    it("increases values", function () {
        ItemsHolder.increase("tries");
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(4);
    });

    it("decreases values", function () {
        ItemsHolder.decrease("tries");
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(3);
    });

    it("toggles values", function () {
        ItemsHolder.toggle("tries");
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(false);
        ItemsHolder.toggle("tries");
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(true);
    });
});

describe("localStorage", function () {
    var storage = {};

    it("may take in a localStorage", function () {
        ItemsHolder = new ItemsHoldr.ItemsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "values": values,
            "localStorage": storage
        });

        chai.expect(ItemsHolder.getLocalStorage()).to.be.equal(storage);
    });

    it("saves values", function () {
        ItemsHolder.saveAll();
        chai.expect(ItemsHolder.getLocalStorage()).to.be.deep.equal({
            "MyItemsHoldr::lives": "3",
            "MyItemsHoldr::tries": "0"
        });
    });

    it("retrieves values", function () {
        ItemsHolder = new ItemsHoldr.ItemsHoldr({
            "prefix": prefix,
            "autoSave": autoSave,
            "callbackArgs": callbackArgs,
            "values": values,
            "localStorage": storage
        });

        chai.expect(ItemsHolder.getItem("lives")).to.be.equal(3);
        chai.expect(ItemsHolder.getItem("tries")).to.be.equal(0);
    });
});

describe("HTML", function () {
    it("creates the container", function () {
        var container;

        values.lives.hasElement = true;
        values.tries.hasElement = true;

        ItemsHolder = new ItemsHoldr.ItemsHoldr({
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

        container = ItemsHolder.getContainer();

        chai.expect(container).to.not.be.undefined;
        chai.expect(container.tagName).to.be.equal("DIV");
        chai.expect(container.id).to.be.equal("ContainerOut");
        chai.expect(container.children).to.have.length(1);
        chai.expect(container.children[0].tagName).to.be.equal("SPAN");
        chai.expect(container.children[0].id).to.be.equal("ContainerIn");
    });

    it("creates value elements", function () {
        var children = ItemsHolder.getContainer().children[0].children;

        chai.expect(children[0].className).to.be.equal("MyItemsHoldr::_value lives");
        chai.expect(children[1].className).to.be.equal("MyItemsHoldr::_value tries");

        chai.expect(children[0].children[0].innerText).to.be.equal("lives");
        chai.expect(children[1].children[0].innerText).to.be.equal("tries");

        chai.expect(children[0].children[1].innerText).to.be.equal("3");
        chai.expect(children[1].children[1].innerText).to.be.equal("0");
    });

    it("updates value elements", function () {
        var children = ItemsHolder.getContainer().children[0].children;

        ItemsHolder.setItem("lives", 7);
        ItemsHolder.setItem("tries", 1);

        chai.expect(children[0].children[1].innerText).to.be.equal("7");
        chai.expect(children[1].children[1].innerText).to.be.equal("1");
    });
});