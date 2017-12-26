import { expect } from "chai";

import { stubMenuStore } from "./fakes.test";
import { VisualState } from "./MenuStore";

describe("MenuStore", () => {
    describe("close", () => {
        it("keeps the store closed when the store is closed", () => {
            // Arrange
            const { store } = stubMenuStore();

            // Act
            store.close();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Closed);
        });

        it("closes the store when the store is open", () => {
            // Arrange
            const { store } = stubMenuStore();
            store.open();

            // Act
            store.close();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Closed);
        });
    });

    describe("open", () => {
        it("opens the store when the store is closed", () => {
            // Arrange
            const { store } = stubMenuStore();

            // Act
            store.open();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Open);
        });

        it("keeps the store open when the store is open", () => {
            // Arrange
            const { store } = stubMenuStore();
            store.open();

            // Act
            store.open();

            // Assert
            expect(store.visualState).to.be.equal(VisualState.Open);
        });
    });
});
