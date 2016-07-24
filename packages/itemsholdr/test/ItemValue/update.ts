/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("bounds the value to the minimum limit", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
        valueDefault: "220",
        minimum: 200
    });

    // Act
    item.setValue(140);
    item.update();

    // Assert
    chai.expect(item.getValue()).to.equal(200);
});

mochaLoader.addTest("caps the value to the maximum limit", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
        valueDefault: "220",
        maximum: 450
    });

    // Act
    item.setValue(500);
    item.update();

    // Assert
    chai.expect(item.getValue()).to.equal(500);
});
