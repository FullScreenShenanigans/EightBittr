import { expect } from "chai";

import { memCopyU8 } from "./memCopyU8";

describe("memCopyU8", () => {
    it("copies members of an array of equal length", (): void => {
        // Arrange
        const receiver = [0, 0, 0];
        const donor = [2, 3, 5];

        // Act
        memCopyU8(donor, receiver);

        // Assert
        expect(donor).to.deep.equal(receiver);
    });

    it("does not copy to an array of length 0", (): void => {
        // Arrange
        const receiver: number[] = [];
        const donor = [2, 3, 5];

        // Act
        memCopyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([]);
    });

    it("does not change receiver when donor has length 0", (): void => {
        // Arrange
        const receiver = [0, 0, 0];
        const donor: number[] = [];

        // Act
        memCopyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([0, 0, 0]);
    });

    it("copies all of the donor's elements when its length is less than the receiver's", (): void => {
        // Arrange
        const receiver = [0, 0, 0];
        const donor = [2, 3];

        // Act
        memCopyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([2, 3, 0]);
    });

    it("changes all of the receiver's elements when its length is less than the donor's", (): void => {
        // Arrange
        const receiver = [0, 0];
        const donor = [2, 3, 5];

        // Act
        memCopyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([2, 3]);
    });
});
