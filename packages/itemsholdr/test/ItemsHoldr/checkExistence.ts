import { IItemsHoldr } from "../../src/IItemsHoldr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("should not throw an error if the key exists", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            color: {}
        }
    });

    // Act
    const test: Function = (): void => itemsHolder.checkExistence("color");

    // Assert
    chai.expect(test).not.to.throw();
});

mochaLoader.it("should throw an error if the key does not exist", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({ allowNewItems: false });

    // Act
    const test: Function = (): void => itemsHolder.checkExistence("color");

    // Assert
    chai.expect(test).to.throw("Unknown key given to ItemsHoldr: 'color'.");
});
