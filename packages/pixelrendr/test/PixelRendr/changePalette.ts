import { IPixel } from "../../src/IPixelRendr";
import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("resets the empty cache", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();
    const palette: IPixel[] = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.changePalette(palette);

    // Assert
    chai.expect(PixelRender.getBaseFiler().getCache()).to.deep.equal({});
});

mochaLoader.it("clears the cache with items in it", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();
    const palette: IPixel[] = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.getSpriteBase(stubSpriteName);
    PixelRender.changePalette(palette);

    // Assert
    chai.expect(PixelRender.getBaseFiler().getCache()).to.deep.equal({});
});
