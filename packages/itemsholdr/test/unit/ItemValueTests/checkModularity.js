define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("calls the modular function the correct number of times", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
                valueDefault: 123,
                modularity: 15,
                num: 0,
                onModular: function () {
                    this.num += 1;
                }
            });

            // Act
            item.checkModularity();

            // Assert
            expect(item.num).to.equal(8);
        });

        it("doesn't call the modular function if the value is not a number", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", {
                valueDefault: "123",
                modularity: 15,
                onModular: function () {
                    this.setValue = 0;
                }
            });

            // Act
            item.checkModularity();

            // Assert
            expect(item.getValue()).to.equal("123");
        });
    };
});