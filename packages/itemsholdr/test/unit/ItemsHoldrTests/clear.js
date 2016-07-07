define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("clears contents from container", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                doMakeContainer: true,
                values: {
                    color: {
                        valueDefault: "red",
                        hasElement: true,
                        element: {}
                    }
                }
            });

            // Act
            ItemsHolder.clear();

            // Assert
            expect(ItemsHolder.container.hasChildNodes()).to.equal(false);
        });
    };
});