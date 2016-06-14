define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("processes the correct number of functions", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var inheritance = {
                parentClass: {
                    childClass: {}
                }
            };

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(Object.keys(objectMaker.getFunctions()).length).to.equal(2);
        });

        it("creates a new function if none exists already", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var inheritance = {
                sample: {}
            };

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(objectMaker.getFunction("sample")).to.not.be.undefined;
        });

        it("uses an existing function if it exists", function () {
            // Arrange
            var sample = function () {};
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {},
                functions: {
                    sample: sample
                }
            });
            var inheritance = {
                sample: {},
            };

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(objectMaker.getFunction("sample")).to.be.equal(sample);
        });

        it("copies a property to a function", function () {
            // Arrange
            var property = { };
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {},
                properties: {
                    sample: {
                        property: property
                    }
                }
            });
            var inheritance = {
                sample: {},
            };

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(objectMaker.getFunction("sample").prototype.property).to.be.equal(property);
        });

        it("copies a parent property if required", function () {
            // Arrange
            var property = {};
            var objectMaker = mocks.mockObjectMakr({
                doPropertiesFull: true,
                inheritance: {},
                properties: {
                    parentClass: {
                        property: property
                    }
                }
            });
            var inheritance = {
                parentClass: {
                    childClass: {}
                }
            };

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(objectMaker.getFullPropertiesOf("childClass").property).to.be.equal(property);
        });
    };
});