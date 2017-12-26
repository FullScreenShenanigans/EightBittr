import { expect } from "chai";

import { stubActionStore } from "./fakes.test";

describe("ActionStore", () => {
    describe("activate", () => {
        it("calls the action when activated", () => {
            // Arrange
            const { action, store } = stubActionStore();

            // Act
            store.activate();

            // Assert
            expect(action.calledOnce).to.be.equal(true);
        });
    });
});
