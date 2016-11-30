import { mochaLoader } from "../main";
import { stubPixelRendr } from "../utils/fakes";

mochaLoader.it("returns the palettes as Uint8ClampedArray with a zero color at the front", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    const palette = PixelRender.generatePaletteFromRawData(new Uint8ClampedArray([0, 9, 0, 8]), true);

    // Assert
    chai.expect(palette[0]).to.deep.equal(new Uint8ClampedArray([0, 0, 0, 0]));
});

mochaLoader.it("returns the palettes as Uint8ClampedArray if forceZeroColor is false", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    const palette = PixelRender.generatePaletteFromRawData(new Uint8ClampedArray([0, 9, 0, 8]));

    // Assert
    chai.expect(palette[0]).to.deep.equal(new Uint8ClampedArray([0, 9, 0, 8]));
});

mochaLoader.it("returns the palettes as arrays if forceZeroColor is false", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    const palette = PixelRender.generatePaletteFromRawData(new Uint8ClampedArray([0, 9, 0, 8]), false, true);

    // Assert
    chai.expect(palette).to.deep.equal([[0, 9, 0, 8]]);
});

mochaLoader.it("returns the palettes as arrays if forceZeroColor is true", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Act
    const palette = PixelRender.generatePaletteFromRawData(new Uint8ClampedArray([0, 9, 0, 8]), true, true);

    // Assert
    chai.expect(palette).to.deep.equal([[0, 0, 0, 0], [0, 9, 0, 8]]);
});
