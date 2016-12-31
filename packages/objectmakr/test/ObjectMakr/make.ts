import { IObjectMakr } from "../../src/IObjectMakr";
import { mochaLoader } from "../main";
import { fakes } from "../utils/fakes";

mochaLoader.it("creates objects that respect the prototype chain", (): void => {
    // Arrange
    const property: Function = new Function();
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            sample: {}
        },
        properties: {
            sample: { property }
        }
    });

    // Act
    const madeObject: any = ObjectMaker.make("sample");

    // Assert
    chai.expect(madeObject.property).to.equal(property);
});

mochaLoader.it("creates objects that respect a deep prototype chain", (): void => {
    // Arrange
    const parentProperty: Function = new Function();
    const childProperty: Function = new Function();
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            parent: {
                child: {}
            }
        },
        properties: {
            parent: {
                property: parentProperty
            },
            child: {
                property: childProperty
            }
        }
    });

    // Act
    const madeObject: any = ObjectMaker.make("child");

    // Assert
    chai.expect(madeObject.property).to.equal(childProperty);
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
