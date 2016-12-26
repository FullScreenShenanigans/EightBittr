import { IItemsHoldr } from "../../src/IItemsHoldr";
import { stubItemsHoldr } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("adds the item to keys", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr();

    // Act
    itemsHolder.addItem("color");

    // Act
    chai.expect(itemsHolder.getItemKeys().length).to.equal(1);
});

mochaLoader.it("leaves value as undefined if no settings passed in", (): void => {
    // Arrange
    const itemsHolder: IItemsHoldr = stubItemsHoldr();

    // Act
    const item = itemsHolder.addItem("color");

    // Act
    chai.expect(item.getValue()).to.equal(undefined);
});
