import { IStateHoldr } from "../../src/IStateHoldr";
import { mochaLoader } from "../main";
import { stubCollection, stubItemsHoldr, stubStateHoldr } from "../utils/fakes";

mochaLoader.it("sets collectionKeyRaw", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.setCollection("newCollection", stubCollection());

    // Assert
    chai.expect(StateHolder.getCollectionKeyRaw()).to.equal("newCollection");
});

mochaLoader.it("sets collectionKey", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr({
        prefix: "prefix",
        ItemsHolder: stubItemsHoldr()
    });

    // Act
    StateHolder.setCollection("newCollection", stubCollection());

    // Assert
    chai.expect(StateHolder.getCollectionKey()).to.equal("prefixnewCollection");
});

mochaLoader.it("sets the collection", (): void => {
    // Arrange
    const StateHolder: IStateHoldr = stubStateHoldr();

    // Act
    StateHolder.setCollection("newCollection", stubCollection());

    // Assert
    chai.expect(StateHolder.getCollection()).to.deep.equal(stubCollection());
});
