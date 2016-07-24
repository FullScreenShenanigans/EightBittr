/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ObjectMakr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("creates objects that respect the prototype chain", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: ObjectMakr.IObjectMakr = mocks.mockObjectMakr({
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

mochaLoader.addTest("doesn't add prototype methods to created objects", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: ObjectMakr.IObjectMakr = mocks.mockObjectMakr({
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

mochaLoader.addTest("copies a property", (): void => {
    // Arrange
    const property = (): void => {};
    const ObjectMaker: ObjectMakr.IObjectMakr = mocks.mockObjectMakr({
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
