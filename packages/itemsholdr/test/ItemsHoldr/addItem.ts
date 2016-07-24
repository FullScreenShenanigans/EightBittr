/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("adds the item to keys", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();

    // Act
    const item = ItemsHolder.addItem("color");

    // Act
    chai.expect(ItemsHolder.getItemKeys().length).to.equal(1);
});

mochaLoader.addTest("leaves value as undefined if no settings passed in", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();

    // Act
    const item = ItemsHolder.addItem("color");

    // Act
    chai.expect(item.getValue()).to.equal(undefined);
});
