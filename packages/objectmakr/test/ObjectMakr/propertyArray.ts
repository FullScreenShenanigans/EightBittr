/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ObjectMakr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("creates an object with the mapped properties", (): void => {
    // Arrange
    const propertyArray = [{}, {}];
    const ObjectMaker: ObjectMakr.IObjectMakr = mocks.mockObjectMakr({
        inheritance: {
            "thing": {}
        },
        properties: {
            "thing": propertyArray
        },
        indexMap: ["foo", "bar"]
    });

    // Act
    const madeObject: any = ObjectMaker.make("thing");

    // Assert
    chai.expect(madeObject.foo).to.be.equal(propertyArray[0]);
    chai.expect(madeObject.bar).to.be.equal(propertyArray[1]);
});
