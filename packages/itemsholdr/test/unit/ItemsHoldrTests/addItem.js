define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("adds the item to keys", function () {
             // Arrange
             var ItemsHolder = mocks.mockItemsHoldr();

             // Act
             var item = ItemsHolder.addItem("color");

             // Act
             expect(ItemsHolder.itemKeys.length).to.equal(1);
        });

        it("leaves value as undefined if no settings passed in", function () {
             // Arrange
             var ItemsHolder = mocks.mockItemsHoldr();

             // Act
             var item = ItemsHolder.addItem("color");

             // Act
             expect(item.getValue()).to.equal(undefined);
        });
    };
});