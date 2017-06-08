import { IItemValue } from "../../src/IItemValue";
import { mochaLoader } from "../main";
import { stubItemsHoldr, stubItemValue, stubItemValueSettings } from "../utils/fakes";

mochaLoader.it("calls transformSet if provided", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", {
        valueDefault: "red",
        transformSet: (value: string): string => `${value}_transformed`
    });

    // Act
    item.setValue("blue");

    // Assert
    chai.expect(item.getValue()).to.equal("blue_transformed");
});

mochaLoader.it("overwrites the current value as an empty string", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", stubItemValueSettings());

    // Act
    item.setValue("");

    // Assert
    chai.expect(item.getValue()).to.equal("");
});

mochaLoader.it("updates value as an array", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", stubItemValueSettings());

    // Act
    item.setValue([1, 2, 3]);

    // Assert
    chai.expect(item.getValue()).to.deep.equal([1, 2, 3]);
});

mochaLoader.it("updates value as an object", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", stubItemValueSettings());

    // Act
    item.setValue({ foo: true });

    // Assert
    chai.expect(item.getValue()).to.deep.equal({ foo: true });
});

mochaLoader.it("updates value as a number", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", stubItemValueSettings());

    // Act
    item.setValue(0);

    // Assert
    chai.expect(item.getValue()).to.equal(0);
});

mochaLoader.it("updates value as undefined", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "color", stubItemValueSettings());

    // Act
    item.setValue(undefined);

    // Assert
    chai.expect(item.getValue()).to.equal(undefined);
});
