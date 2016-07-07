define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("returns undefined", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({localStorage: {} }), "color", { valueDefault: "red" });

            // Assert
            expect(item.retrieveLocalStorage()).to.equal(undefined);
        });

        it("returns an empty string", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({
                localStorage: {},
                autoSave: true
            }), "color", {
                valueDefault: "",
                storeLocally: true
            });

            // Assert
            expect(item.retrieveLocalStorage()).to.equal("");
        });

        it("returns 0", function () {
            // Arrange
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({
                localStorage: {},
                autoSave: true
            }), "num", {
                valueDefault: 0,
                storeLocally: true
            });

            // Assert
            expect(item.retrieveLocalStorage()).to.equal(0);
        });

        it("returns an object", function () {
            // Arrange
            var info = {
                wheels: 4,
                seats: 5,
                year: 2014
            };
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({
                localStorage: {},
                autoSave: true
            }), "car", {
                valueDefault: info,
                storeLocally: true
            });

            // Assert
            expect(item.retrieveLocalStorage()).to.deep.equal(info);
        });

        it("returns an array", function () {
            // Arrange
            var list = [1, 2, 3];
            var item = mocks.mockItemValue(mocks.mockItemsHoldr({
                localStorage: {},
                autoSave: true
            }), "car", {
                valueDefault: list,
                storeLocally: true
            });

            // Assert
            expect(item.retrieveLocalStorage()).to.deep.equal(list);
        });
    };
});