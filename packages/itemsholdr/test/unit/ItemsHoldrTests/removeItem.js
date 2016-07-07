define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("removes item from itemKeys", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr();
            ItemsHolder.addItem("color");

            // Act
            ItemsHolder.removeItem("color");

	        // Assert
            expect(ItemsHolder.itemKeys.length).to.equal(0);
        });

        it("removes item from container", function () {
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
            ItemsHolder.removeItem("color");

            // Assert
            expect(ItemsHolder.container.hasChildNodes()).to.equal(false);
        });

        it("removes item from localStorage", function () {
            // Arrange
            var ItemsHolder = mocks.mockItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red",
                        storeLocally: true
                    }
                },
                autoSave: true
            });

            // Act
            ItemsHolder.removeItem("color");

            // Assert
            expect(ItemsHolder.getLocalStorage()["color"]).to.equal(undefined);
        });
    };
});