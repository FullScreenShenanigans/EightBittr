import { IPixel, IPixelRendr } from "../../src/IPixelRendr";
import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("resets the empty cache", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();
    const palette: IPixel[] = [
        [0, 0, 0, 255]
    ];

    // Act
    pixelRender.changePalette(palette);

    // Assert
    chai.expect(pixelRender.getBaseFiler().getCache()).to.deep.equal({});
});

mochaLoader.it("clears the cache with items in it", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();
    const palette: IPixel[] = [
        [0, 0, 0, 255]
    ];

    // Act
    pixelRender.decode(stubSpriteName, {});
    pixelRender.changePalette(palette);

    // Assert
    chai.expect(pixelRender.getBaseFiler().getCache()).to.deep.equal({});
});
