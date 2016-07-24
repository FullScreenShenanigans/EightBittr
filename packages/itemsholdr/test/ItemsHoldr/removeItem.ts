/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("removes item from itemKeys", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    ItemsHolder.addItem("color");

    // Act
    ItemsHolder.removeItem("color");

    // Assert
    chai.expect(ItemsHolder.getItemKeys().length).to.equal(0);
});

mochaLoader.addTest("removes item from container", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr({
        doMakeContainer: true,
        values: {
            color: {
                valueDefault: "red",
                hasElement: true
            }
        }
    });

    // Act
    ItemsHolder.removeItem("color");

    // Assert
    chai.expect(ItemsHolder.getContainer().hasChildNodes()).to.equal(false);
});

mochaLoader.addTest("removes item from localStorage", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr({
        values: {
            color: {
                valueDefault: "red",
                storeLocally: true
            }
        },
        autoSave: true
    });

    // Act
    ItemsHolder.removeItem("color");

    // Assert
    chai.expect(ItemsHolder.getLocalStorage()["color"]).to.equal(undefined);
});
