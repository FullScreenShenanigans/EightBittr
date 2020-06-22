import { expect } from "chai";

import { stubSaveableStore } from "./fakes.test";

describe("SaveableStore", () => {
    describe("setValue", () => {
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
            expect(saveValue).to.have.been.calledWithExactly(
                newValue,
                oldValue
            );
        });
    });

    describe("value", () => {
        it("sets the state on the store when given an initial state", () => {
            // Arrange
            const { getInitialValue, store } = stubSaveableStore();

            // Act
            const actualInitialValue = store.value;

            // Assert
            expect(actualInitialValue).to.be.equal(getInitialValue());
        });
    });
});
