import { IPixelRendr } from "../../src/IPixelRendr";
import { SpriteSingle } from "../../src/SpriteSingle";
import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("returns the correct sprite", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();
    let zeros: number[] = [0, 0, 0, 0];
    for (let i: number = 0; i < 4; i += 1) {
        zeros = zeros.concat(zeros);
    }
    const boxSprite: Uint8ClampedArray = new Uint8ClampedArray(zeros);

    // Act
    const sprite: SpriteSingle = pixelRender.decode(stubSpriteName, {}) as SpriteSingle;

    // Assert
    chai.expect(sprite.data).to.deep.equal(boxSprite);
});

mochaLoader.it("throws an error if the sprite does not exist", (): void => {
    // Arrange
    const PixelRender: IPixelRendr = stubPixelRendr();

    // Assert
    chai.expect(PixelRender.decode.bind(PixelRender, "X")).to.throw("No sprite found for 'X'.");
});
