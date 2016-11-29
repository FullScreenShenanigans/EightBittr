import { IItemsHoldr } from "../../src/IItemsHoldr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("subtracts from a Number type value", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
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
