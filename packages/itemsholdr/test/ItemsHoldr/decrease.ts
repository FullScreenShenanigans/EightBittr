import { IItemsHoldr } from "../../src/IItemsHoldr";
import { mochaLoader } from "../main";
import { stubItemsHoldr } from "../utils/fakes";

mochaLoader.it("subtracts from a Number type value", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr({
        values: {
            weight: {
                valueDefault: 100
            }
        }
    });

    // Act
    itemsHolder.decrease("weight", 3);

    // Assert
    chai.expect(itemsHolder.getItem("weight")).to.equal(97);
});
