define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("clears itemKeys", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr();

            // Act
            ItemsHolder.addItem("color", { value: "blue" });
            ItemsHolder.resetItemsToDefaults();

            // Assert
            expect(ItemsHolder.itemKeys).to.deep.equal([]);
        });

        it("clears items", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr();

            // Act
            ItemsHolder.addItem("color", { value: "blue" });
            ItemsHolder.resetItemsToDefaults();

            // Assert
            expect(ItemsHolder.items).to.deep.equal({});
        });      

        it("resets items to settings default values", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red"
                    }
                }
            });

            // Act
            ItemsHolder.setItem("color", "blue");
            ItemsHolder.resetItemsToDefaults();

            // Assert
            expect(ItemsHolder.getItem("color")).to.equal("red");
        });
    };
});