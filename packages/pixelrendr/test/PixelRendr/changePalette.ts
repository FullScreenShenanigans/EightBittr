/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/PixelRendr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("resets the empty cache", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const palette = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.changePalette(palette);

    // Assert
    chai.expect(PixelRender.BaseFiler.cache).to.deep.equal({});
});

mochaLoader.addTest("clears the cache with items in it", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const palette = [
        [0, 0, 0, 255]
    ];

    // Act
    PixelRender.getSpriteBase(mocks.mockSpriteName);
    PixelRender.changePalette(palette);

    // Assert
    chai.expect(PixelRender.BaseFiler.cache).to.deep.equal({});
});
