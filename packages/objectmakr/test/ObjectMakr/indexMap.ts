/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ObjectMakr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("creates an object with the mapped properties", (): void => {
    // Arrange
    const indexMap = ["foo", "bar"];
    const propertyArray = [{}, {}];
    const ObjectMaker: ObjectMakr.IObjectMakr = mocks.mockObjectMakr({
        inheritance: {
            "thing": {}
        },
        properties: {
            "thing": propertyArray
        },
        indexMap: indexMap
    });

    // Act
    const madeObject: any = ObjectMaker.make("thing");

    // Assert
    chai.expect(madeObject[indexMap[0]]).to.be.equal(propertyArray[0]);
    chai.expect(madeObject[indexMap[1]]).to.be.equal(propertyArray[1]);
});
