import { IItemsHoldr } from "../../src/IItemsHoldr";
import { mochaLoader } from "../main";
import { stubItemsHoldr } from "../utils/fakes";

mochaLoader.it("clears contents from container", (): void => {
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
    itemsHolder.clear();

    // Assert
    chai.expect(itemsHolder.getContainer().hasChildNodes()).to.equal(false);
});
