import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("throws an error if the render does not exist", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    const action = () => PixelRender.resetRender("X");

    // Assert
    chai.expect(action).to.throw("No render found for 'X'.");
});

mochaLoader.it("resets existing sprites for the render", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    PixelRender.resetRender(stubSpriteName);

    // Assert
    chai.expect(PixelRender.getBaseFiler().get(stubSpriteName).sprites).to.deep.equal({})
});
