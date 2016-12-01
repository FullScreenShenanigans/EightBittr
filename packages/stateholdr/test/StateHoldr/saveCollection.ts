import { IStateHoldr } from "../../src/IStateHoldr";
import { mochaLoader } from "../main";
import { stubCollection, stubStateHoldr } from "../utils/fakes";

mochaLoader.it("saves the collectionKeys list", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.setCollection("exampleCollection", stubCollection());
    StateHolder.saveCollection();

    // Assert
    chai.expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal(["StateHolderexampleCollection"]);
});

mochaLoader.it("saves collectionKeys as an empty array", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.saveCollection();

    // Assert
    chai.expect(StateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal([]);
});
