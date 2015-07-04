var ItemsHolder = new ItemsHoldr.ItemsHoldr(
    {

    }),
    StateHolder,
    prefix = "StateHoldrText",
    collectionKey = "FirstCollection",
    itemKey = "fellow",
    collection;

describe("constructor", function () {
    it("throws an error when not given an ItemsHoldr", function () {
        chai.expect(function () {
            new StateHoldr.StateHoldr({});
        }).to.throw("No ItemsHolder given to StateHoldr.");
    });

    it("doesn't throw an error", function () {
        StateHolder = new StateHoldr.StateHoldr({
            "ItemsHolder": ItemsHolder,
            "prefix": prefix
        });
    });

    it("stores the ItemsHolder", function () {
        chai.expect(StateHolder.getItemsHolder()).to.be.equal(ItemsHolder);
    });

    it("stores the prefix", function () {
        chai.expect(StateHolder.getPrefix()).to.be.equal(prefix);
    });
});

describe("basic collection usage", function () {
    it("sets the current collection without error", function () {
        StateHolder.setCollection(collectionKey);
    });

    it("gets the current collection without error", function () {
        collection = StateHolder.getCollection();
        chai.expect(collection).to.not.be.undefined;
    });

    it("gets the current collection by key", function () {
        chai.expect(StateHolder.getOtherCollection(collectionKey)).to.be.equal(collection);
    });

    it("gets the current key", function () {
        chai.expect(StateHolder.getCollectionKeyRaw()).to.be.equal(collectionKey);
    });

    it("gets the current key with the prefix", function () {
        chai.expect(StateHolder.getCollectionKey()).to.be.equal(prefix + collectionKey);
    });
});

describe("collection changing", function () {
    it("adds a change to the collection without error", function () {
        StateHolder.addChange(itemKey, "age", 49);
    });

    it("retrives the change", function () {
        chai.expect(StateHolder.getChange(itemKey, "age")).to.be.equal(49);
    });

    it("retrives all changes", function () {
        chai.expect(StateHolder.getChanges(itemKey)).to.be.deep.equal({
            "age": 49
        });
    });

    it("stores the changes under the collection", function () {
        chai.expect(collection).to.be.deep.equal({
            "fellow": {
                "age": 49
            }
        });
    });
});
