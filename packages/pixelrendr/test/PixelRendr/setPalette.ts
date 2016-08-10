/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/PixelRendr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("replaces the palette", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const palette = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.setPalette(palette);

    // Assert
    chai.expect(PixelRender.paletteDefault).to.deep.equal(palette);
});

mochaLoader.addTest("recalculates digitsizeDefault", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const palette = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.setPalette(palette);

    // Assert
    chai.expect(PixelRender.digitsizeDefault).to.equal(1);
});