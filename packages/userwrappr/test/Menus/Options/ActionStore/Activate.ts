import { expect } from "chai";

import { it } from "../../../main";
import { stubActionStore } from "./stubs";

it("calls the action when activated", () => {
    // Arrange
    const { action, store } = stubActionStore();

    // Act
    store.activate();

    // Assert
    expect(action.calledOnce).to.be.equal(true);
});
