import { IObjectMakr } from "../../src/IObjectMakr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("creates objects that respect the prototype chain", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            sample: {}
        },
        properties: {
            sample: {
                property: property
            }
        }
    });

    // Act
    const madeObject = ObjectMaker.make("sample");

    // Assert
    chai.expect(madeObject.property).to.equal(property);
});

mochaLoader.it("doesn't add prototype methods to created objects", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            sample: {}
        },
        properties: {
            sample: {
                property: property
            }
        }
    });

    // Act
    const madeObject: any = ObjectMaker.make("sample");

    // Assert
    chai.expect(madeObject.hasOwnProperty("property")).to.be.false;
});

mochaLoader.it("copies a property", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            sample: {}
        }
    });

    // Act
    const madeObject: any = ObjectMaker.make("sample", {
        property: property
    });

    // Assert
    chai.expect(madeObject.property).to.equal(property);
});
