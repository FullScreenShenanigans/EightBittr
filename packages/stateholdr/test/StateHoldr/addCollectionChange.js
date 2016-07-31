/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />
mochaLoader.addTest("updates the current collection", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    // Act
    StateHolder.setCollection("exampleCollection", mocks.mockCollection());
    StateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");
    // Assert
    chai.expect(StateHolder.getCollection()).to.deep.equal(mocks.mockChangedCollection());
});
mochaLoader.addTest("updates a non-current collection", function () {
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
    chai.expect(StateHolder.getOtherCollection("exampleCollection")).to.deep.equal(mocks.mockChangedCollection());
});
