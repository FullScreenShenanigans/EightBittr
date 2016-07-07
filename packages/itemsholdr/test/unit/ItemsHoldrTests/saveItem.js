define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("should throw an error", function () {
             // Arrange
             var ItemsHolder = mocks.mockItemsHoldr();

             // Assert
             expect(ItemsHolder.saveItem.bind(ItemsHolder, "color")).to.throw("Unknown key given to ItemsHoldr: 'color'.");
        });

        it("saves item to localStorage", function () {
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
             ItemsHolder.saveItem("color");

             // Assert
             expect(ItemsHolder.getObject("color").retrieveLocalStorage()).to.equal("blue");
        });
    };
});