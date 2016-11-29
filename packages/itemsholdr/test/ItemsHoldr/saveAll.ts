import { IItemsHoldr } from "../../src/IItemsHoldr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("saves changes to items to localStorage", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = fakes.stubItemsHoldr({
        values: {
            color: {
                valueDefault: "red"
            },
            weight: {
                valueDefault: 124
            }
        }
    });

    // Act
    itemsHolder.setItem("color", "blue");
    itemsHolder.saveAll();

    // Assert
    chai.expect(itemsHolder.getObject("color").retrieveLocalStorage()).to.equal("blue");
});
