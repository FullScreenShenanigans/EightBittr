define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("adds to a Number type value", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    weight: {
                        valueDefault: 100
                    }
                }
            });

            // Act
            ItemsHolder.increase("weight", 3);

            // Assert
            expect(ItemsHolder.getItem("weight")).to.equal(103);
        });

        it("concatenates to a String type value", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red"
                    }
                }
            });

            // Act
            ItemsHolder.increase("color", 3);

            // Assert
            expect(ItemsHolder.getItem("color")).to.equal("red3");
        });
    };
});