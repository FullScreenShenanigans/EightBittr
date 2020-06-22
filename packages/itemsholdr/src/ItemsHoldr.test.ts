import { expect } from "chai";

import { stubItemsHoldr } from "./fakes";

describe("ItemsHoldr", () => {
    describe("addItem", () => {
        it("adds the item to keys", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr();

            // Act
            itemsHolder.addItem("color");

            // Act
            expect(itemsHolder.length).to.equal(1);
        });

        it("leaves value as undefined if no settings passed in", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder } = stubItemsHoldr();

            // Act
            itemsHolder.addItem(itemName);

            // Act
            expect(itemsHolder.getItem(itemName)).to.equal(undefined);
        });
    });

    describe("decrease", () => {
        it("subtracts from a Number type value", (): void => {
            // Arrange
            const itemName = "weight";
            const original = 100;
            const decrease = 3;
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: original,
                    },
                },
            });

            // Act
            itemsHolder.decrease(itemName, decrease);

            // Assert
            expect(itemsHolder.getItem(itemName)).to.equal(original - decrease);
        });
    });

    describe("increase", () => {
        it("adds to a Number type value", (): void => {
            // Arrange
            const itemName = "weight";
            const original = 100;
            const increase = 3;
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    weight: {
                        valueDefault: original,
                    },
                },
            });

            // Act
            itemsHolder.increase(itemName, increase);

            // Assert
            expect(itemsHolder.getItem(itemName)).to.equal(original + increase);
        });

        it("concatenates to a String type value", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.increase(itemName, "3");

            // Assert
            expect(itemsHolder.getItem(itemName)).to.equal("red3");
        });
    });

    describe("removeItem", () => {
        it("removes item from itemKeys", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder } = stubItemsHoldr();
            itemsHolder.addItem(itemName);

            // Act
            itemsHolder.removeItem(itemName);

            // Assert
            expect(itemsHolder.length).to.equal(0);
        });

        it("removes item from storage", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder, storage } = stubItemsHoldr({
                autoSave: true,
                values: {
                    [itemName]: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.removeItem(itemName);

            // Assert
            expect(storage.getItem(itemName)).to.equal(undefined);
        });
    });

    describe("saveAll", () => {
        it("saves changes to items to storage", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: "red",
                    },
                },
            });

            itemsHolder.setItem(itemName, "blue");

            // Act
            itemsHolder.saveAll();

            // Assert
            expect(storage.getItem(itemName)).to.equal('"blue"');
        });

        it("doesn't save changes to unchanged item defaults", (): void => {
            // Arrange
            const itemName = "weight";
            const weight = 124;
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: weight,
                    },
                },
            });

            // Act
            itemsHolder.saveAll();

            // Assert
            expect(storage.getItem(itemName)).to.equal(undefined);
        });
    });

    describe("saveItem", () => {
        it("throws an error for an unknown item", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder } = stubItemsHoldr();

            // Act
            const test = (): void => {
                itemsHolder.saveItem(itemName);
            };

            // Assert
            expect(test).to.throw(
                `Unknown key given to ItemsHoldr: '${itemName}'.`
            );
        });

        it("saves item to storage", (): void => {
            // Arrange
            const itemName = "color";
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.setItem(itemName, "blue");
            itemsHolder.saveItem(itemName);

            // Assert
            expect(storage.getItem(itemName)).to.equal('"blue"');
        });
    });

    describe("toggle", () => {
        it("switches from true to false", (): void => {
            // Arrange
            const itemName = "alive";
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: true,
                    },
                },
            });

            // Act
            itemsHolder.toggle(itemName);

            // Assert
            expect(itemsHolder.getItem(itemName)).to.equal(false);
        });

        it("switches from false to true", (): void => {
            // Arrange
            const itemName = "alive";
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    [itemName]: {
                        valueDefault: false,
                    },
                },
            });

            // Act
            itemsHolder.toggle(itemName);

            // Assert
            expect(itemsHolder.getItem(itemName)).to.equal(true);
        });
    });
});
