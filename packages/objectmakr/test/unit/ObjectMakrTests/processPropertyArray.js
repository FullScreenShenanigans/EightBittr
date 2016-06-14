define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("creates an object with the mapped properties", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {},
                indexMap: ["foo", "bar"]
            });
            var propertyArray = [{}, {}];

            // Act
            var properties = objectMaker.processPropertyArray(propertyArray);

            // Assert
            expect(properties.foo).to.be.equal(propertyArray[0]);
            expect(properties.bar).to.be.equal(propertyArray[1]);
        });
    };
});