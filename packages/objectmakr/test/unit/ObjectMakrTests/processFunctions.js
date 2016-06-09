define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("processes the correct number of functions", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {
                    Organism: {
                        Animal: {
                            Bird:{
                                Penguin: {}
                            },
                            Mammal: {
                                Dog: {}
                            }
                        },
                        Plant: {}
                    }
                }
            });
            var inheritance = mocks.mockInheritance();

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");

            // Assert
            expect(Object.keys(objectMaker.functions).length).to.equal(7);
        });

        it("creates constructor type mappings", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr({
                inheritance: {
                    Organism: {
                        Animal: {
                            Bird:{
                                Penguin: {}
                            },
                            Mammal: {
                                Dog: {}
                            }
                        },
                        Plant: {}
                    }
                }
            });
            var inheritance = mocks.mockInheritance();

            // Act
            objectMaker.processFunctions(inheritance, Object, "Object");
            var actualMapping = objectMaker.functions;

            // Assert
            expect(typeof actualMapping[Object.keys(actualMapping)[0]]).to.equal("function");
        });
    };
});