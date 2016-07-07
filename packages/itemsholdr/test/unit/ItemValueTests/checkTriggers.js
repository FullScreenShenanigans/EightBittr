define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("calls the respective trigger function", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", {
                valueDefault: "red",
                triggers: {
                    red: function () {
                        this.setValue("black");
                    }
                }
            });

            // Act
            item.checkTriggers();

            // Assert
            expect(item.getValue()).to.equal("black");
        });
    };
});