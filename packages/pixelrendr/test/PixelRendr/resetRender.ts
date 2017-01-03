import { IPixelRendr } from "../../src/IPixelRendr";
import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("throws an error if the render does not exist", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();

    // Act
    const action: Function = () => pixelRender.resetRender("X");

    // Assert
    chai.expect(action).to.throw("No render found for 'X'.");
});

mochaLoader.it("resets existing sprites for the render", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();

    // Act
    pixelRender.resetRender(stubSpriteName);

    // Assert
    chai.expect(pixelRender.getBaseFiler().get(stubSpriteName).sprites).to.deep.equal({});
});
