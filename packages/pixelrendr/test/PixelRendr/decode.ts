/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/PixelRendr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("returns the correct sprite", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();
    const sizing = {
        spriteWidth: "16",
        spriteHeight: "16"
    };
    let zeros = [0, 0, 0, 0];
    for (let i: number = 0; i < 4; i += 1){
        zeros = zeros.concat(zeros);
    }
    const boxSprite = new PixelRender.Uint8ClampedArray(zeros);

    // Act
    const sprite = PixelRender.decode(mocks.mockSpriteName, sizing);

    // Assert
    chai.expect(sprite).to.deep.equal(boxSprite);
});

mochaLoader.addTest("throws an error if the sprite does not exist", (): void => {
    // Arrange
    const PixelRender = mocks.mockPixelRendr();

    // Assert
    chai.expect(PixelRender.decode.bind(PixelRender, "X")).to.throw("No sprite found for 'X'.");
});
