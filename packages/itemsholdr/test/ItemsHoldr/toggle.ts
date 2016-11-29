import { IItemsHoldr } from "../../src/IItemsHoldr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("switches from true to false", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            alive: {
                valueDefault: true
            }
        }
    });

    // Act
    itemsHolder.toggle("alive");

    // Assert
    chai.expect(itemsHolder.getItem("alive")).to.equal(false);
});

mochaLoader.it("switches from false to true", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            alive: {
                valueDefault: false
            }
        }
    });

    // Act
    itemsHolder.toggle("alive");

    // Assert
    chai.expect(itemsHolder.getItem("alive")).to.equal(true);
});
