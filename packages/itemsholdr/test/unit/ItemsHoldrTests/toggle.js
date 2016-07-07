define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("switches to the opposite boolean value", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    alive: {
                        valueDefault: true
                    }
                }
            });

            // Act
            ItemsHolder.toggle("alive");

            // Assert
            expect(ItemsHolder.getItem("alive")).to.equal(false);
        });
    };
});