import { IStateHoldr } from "../../src/IStateHoldr";
import { mochaLoader } from "../main";
import { stubChangedCollection, stubCollection, stubStateHoldr } from "../utils/fakes";

mochaLoader.it("updates the collection's value", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.setCollection("exampleCollection", stubCollection());
    StateHolder.addChange("car", "color", "blue");

    // Assert
    chai.expect(StateHolder.getCollection()).to.deep.equal(stubChangedCollection());
});
