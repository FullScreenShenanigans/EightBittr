import { expect } from "chai";

import { RandomChooser } from "./RandomChooser";

describe("RandomChooser", () => {
    describe("chooseAmong", () => {
        it("returns the only choice when there is only one", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0.99);
            const value = "val";

            // Act
            const result = randomChooser.chooseAmong([{ probability: 100, value }]);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("returns the first choice when its probability is the first reached", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0.5);
            const value = "first";

            // Act
            const result = randomChooser.chooseAmong([
                { probability: 60, value },
                { probability: 40, value: "incorrect" },
            ]);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("returns the second choice when its probability is the first reached", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0.5);
            const value = "first";

            // Act
            const result = randomChooser.chooseAmong([
                { probability: 40, value: "incorrect" },
                { probability: 60, value },
            ]);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("throws an error when the goal probability is never reached", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0.99);
            const value = "val";

            // Act
            const act = () => randomChooser.chooseAmong([{ probability: 5, value }]);

            // Assert
            expect(act).to.throw("Choices only reached sum 5 out of goal 99.");
        });
    });

    describe("chooseFixedOrRandom", () => {
        it("returns the value when given a value", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0);
            const value = "val";

            // Act
            const result = randomChooser.chooseFixedOrRandom(value);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("returns a choice value when given choices", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0.5);
            const value = "first";

            // Act
            const result = randomChooser.chooseFixedOrRandom([
                { probability: 40, value: "incorrect" },
                { probability: 60, value },
            ]);

            // Assert
            expect(result).to.be.equal(value);
        });
    });

    describe("chooseFixedOrRandomOr", () => {
        it("returns the default value when the value doesn't exist", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0);
            const value = "val";

            // Act
            const result = randomChooser.chooseFixedOrRandomOr(undefined, value);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("returns the value when given a value", () => {
            // Arrange
            const randomChooser = new RandomChooser(() => 0);
            const value = "val";

            // Act
            const result = randomChooser.chooseFixedOrRandomOr(value, "incorrect");

            // Assert
            expect(result).to.be.equal(value);
        });
    });
});
