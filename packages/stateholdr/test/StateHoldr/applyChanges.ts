import { IChangeGroup, ICollection, IStateHoldr } from "../../src/IStateHoldr";
import { mochaLoader } from "../main";
import { stubCollection, stubStateHoldr } from "../utils/fakes";

mochaLoader.it("copies objects to a recipient", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();
    const recipient: IChangeGroup = {};

    // Act
    StateHolder.setCollection("exampleCollection", stubCollection());
    StateHolder.applyChanges("car", recipient);

    // Assert
    chai.expect(recipient).to.deep.equal({ color: "red" });
});

mochaLoader.it("only shallow copies objects to a recipient", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();
    const changedGroup: string = "car";
    const changedKey: string = "manufacturer";
    const collection: ICollection = {
        [changedGroup]: {
            [changedKey]: {
                color: "red"
            }
        }
    };
    const recipient: IChangeGroup = {};

    // Act
    StateHolder.setCollection("exampleCollection", collection);
    StateHolder.applyChanges(changedGroup, recipient);

    // Assert
    chai.expect(recipient[changedKey]).to.equal(collection[changedGroup][changedKey]);
});
