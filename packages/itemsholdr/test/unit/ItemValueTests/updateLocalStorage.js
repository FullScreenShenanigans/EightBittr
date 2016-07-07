define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("does not update localStorage with a false overrideAutoSave value", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue("blue");
            item.updateLocalStorage();

            // Assert
            expect(item.retrieveLocalStorage()).to.equal(undefined);
        });

        it("updates localStorage with a true overrideAutoSave value", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr(), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue("blue");
            item.updateLocalStorage(true);

            // Assert
            expect(item.retrieveLocalStorage()).to.equal("blue");
        });

        it("updates localStorage when autoSave is enabled", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({ autoSave: true }), "color", mocks.mockItemValueSettings());

            // Act
            item.setValue("blue");
            item.updateLocalStorage();

            // Assert
            expect(item.retrieveLocalStorage()).to.equal("blue");
        });
    };
});