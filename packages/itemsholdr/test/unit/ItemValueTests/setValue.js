define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("calls transformSet", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", {
                valueDefault: "red",
                transformSet: function (value) {
                    return value + "_transformed";
                }
            });

            // Act
            item.setValue("blue");

            // Assert
            expect(item.getValue()).to.equal("blue_transformed");
        });

        it("overwrites the current value as an empty string", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue("");

            // Assert
            expect(item.getValue()).to.equal("");
        });

        it("updates value as an array", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue([1, 2, 3]);

            // Assert
            expect(item.getValue()).to.deep.equal([1, 2, 3]);
        });

        it("updates value as an object", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue({ foo: true });

            // Assert
            expect(item.getValue()).to.deep.equal({ foo: true });
        });

        it("updates value as a number", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue(0);

            // Assert
            expect(item.getValue()).to.equal(0);
        });

        it("updates value as undefined", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue(undefined);

            // Assert
            expect(item.getValue()).to.equal(undefined);
        });
    };
});