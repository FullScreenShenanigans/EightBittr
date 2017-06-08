import { IItemsHoldr } from "../../src/IItemsHoldr";
import { mochaLoader } from "../main";
import { stubItemsHoldr } from "../utils/fakes";

mochaLoader.it("should throw an error for an unknown item", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr();

    // Act
    const test: Function = (): void => itemsHolder.saveItem("color");

    // Assert
    chai.expect(test).to.throw("Unknown key given to ItemsHoldr: 'color'.");
});

mochaLoader.it("saves item to localStorage", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr({
        values: {
            color: {
                valueDefault: "red"
            }
        }
    });

    // Act
    itemsHolder.setItem("color", "blue");
    itemsHolder.saveItem("color");

    // Assert
    chai.expect(itemsHolder.getObject("color").retrieveLocalStorage()).to.equal("blue");
});
