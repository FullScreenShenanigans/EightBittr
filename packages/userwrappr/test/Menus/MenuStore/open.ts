import { expect } from "chai";

import { VisualState } from "../../../src/Menus/MenuStore";
import { it } from "../../main";
import { stubMenuStore } from "./stubs";

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
