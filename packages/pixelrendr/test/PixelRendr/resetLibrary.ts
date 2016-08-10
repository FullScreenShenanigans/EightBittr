/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/PixelRendr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("resets the library to a blank library", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();

    // Act
    PixelRender.resetLibrary();

    // Assert
    chai.expect(PixelRender.library).to.deep.equal({
        raws: {},
        sprites: {}
    });
});

mochaLoader.addTest("sets the raw of the library", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const library = {
        [mocks.mockSpriteName]: "x14"
    };

    // Act
    PixelRender.resetLibrary(library);

    // Assert
    chai.expect(PixelRender.library.raws).to.deep.equal(library);
});