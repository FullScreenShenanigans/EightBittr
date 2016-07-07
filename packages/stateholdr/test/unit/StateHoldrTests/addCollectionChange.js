define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("updates the current collection", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.setCollection("exampleCollection", mocks.mockCollection());
            StateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

            // Assert
            expect(StateHolder.getCollection()).to.deep.equal(mocks.mockChangedCollection());
        });

        it("updates a non-current collection", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();
            var collection = {
               car: {
                    color: "black"
                }
            };

            // Act
            StateHolder.setCollection("exampleCollection", mocks.mockCollection());
            StateHolder.setCollection("anotherCollection", collection);
            StateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

            // Assert
            expect(StateHolder.getOtherCollection("exampleCollection")).to.deep.equal(mocks.mockChangedCollection());
        });
    };
});