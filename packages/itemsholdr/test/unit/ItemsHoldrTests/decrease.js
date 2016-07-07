define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("subtracts from a Number type value", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    weight: {
                        valueDefault: 100
                    }
                }
            });

            // Act
            ItemsHolder.decrease("weight", 3);

            // Assert
            expect(ItemsHolder.getItem("weight")).to.equal(97);
        });
    };
});