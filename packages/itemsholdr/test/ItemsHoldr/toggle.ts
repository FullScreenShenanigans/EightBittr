/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("switches from true to false", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr({
        values: {
            alive: {
                valueDefault: true
            }
        }
    });

    // Act
    ItemsHolder.toggle("alive");

    // Assert
    chai.expect(ItemsHolder.getItem("alive")).to.equal(false);
});

mochaLoader.addTest("switches from false to true", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr({
        values: {
            alive: {
                valueDefault: false
            }
        }
    });

    // Act
    ItemsHolder.toggle("alive");

    // Assert
    chai.expect(ItemsHolder.getItem("alive")).to.equal(true);
});
