define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("saves changes to items to localStorage", function () {
             // Arrange
             var ItemsHolder = mocks.mockItemsHoldr({
                 values: {
                    color: {
                        valueDefault: "red"
                    },
                    weight: {
                        valueDefault: 124
                    }
                }
             });

             // Act
             ItemsHolder.setItem("color", "blue");
             ItemsHolder.saveAll();

             // Assert
             expect(ItemsHolder.getObject("color").retrieveLocalStorage()).to.equal("blue");
        });
    };
});