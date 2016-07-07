define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("saves the collectionKeys list", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.setCollection("exampleCollection", mocks.mockCollection());
            StateHolder.saveCollection();

            // Assert
            expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal(["StateHolderexampleCollection"]);
        });

        it("saves collectionKeys as an empty array", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.saveCollection();

            // Assert
            expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal([]);
        });
    };
});