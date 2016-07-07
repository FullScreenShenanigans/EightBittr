define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("bounds the value to the minimum limit", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
                valueDefault: "220",
                minimum: 200
            });

            // Act
            item.setValue(140);
            item.update();

            // Assert
            expect(item.getValue()).to.equal(200);
        });

        it("caps the value to the maximum limit", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
                valueDefault: "220",
                maximum: 450
            });

            // Act
            item.setValue(500);
            item.update();

            // Assert
            expect(item.getValue()).to.equal(500);
        });
    };
});