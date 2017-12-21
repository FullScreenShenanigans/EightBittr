import { expect } from "chai";

import { proliferate } from "./proliferate";

describe("proliferate", () => {
    it("adds shallow properties to a recipient", (): void => {
        // Arrange
        const donor = {
            foo: true,
            bar: false,
        };
        const recipient: Partial<typeof donor> = {};

        // Act
        proliferate(recipient, donor);

        // Assert
        expect(donor.foo).to.be.equal(recipient.foo);
        expect(donor.bar).to.be.equal(recipient.bar);
    });

    it("adds deep copied objects to a recipient", (): void => {
        // Arrange
        const donor = {
            foo: {
                bar: true,
            },
        };
        const recipient: Partial<typeof donor> = {};

        // Act
        proliferate(recipient, donor);

        // Assert
        expect(donor.foo).to.be.deep.equal(recipient.foo);
        expect(donor.foo).to.not.be.equal(recipient.foo);
    });

    it("adds deep copied arrays to a recipient", (): void => {
        // Arrange
        const donor = {
            foo: [1, 2, 3],
        };
        const recipient: Partial<typeof donor> = {};

        // Act
        proliferate(recipient, donor);

        // Assert
        expect(donor.foo).to.be.deep.equal(recipient.foo);
        expect(donor.foo).to.not.be.equal(recipient.foo);
    });

    it("overrides existing properties", (): void => {
        // Arrange
        const donor = {
            foo: true,
        };
        const recipient = {
            foo: false,
        };

        // Act
        proliferate(recipient, donor);

        // Assert
        expect(donor.foo).to.be.equal(recipient.foo);
    });

    it("doesn't override existing properties when noOverrides is true", (): void => {
        // Arrange
        const recipient = {
            foo: false,
        };
        const donor = {
            foo: true,
        };

        // Act
        proliferate(recipient, donor, true);

        // Assert
        expect(donor.foo).to.not.be.equal(recipient.foo);
    });
});
