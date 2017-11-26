import { expect } from "chai";

import { it } from "../../../main";
import { stubSaveableStore } from "./stubs";

it("sets the state on the store when given a new state", () => {
    // Arrange
    const { store } = stubSaveableStore();
    const newState = "def";

    // Act
    store.setValue(newState);

    // Assert
    expect(store.value).to.be.equal(newState);
});

it("saves the state when given a new state", () => {
    // Arrange
    const { getInitialValue, saveValue, store } = stubSaveableStore();
    const oldValue = getInitialValue();
    const newValue = "def";

    // Act
    store.setValue(newValue);

    // Assert
    expect(saveValue).to.have.been.calledWithExactly(newValue, oldValue);
});
