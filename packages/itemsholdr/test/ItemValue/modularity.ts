/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("calls the modular function the correct number of times", (): void => {
    // Arrange
    let called: number = 0;
    const settings: any = {
        valueDefault: 0,
        modularity: 15,
        onModular: (): void => {
            called += 1;
        }
    };
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", settings);

    // Act
    item.setValue(settings.modularity * 2);

    // Assert
    chai.expect(called).to.equal(2);
});

mochaLoader.addTest("doesn't call the modular function if the value is not a number", (): void => {
    // Arrange
    let called: number = 0;
    const settings: any = {
        valueDefault: "0",
        modularity: 15,
        onModular: (): void => {
            called += 1;
        }
    };
    const item: ItemsHoldr.IItemValue = mocks.mockItemValue(mocks.mockItemsHoldr(), "weight", settings);

    // Act
    item.setValue((settings.modularity * 2).toString());

    // Assert
    chai.expect(called).to.equal(0);
});
