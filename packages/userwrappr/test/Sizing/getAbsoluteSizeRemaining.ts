import { expect } from "chai";

import { getAbsoluteSizeRemaining, IAbsoluteSizeSchema } from "../../src/Sizing";
import { it } from "../main";

it("subtracts height from the container height", () => {
    // Arrange
    const container: IAbsoluteSizeSchema = {
        height: 490,
        width: 350
    };
    const height = 210;

    // Act
    const absoluteSize: IAbsoluteSizeSchema = getAbsoluteSizeRemaining(container, height);

    // Assert
    expect(absoluteSize).to.be.deep.equal({
        height: 280,
        width: 350
    });
});
