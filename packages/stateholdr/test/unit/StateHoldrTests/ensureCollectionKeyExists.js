define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("collectionKey is added to list of keys", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.ensureCollectionKeyExists("exampleCollection");

            // Assert
            expect(StateHolder.getCollectionKeys()).to.deep.equal(["exampleCollection"])
        });

        it("saves a list of collectionKeys to ItemsHolder", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.ensureCollectionKeyExists("exampleCollection");

            // Assert
            expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal(["exampleCollection"])
        });
    };
});