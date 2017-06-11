import { FeatureBoxr } from "../src/featureBoxr";
import { mochaLoader } from "./main";

const [first, second, value] = ["first", "second", "value"];

mochaLoader.it("gets a feature setting from a first generation", (): void => {
    // Arrange
    const featureBoxer = new FeatureBoxr<{ value: string }>({
        generations: {
            [first]: { value }
        }
    });

    // Act
    const currentValue = featureBoxer.features.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets a feature setting from a second generation", (): void => {
    // Arrange
    const featureBoxer = new FeatureBoxr<{ value: string }>({
        generations: {
            [first]: {},
            [second]: { value }
        },
        generation: second
    });

    // Act
    const currentValue = featureBoxer.features.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets an overridden feature setting from a second generation", (): void => {
    // Arrange
    const featureBoxer = new FeatureBoxr<{ value: string }>({
        generations: {
            [first]: {
                [value]: "wrong"
            },
            [second]: { value }
        },
        generation: second
    });

    // Act
    const currentValue = featureBoxer.features.value;

    // Assert
    chai.expect(currentValue).to.be.equal(value);
});

mochaLoader.it("gets an first feature setting from resetting to a first generation", (): void => {
    // Arrange
    const featureBoxer = new FeatureBoxr<{ value: string }>({
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
    featureBoxer.setGeneration(first);
    const currentValue = featureBoxer.features.value;

    // Assert
    chai.expect(currentValue).to.be.equal(first);
});

mochaLoader.it("gets an second feature setting from resetting to a second generation", (): void => {
    // Arrange
    const featureBoxer = new FeatureBoxr<{ value: string }>({
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
    featureBoxer.setGeneration(second);
    const currentValue = featureBoxer.features.value;

    // Assert
    chai.expect(currentValue).to.be.equal(second);
});
