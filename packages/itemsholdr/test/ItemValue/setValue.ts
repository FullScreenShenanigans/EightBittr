/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("calls transformSet if provided", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", {
        valueDefault: "red",
        transformSet: (value: string): string => `${value}_transformed`
    });

    // Act
    item.setValue("blue");

    // Assert
    chai.expect(item.getValue()).to.equal("blue_transformed");
});

mochaLoader.addTest("overwrites the current value as an empty string", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

    // Act
    item.setValue("");

    // Assert
    chai.expect(item.getValue()).to.equal("");
});

mochaLoader.addTest("updates value as an array", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

    // Act
    item.setValue([1, 2, 3]);

    // Assert
    chai.expect(item.getValue()).to.deep.equal([1, 2, 3]);
});

mochaLoader.addTest("updates value as an object", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

    // Act
    item.setValue({ foo: true });

    // Assert
    chai.expect(item.getValue()).to.deep.equal({ foo: true });
});

mochaLoader.addTest("updates value as a number", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

    // Act
    item.setValue(0);

    // Assert
    chai.expect(item.getValue()).to.equal(0);
});

mochaLoader.addTest("updates value as undefined", (): void => {
    // Arrange
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

    // Act
    item.setValue(undefined);

    // Assert
    chai.expect(item.getValue()).to.equal(undefined);
});
