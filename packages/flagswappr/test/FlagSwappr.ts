import { FlagSwappr } from "../src/flagSwappr";
import { mochaLoader } from "./main";

const [first, second, value] = ["first", "second", "value"];

mochaLoader.it("gets a feature setting from a first generation", (): void => {
    // Arrange
    const flagSwapper = new FlagSwappr<{ value: string }>({
        generations: {
            [first]: { value }
        }
    });

    // Act
    const currentValue = flagSwapper.flags.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets a feature setting from a second generation", (): void => {
    // Arrange
    const flagSwapper = new FlagSwappr<{ value: string }>({
        generations: {
            [first]: {},
            [second]: { value }
        },
        generation: second
    });

    // Act
    const currentValue = flagSwapper.flags.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets an overridden feature setting from a second generation", (): void => {
    // Arrange
    const flagSwapper = new FlagSwappr<{ value: string }>({
        generations: {
            [first]: {
                [value]: "wrong"
            },
            [second]: { value }
        },
        generation: second
    });

    // Act
    const currentValue = flagSwapper.flags.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets an first feature setting from resetting to a first generation", (): void => {
    // Arrange
    const flagSwapper = new FlagSwappr<{ value: string }>({
        generations: {
            [first]: {
                value: first
            },
            [second]: {
                value: second
            }
        },
        generation: second
    });

    // Act
    flagSwapper.setGeneration(first);
    const currentValue = flagSwapper.flags.value;

    // Assert
    chai.expect(currentValue).to.be.equal(first);
});

mochaLoader.it("gets a second feature setting from resetting to a second generation", (): void => {
    // Arrange
    const flagSwapper = new FlagSwappr<{ value: string }>({
        generations: {
            [first]: {
                value: first
            },
            [second]: {
                value: second
            }
        },
        generation: first
    });

    // Act
    flagSwapper.setGeneration(second);
    const currentValue = flagSwapper.flags.value;

    // Assert
    chai.expect(currentValue).to.be.equal(second);
});
