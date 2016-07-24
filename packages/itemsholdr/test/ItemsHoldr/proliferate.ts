/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/ItemsHoldr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("adds shallow properties to a recipient", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    const recipient: any = {};
    const donor: any = {
        foo: true,
        bar: false
    };

    // Act
    ItemsHolder.proliferate(recipient, donor);

    // Assert
    chai.expect(donor.foo).to.be.equal(recipient.foo);
    chai.expect(donor.bar).to.be.equal(recipient.bar);
});

mochaLoader.addTest("adds deep copied objects to a recipient", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    const recipient: any = {};
    const donor: any = {
        foo: {
            bar: true
        }
    };

    // Act
    ItemsHolder.proliferate(recipient, donor);

    // Assert
    chai.expect(donor.foo).to.be.deep.equal(recipient.foo);
    chai.expect(donor.foo).to.not.be.equal(recipient.foo);
});

mochaLoader.addTest("adds deep copied arrays to a recipient", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    const recipient: any = {};
    const donor: any = {
        foo: [1, 2, 3]
    };

    // Act
    ItemsHolder.proliferate(recipient, donor);

    // Assert
    chai.expect(donor.foo).to.be.deep.equal(recipient.foo);
    chai.expect(donor.foo).to.not.be.equal(recipient.foo);
});

mochaLoader.addTest("overrides existing properties", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    const recipient: any = {
        foo: false
    };
    const donor: any = {
        foo: true
    };

    // Act
    ItemsHolder.proliferate(recipient, donor);

    // Assert
    chai.expect(donor.foo).to.be.equal(recipient.foo);
});

mochaLoader.addTest("doesn't override existing properties when noOverrides is true", (): void => {
    // Arrange
    const ItemsHolder: ItemsHoldr.IItemsHoldr = mocks.mockItemsHoldr();
    const recipient: any = {
        foo: false
    };
    const donor: any = {
        foo: true
    };

    // Act
    ItemsHolder.proliferate(recipient, donor, true);

    // Assert
    chai.expect(donor.foo).to.not.be.equal(recipient.foo);
});
