import { expect } from "chai";

import { FlagSwappr } from "./FlagSwappr";

const [first, second, value] = ["first", "second", "value"];

describe("FlagSwappr", () => {
    it("gets a feature setting from a first generation", (): void => {
        // Arrange
        const flagSwapper = new FlagSwappr<{ value: string }>({
            generations: {
                [first]: { value },
            },
        });

        // Act
        const currentValue = flagSwapper.flags.value;

        // Assert
        expect(currentValue).to.be.equal(value);
    });

    it("gets a feature setting from a second generation", (): void => {
        // Arrange
        const flagSwapper = new FlagSwappr<{ value: string }>({
            generation: second,
            generations: {
                [first]: {},
                [second]: { value },
            },
        });

        // Act
        const currentValue = flagSwapper.flags.value;

        // Assert
        expect(currentValue).to.be.equal(value);
    });

    it("gets an overridden feature setting from a second generation", (): void => {
        // Arrange
        const flagSwapper = new FlagSwappr<{ value: string }>({
            generation: second,
            generations: {
                [first]: {
                    [value]: "wrong",
                },
                [second]: { value },
            },
        });

        // Act
        const currentValue = flagSwapper.flags.value;

        // Assert
        expect(currentValue).to.be.equal(value);
    });

    it("gets an first feature setting from resetting to a first generation", (): void => {
        // Arrange
        const flagSwapper = new FlagSwappr<{ value: string }>({
            generation: second,
            generations: {
                [first]: {
                    value: first,
                },
                [second]: {
                    value: second,
                },
            },
        });

        // Act
        flagSwapper.setGeneration(first);
        const currentValue = flagSwapper.flags.value;

        // Assert
        expect(currentValue).to.be.equal(first);
    });

    it("gets a second feature setting from resetting to a second generation", (): void => {
        // Arrange
        const flagSwapper = new FlagSwappr<{ value: string }>({
            generation: first,
            generations: {
                [first]: {
                    value: first,
                },
                [second]: {
                    value: second,
                },
            },
        });

        // Act
        flagSwapper.setGeneration(second);
        const currentValue = flagSwapper.flags.value;

        // Assert
        expect(currentValue).to.be.equal(second);
    });
});
