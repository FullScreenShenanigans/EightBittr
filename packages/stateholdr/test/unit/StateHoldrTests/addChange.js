define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("updates the collection's value", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.setCollection("exampleCollection", mocks.mockCollection());
            StateHolder.addChange("car", "color", "blue");

            // Assert
            expect(StateHolder.getCollection()).to.deep.equal(mocks.mockChangedCollection());
        });
    };
});