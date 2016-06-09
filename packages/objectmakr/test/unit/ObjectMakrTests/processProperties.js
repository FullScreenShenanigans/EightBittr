define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("parses elements into object types", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var properties = mocks.mockPropertyArray();

            // Act
            objectMaker.processProperties(properties);

            // Assert
            expect(typeof properties.Creature).to.equal("object");
        });
    };
});