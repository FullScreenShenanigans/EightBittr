import { IItemsHoldr } from "../../src/IItemsHoldr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("adds to a Number type value", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            weight: {
                valueDefault: 100
            }
        }
    });

    // Act
    itemsHolder.increase("weight", 3);

    // Assert
    chai.expect(itemsHolder.getItem("weight")).to.equal(103);
});

mochaLoader.it("concatenates to a String type value", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            color: {
                valueDefault: "red"
            }
        }
    });

    // Act
    itemsHolder.increase("color", 3);

    // Assert
    chai.expect(itemsHolder.getItem("color")).to.equal("red3");
});
