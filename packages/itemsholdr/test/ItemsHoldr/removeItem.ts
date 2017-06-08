import { IItemsHoldr } from "../../src/IItemsHoldr";
import { mochaLoader } from "../main";
import { stubItemsHoldr } from "../utils/fakes";

mochaLoader.it("removes item from itemKeys", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr();
    itemsHolder.addItem("color");

    // Act
    itemsHolder.removeItem("color");

    // Assert
    chai.expect(itemsHolder.getItemKeys().length).to.equal(0);
});

mochaLoader.it("removes item from container", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr({
        doMakeContainer: true,
        values: {
            color: {
                valueDefault: "red",
                hasElement: true
            }
        }
    });

    // Act
    itemsHolder.removeItem("color");

    // Assert
    chai.expect(itemsHolder.getContainer().hasChildNodes()).to.equal(false);
});

mochaLoader.it("removes item from localStorage", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr({
        values: {
            color: {
                valueDefault: "red",
                storeLocally: true
            }
        },
        autoSave: true
    });

    // Act
    itemsHolder.removeItem("color");

    // Assert
    chai.expect(itemsHolder.getLocalStorage().color).to.equal(undefined);
});
