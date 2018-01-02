import { expect } from "chai";

import { AudioSetting, DefaultStorage } from "./Storage";

describe("DefaultStorage", () => {
    describe("getItem", () => {
        it("returns undefined when the value hasn't yet been stored", () => {
            // Arrange
            const storage = new DefaultStorage();

            // Act
            const value = storage.getItem(AudioSetting.Muted);

            // Assert
            expect(value).to.be.equal(undefined);
        });

        it("returns a stored value when the value has been stored", () => {
            // Arrange
            const storage = new DefaultStorage();
            const storedValue = "true";
            storage.setItem(AudioSetting.Muted, storedValue);

            // Act
            const retrievedValue = storage.getItem(AudioSetting.Muted);

            // Assert
            expect(retrievedValue).to.be.equal(storedValue);
        });
    });

    describe("setItem", () => {
        it("sets a new value", () => {
            // Arrange
            const storage = new DefaultStorage();
            const storedValue = "true";

            // Act
            storage.setItem(AudioSetting.Muted, storedValue);
            const retrievedValue = storage.getItem(AudioSetting.Muted);

            // Asser
            expect(retrievedValue).to.be.equal(storedValue);
        });
    });
});
