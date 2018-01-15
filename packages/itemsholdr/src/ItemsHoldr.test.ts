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
            const { itemsHolder } = stubItemsHoldr();

            // Act
            itemsHolder.addItem("color");

            // Act
            expect(itemsHolder.getItem("color")).to.equal(undefined);
        });
    });

    describe("decrease", () => {
        it("subtracts from a Number type value", (): void => {
            // Arrange
            const original = 100;
            const decrease = 3;
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    weight: {
                        valueDefault: original,
                    },
                },
            });

            // Act
            itemsHolder.decrease("weight", decrease);

            // Assert
            expect(itemsHolder.getItem("weight")).to.equal(original - decrease);
        });
    });

    describe("increase", () => {
        it("adds to a Number type value", (): void => {
            // Arrange
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
            itemsHolder.increase("weight", increase);

            // Assert
            expect(itemsHolder.getItem("weight")).to.equal(original + increase);
        });

        it("concatenates to a String type value", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.increase("color", "3");

            // Assert
            expect(itemsHolder.getItem("color")).to.equal("red3");
        });
    });

    describe("removeItem", () => {
        it("removes item from itemKeys", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr();
            itemsHolder.addItem("color");

            // Act
            itemsHolder.removeItem("color");

            // Assert
            expect(itemsHolder.length).to.equal(0);
        });

        it("removes item from storage", (): void => {
            // Arrange
            const { itemsHolder, storage } = stubItemsHoldr({
                autoSave: true,
                values: {
                    color: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.removeItem("color");

            // Assert
            expect(storage.color).to.equal(undefined);
        });
    });

    describe("saveAll", () => {
        it("saves changes to items to storage", (): void => {
            // Arrange
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red",
                    },
                },
            });

            itemsHolder.setItem("color", "blue");

            // Act
            itemsHolder.saveAll();

            // Assert
            expect(storage.getItem("color")).to.equal('"blue"');
        });

        it("doesn't save changes to unchanged item defaults", (): void => {
            // Arrange
            const weight = 124;
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    weight: {
                        valueDefault: weight,
                    },
                },
            });

            // Act
            itemsHolder.saveAll();

            // Assert
            expect(storage.getItem("weight")).to.equal(undefined);
        });
    });

    describe("saveItem", () => {
        it("throws an error for an unknown item", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr();

            // Act
            const test = (): void => {
                itemsHolder.saveItem("color");
            };

            // Assert
            expect(test).to.throw("Unknown key given to ItemsHoldr: 'color'.");
        });

        it("saves item to storage", (): void => {
            // Arrange
            const { itemsHolder, storage } = stubItemsHoldr({
                values: {
                    color: {
                        valueDefault: "red",
                    },
                },
            });

            // Act
            itemsHolder.setItem("color", "blue");
            itemsHolder.saveItem("color");

            // Assert
            expect(storage.getItem("color")).to.equal('"blue"');
        });
    });

    describe("toggle", () => {
        it("switches from true to false", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    alive: {
                        valueDefault: true,
                    },
                },
            });

            // Act
            itemsHolder.toggle("alive");

            // Assert
            expect(itemsHolder.getItem("alive")).to.equal(false);
        });

        it("switches from false to true", (): void => {
            // Arrange
            const { itemsHolder } = stubItemsHoldr({
                values: {
                    alive: {
                        valueDefault: false,
                    },
                },
            });

            // Act
            itemsHolder.toggle("alive");

            // Assert
            expect(itemsHolder.getItem("alive")).to.equal(true);
        });
    });
});
