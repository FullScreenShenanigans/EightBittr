/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/PixelRendr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("throws an error if the render does not exist", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();

    // Assert
    chai.expect(PixelRender.resetRender.bind(PixelRender, "X")).to.throw("No render found for 'X'.");
});

mochaLoader.addTest("resets existing sprites for the render", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();

    // Act
    PixelRender.resetRender(mocks.mockSpriteName);

    // Assert
    chai.expect(PixelRender.BaseFiler.get(mocks.mockSpriteName).sprites).to.deep.equal({})
});
