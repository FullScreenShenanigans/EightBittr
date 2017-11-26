import { expect } from "chai";

import { VisualState } from "../../../src/Menus/MenuStore";
import { it } from "../../main";
import { stubMenuStore } from "./stubs";

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
