import { expect } from "chai";

import { stubPixelRendr, stubSpriteName } from "./fakes.test";
import { ILibraryRaws, IPixel } from "./IPixelRendr";
import { SpriteSingle } from "./SpriteSingle";

describe("PixelRendr", () => {
    describe("changePalette", () => {
        it("resets the empty cache", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();
            const palette: IPixel[] = [
                [0, 0, 0, 255],
            ];

            // Act
            pixelRender.changePalette(palette);

            // Assert
            expect(pixelRender.getBaseFiler().getCache()).to.deep.equal({});
        });

        it("clears the cache with items in it", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();
            const palette: IPixel[] = [
                [0, 0, 0, 255],
            ];

            // Act
            pixelRender.decode(stubSpriteName, {});
            pixelRender.changePalette(palette);

            // Assert
            expect(pixelRender.getBaseFiler().getCache()).to.deep.equal({});
        });
    });

    describe("decode", () => {
        it("returns the correct sprite", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();
            let zeros: number[] = [0, 0, 0, 0];
            for (let i = 0; i < 4; i += 1) {
                zeros = zeros.concat(zeros);
            }
            const boxSprite: Uint8ClampedArray = new Uint8ClampedArray(zeros);

            // Act
            const sprite: SpriteSingle = pixelRender.decode(stubSpriteName, {}) as SpriteSingle;

            // Assert
            expect(sprite.data).to.deep.equal(boxSprite);
        });

        it("throws an error if the sprite does not exist", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();

            // Action
            const action = () => {
                pixelRender.decode("X", {});
            };

            // Assert
            expect(action).to.throw("No sprite found for 'X'.");
        });
    });

    describe("resetLibrary", () => {
        it("resets the library to a blank library", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();

            // Act
            pixelRender.resetLibrary();

            // Assert
            expect(pixelRender.getLibrary().raws).to.deep.equal({});
            expect(pixelRender.getLibrary().sprites).to.deep.equal({});
        });

        it("sets the raw of the library", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();
            const library: ILibraryRaws = {
                [stubSpriteName]: "x14",
            };

            // Act
            pixelRender.resetLibrary(library);

            // Assert
            expect(pixelRender.getLibrary().raws).to.deep.equal(library);
        });
    });

    describe("resetRender", () => {

        it("throws an error if the render does not exist", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();

            // Act
            const action = () => {
                pixelRender.resetRender("X");
            };

            // Assert
            expect(action).to.throw("No render found for 'X'.");
        });

        it("resets existing sprites for the render", (): void => {
            // Arrange
            const pixelRender = stubPixelRendr();

            // Act
            pixelRender.resetRender(stubSpriteName);

            // Assert
            expect(pixelRender.getBaseFiler().get(stubSpriteName).sprites).to.deep.equal({});
        });
    });
});
