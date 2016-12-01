import { ICollection, IStateHoldr } from "../../src/IStateHoldr";
import { mochaLoader } from "../main";
import { stubChangedCollection, stubCollection, stubStateHoldr } from "../utils/fakes";

mochaLoader.it("updates the current collection", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.setCollection("exampleCollection", stubCollection());
    StateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

    // Assert
    chai.expect(StateHolder.getCollection()).to.deep.equal(stubChangedCollection());
});

mochaLoader.it("updates a non-current collection", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();
    const collection: ICollection = {
        car: {
            color: "black"
        }
    };

    // Act
    StateHolder.setCollection("exampleCollection", stubCollection());
    StateHolder.setCollection("anotherCollection", collection);
    StateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

    // Assert
    chai.expect(StateHolder.getOtherCollection("exampleCollection")).to.deep.equal(stubChangedCollection());
});
