define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("sets collectionKeyRaw", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.setCollection("newCollection", mocks.mockCollection());

            // Assert
            expect(StateHolder.getCollectionKeyRaw()).to.equal("newCollection");
        });

        it("sets collectionKey", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr({
                prefix: "prefix",
                ItemsHolder: mocks.mockItemsHoldr()
            });

            // Act
            StateHolder.setCollection("newCollection", mocks.mockCollection());

            // Assert
            expect(StateHolder.getCollectionKey()).to.equal("prefixnewCollection");
        });

        it("sets the collection", function () {
            // Arrange
            var StateHolder = mocks.mockStateHoldr();

            // Act
            StateHolder.setCollection("newCollection", mocks.mockCollection());

            // Assert
            expect(StateHolder.getCollection()).to.deep.equal(mocks.mockCollection());
        });
    };
});