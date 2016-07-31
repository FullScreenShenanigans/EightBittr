/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("copies objects to a recipient", (): void => {
    // Arrange
    const StateHolder: StateHoldr.IStateHoldr = mocks.mockStateHoldr();
    const recipient: StateHoldr.IChangeGroup = {};

    // Act
    StateHolder.setCollection("exampleCollection", mocks.mockCollection());
    StateHolder.applyChanges("car", recipient);

    // Assert
    chai.expect(recipient).to.deep.equal({ color: "red" });
});

mochaLoader.addTest("only shallow copies objects to a recipient", (): void => {
    // Arrange
    const StateHolder: StateHoldr.IStateHoldr = mocks.mockStateHoldr();
    const changedGroup: string = "car";
    const changedKey: string = "manufacturer";
    const collection: StateHoldr.ICollection = {
        [changedGroup]: {
            [changedKey]: {
                color: "red"
            }
        }
    };
    const recipient: StateHoldr.IChangeGroup = {};

    // Act
    StateHolder.setCollection("exampleCollection", collection);
    StateHolder.applyChanges(changedGroup, recipient);

    // Assert
    chai.expect(recipient[changedKey]).to.equal(collection[changedGroup][changedKey]);
});
