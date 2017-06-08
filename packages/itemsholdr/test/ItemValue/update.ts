import { IItemValue } from "../../src/IItemValue";
import { mochaLoader } from "../main";
import { stubItemsHoldr, stubItemValue } from "../utils/fakes";

mochaLoader.it("bounds the value to the minimum limit", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "weight", {
        valueDefault: "220",
        minimum: 200
    });

    // Act
    item.setValue(140);
    item.update();

    // Assert
    chai.expect(item.getValue()).to.equal(200);
});

mochaLoader.it("caps the value to the maximum limit", (): void => {
    // Arrange
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "weight", {
        valueDefault: "220",
        maximum: 450
    });

    // Act
    item.setValue(500);
    item.update();

    // Assert
    chai.expect(item.getValue()).to.equal(500);
});
