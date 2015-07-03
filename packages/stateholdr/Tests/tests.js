var ItemsHolder = new ItemsHoldr.ItemsHoldr(
    {

    }),
    prefix = "StateHoldrText",
    StateHolder;

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
