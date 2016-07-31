/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />
mochaLoader.addTest("saves the collectionKeys list", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    // Act
    StateHolder.setCollection("exampleCollection", mocks.mockCollection());
    StateHolder.saveCollection();
    // Assert
    chai.expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal(["StateHolderexampleCollection"]);
});
mochaLoader.addTest("saves collectionKeys as an empty array", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    // Act
    StateHolder.saveCollection();
    // Assert
    chai.expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal([]);
});
