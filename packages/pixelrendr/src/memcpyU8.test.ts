import { expect } from "chai";

import { memcpyU8 } from "./memcpyU8";

describe("memcpyU8", () => {
    it("copies members of an array of equal length", (): void => {
        // Arrange
        const receiver: number[] = [0, 0, 0];
        const donor: number[] = [2, 3, 5];

        // Act
        memcpyU8(donor, receiver);

        // Assert
        expect(donor).to.deep.equal(receiver);
    });

    it("does not copy to an array of length 0", (): void => {
        // Arrange
        const receiver: number[] = [];
        const donor: number[] = [2, 3, 5];

        // Act
        memcpyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([]);
    });

    it("does not change receiver when donor has length 0", (): void => {
        // Arrange
        const receiver: number[] = [0, 0, 0];
        const donor: number[] = [];

        // Act
        memcpyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([0, 0, 0]);
    });

    it("copies all of the donor's elements when its length is less than the receiver's", (): void => {
        // Arrange
        const receiver: number[] = [0, 0, 0];
        const donor: number[] = [2, 3];

        // Act
        memcpyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([2, 3, 0]);
    });

    it("changes all of the receiver's elements when its length is less than the donor's", (): void => {
        // Arrange
        const receiver: number[] = [0, 0];
        const donor: number[] = [2, 3, 5];

        // Act
        memcpyU8(donor, receiver);

        // Assert
        expect(receiver).to.deep.equal([2, 3]);
    });
});
