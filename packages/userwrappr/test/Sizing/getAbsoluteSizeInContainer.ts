import { expect } from "chai";

import { getAbsoluteSizeInContainer, IAbsoluteSizeSchema, IRelativeSizeSchema } from "../../src/Sizing";
import { it } from "../main";

it("keeps pixel sizes the same when given pixel sizes", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const requestedSize: IRelativeSizeSchema = {
        height: 350,
        width: 490,
    };

    // Act
    const absoluteSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(container, requestedSize);

    // Assert
    expect(absoluteSize).to.be.deep.equal(requestedSize);
});

it("calculates percentages when given percentage strings", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const requestedSize: IRelativeSizeSchema = {
        height: "50%",
        width: "100%",
    };

    // Act
    const absoluteSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(container, requestedSize);

    // Assert
    expect(absoluteSize).to.be.deep.equal({
        height: 245,
        width: 350
    });
});

it("throws an error for an invalid percentage string", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const requestedSize: IRelativeSizeSchema = {
        height: "50%",
        width: "invalid%",
    };

    // Act
    const action = () => {
        getAbsoluteSizeInContainer(container, requestedSize);
    };

    // Assert
    expect(action).to.throw("Relative size should be in percentage form.");
});
