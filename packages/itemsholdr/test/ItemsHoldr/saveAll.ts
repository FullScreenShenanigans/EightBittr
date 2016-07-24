/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("saves changes to items to localStorage", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr({
        values: {
            color: {
                valueDefault: "red"
            },
            weight: {
                valueDefault: 124
            }
        }
    });

    // Act
    ItemsHolder.setItem("color", "blue");
    ItemsHolder.saveAll();

    // Assert
    chai.expect(ItemsHolder.getObject("color").retrieveLocalStorage()).to.equal("blue");
});
