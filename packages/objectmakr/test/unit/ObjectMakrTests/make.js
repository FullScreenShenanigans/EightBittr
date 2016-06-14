define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("creates objects that respect the prototype chain", function () {
            // Arrange
            var property = function () {};
            var objectMaker = mocks.mockObjectMakr({
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
            var madeObject = objectMaker.make("sample");

            // Assert
            expect(madeObject.property).to.equal(property);
        });

        it("doesn't add prototype methods to created objects", function () {
            // Arrange
            var property = function () {};
            var objectMaker = mocks.mockObjectMakr({
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
            var madeObject = objectMaker.make("sample");

            // Assert
            expect(madeObject.hasOwnProperty("property")).to.be.false;
        });

        it("copies a property", function () {
            // Arrange
            var property = function () {};
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {
                    sample: {}
                }
            });

            // Act
            var madeObject = objectMaker.make("sample", {
                property: property
            });

            // Assert
            expect(madeObject.property).to.equal(property);
        });
    };
});