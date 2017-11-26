import { expect } from "chai";

import { it } from "../../../main";
import { stubSaveableStore } from "./stubs";

it("sets the state on the store when given an initial state", () => {
    // Arrange
    const { getInitialValue, store } = stubSaveableStore();

    // Act
    const actualInitialValue = store.value;

    // Assert
    expect(actualInitialValue).to.be.equal(getInitialValue());
});
