import { ILibraryRaws, IPixelRendr } from "../../src/IPixelRendr";
import { mochaLoader } from "../main";
import { stubPixelRendr, stubSpriteName } from "../utils/fakes";

mochaLoader.it("resets the library to a blank library", (): void => {
    // Arrange
    const pixelRender: IPixelRendr = stubPixelRendr();

    // Act
    pixelRender.resetLibrary();

    // Assert
    chai.expect(pixelRender.getLibrary().raws).to.deep.equal({});
    chai.expect(pixelRender.getLibrary().sprites).to.deep.equal({});
});

mochaLoader.it("sets the raw of the library", (): void => {
    // Arrange
    const PixelRender: IPixelRendr = stubPixelRendr();
    const library: ILibraryRaws = {
        [stubSpriteName]: "x14"
    };

    // Act
    PixelRender.resetLibrary(library);

    // Assert
    chai.expect(PixelRender.getLibrary().raws).to.deep.equal(library);
});
