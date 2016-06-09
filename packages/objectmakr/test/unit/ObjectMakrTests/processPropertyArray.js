define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("only changes the target's type", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var properties = mocks.mockPropertyArray();

            // Act
            properties.Starfish = objectMaker.processPropertyArray(properties.Starfish);

            // Assert
            expect(properties.Creature).to.be.instanceOf(Array);
        });

        it("changes target to an object representation", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var properties = mocks.mockPropertyArray();

            // Act
            properties.Starfish = objectMaker.processPropertyArray(properties.Starfish);

            // Assert
            expect(properties.Starfish).to.be.instanceOf(Object);
        });
    };
});