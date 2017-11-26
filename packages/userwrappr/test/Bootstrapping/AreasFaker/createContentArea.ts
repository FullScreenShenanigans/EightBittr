import { expect } from "chai";

import { IAbsoluteSizeSchema } from "../../../src/Sizing";
import { it } from "../../main";
import { stubAreasFaker } from "./stubs";

it("vertically fills the content size to the container excluding the menu area", () => {
    // Arrange
    const areasFaker = stubAreasFaker();
    const stubContainerSize: IAbsoluteSizeSchema = {
        height: 350,
        width: 490
    };
    const stubMenuAreaSize: IAbsoluteSizeSchema = {
        height: 140,
        width: 210
    };

    // Act
    const { contentSize } = areasFaker.createContentArea(stubContainerSize, stubMenuAreaSize);

    // Assert
    expect(contentSize).to.be.deep.equal({
        height: 210,
        width: 490
    });
});

it("matches its content area size style to the returned content size", () => {
    // Arrange
    const areasFaker = stubAreasFaker();
    const stubContainerSize: IAbsoluteSizeSchema = {
        height: 350,
        width: 490
    };
    const stubMenuAreaSize: IAbsoluteSizeSchema = {
        height: 140,
        width: 210
    };

    // Act
    const { contentArea, contentSize } = areasFaker.createContentArea(stubContainerSize, stubMenuAreaSize);

    // Assert
    expect(contentArea.style).to.contain({
        height: `${contentSize.height}px`,
        width: `${contentSize.width}px`
    });
});
