import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("returns the correct sprite", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();
    const sizing = {
        spriteWidth: "16",
        spriteHeight: "16"
    };
    let zeros = [0, 0, 0, 0];
    for (let i: number = 0; i < 4; i += 1){
        zeros = zeros.concat(zeros);
    }
    const boxSprite = new Uint8ClampedArray(zeros);

    // Act
    const sprite = PixelRender.decode(stubSpriteName, sizing);

    // Assert
    chai.expect(sprite).to.deep.equal(boxSprite);
});

mochaLoader.it("throws an error if the sprite does not exist", (): void => {
    // Arrange
    const PixelRender = stubPixelRendr();

    // Assert
    chai.expect(PixelRender.decode.bind(PixelRender, "X")).to.throw("No sprite found for 'X'.");
});
