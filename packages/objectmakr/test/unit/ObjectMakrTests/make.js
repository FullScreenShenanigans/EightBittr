define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("copies a string", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();

            // Act
            var madeObject = objectMaker.make(mocks.mockClassName, mocks.mockObjectProperties());

            // Assert
            expect(typeof madeObject.name).to.equal("string");
        });

        it("copies a function", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();

            // Act
            var madeObject = objectMaker.make(mocks.mockClassName, mocks.mockObjectProperties());

            // Assert
            expect(madeObject.wet).to.equal(true);
        });

        it("copies a number", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();

            // Act
            var madeObject = objectMaker.make(mocks.mockClassName, mocks.mockObjectProperties());

            // Assert
            expect(typeof madeObject.weight).to.equal("number");
        });
    };
});