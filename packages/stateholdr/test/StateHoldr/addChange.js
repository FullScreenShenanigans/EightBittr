/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />
mochaLoader.addTest("updates the collection's value", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    // Act
    StateHolder.setCollection("exampleCollection", mocks.mockCollection());
    StateHolder.addChange("car", "color", "blue");
    // Assert
    chai.expect(StateHolder.getCollection()).to.deep.equal(mocks.mockChangedCollection());
});
