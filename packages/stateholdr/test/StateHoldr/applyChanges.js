/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />
mochaLoader.addTest("copies objects to a recipient", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    var recipient = {};
    // Act
    StateHolder.setCollection("exampleCollection", mocks.mockCollection());
    StateHolder.applyChanges("car", recipient);
    // Assert
    chai.expect(recipient).to.deep.equal({ color: "red" });
});
mochaLoader.addTest("only shallow copies objects to a recipient", function () {
    // Arrange
    var StateHolder = mocks.mockStateHoldr();
    var changedGroup = "car";
    var changedKey = "manufacturer";
    var collection = (_a = {},
        _a[changedGroup] = (_b = {},
            _b[changedKey] = {
                color: "red"
            },
            _b
        ),
        _a
    );
    var recipient = {};
    // Act
    StateHolder.setCollection("exampleCollection", collection);
    StateHolder.applyChanges(changedGroup, recipient);
    // Assert
    chai.expect(recipient[changedKey]).to.equal(collection[changedGroup][changedKey]);
    var _a, _b;
});
