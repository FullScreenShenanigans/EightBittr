define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("copies objects to a recipient", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();
            var recipient = {};

            // Act
            StateHolder.setCollection("exampleCollection", mocks.mockCollection());
            StateHolder.applyChanges("car", recipient);

            // Assert
            expect(recipient).to.deep.equal({ color: "red" });
        });

        it("only shallow copies objects to a recipient", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();
            var collection = {
                car: {
                    manufacturer: {
                        color: "red"
                    }
                }
            };
            var recipient = {};

            // Act
            StateHolder.setCollection("exampleCollection", collection);
            StateHolder.applyChanges("car", recipient);

            // Assert
            expect(recipient.manufacturer).to.equal(collection.car.manufacturer);
        });
    };
});