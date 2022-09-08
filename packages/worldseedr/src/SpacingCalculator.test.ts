import { expect } from "chai";

import { RandomChooser } from "./RandomChooser";
import { SpacingCalculator } from "./SpacingCalculator";

describe("SpacingCalculator", () => {
    describe("calculate", () => {
        it("returns the number when given a number", () => {
            // Arrange
            const spacingCalculator = new SpacingCalculator(new RandomChooser(() => 0));
            const value = 123;

            // Act
            const result = spacingCalculator.calculate(value);

            // Assert
            expect(result).to.be.equal(value);
        });

        it("returns a value within the spacing when given a PossibilitySpacing without rounding units", () => {
            // Arrange
            const spacingCalculator = new SpacingCalculator(new RandomChooser(() => 0.5));

            // Act
            const result = spacingCalculator.calculate({ min: 12, max: 34 });

            // Assert
            expect(result).to.be.equal(23);
        });

        it("returns a rounded value within the spacing when given a PossibilitySpacing with rounding units", () => {
            // Arrange
            const spacingCalculator = new SpacingCalculator(new RandomChooser(() => 0.5));

            // Act
            const result = spacingCalculator.calculate({ min: 12, max: 34, roundTo: 10 });

            // Assert
            expect(result).to.be.equal(20);
        });

        it("returns a choice when given an array of possibilities", () => {
            // Arrange
            const spacingCalculator = new SpacingCalculator(new RandomChooser(() => 0.5));

            // Act
            const result = spacingCalculator.calculate([
                { probability: 40, value: { min: 0, max: 1 } },
                { probability: 60, value: { min: 2, max: 3 } },
            ]);

            // Assert
            expect(result).to.be.equal(3);
        });
    });
});
