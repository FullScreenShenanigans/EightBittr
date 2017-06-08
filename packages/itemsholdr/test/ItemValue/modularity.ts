import { IItemValue } from "../../src/IItemValue";
import { mochaLoader } from "../main";
import { stubItemsHoldr, stubItemValue } from "../utils/fakes";

mochaLoader.it("calls the modular function the correct number of times", (): void => {
    // Arrange
    let called: number = 0;
    const settings: any = {
        valueDefault: 0,
        modularity: 15,
        onModular: (): void => {
            called += 1;
        }
    };
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "weight", settings);

    // Act
    item.setValue(settings.modularity * 2);

    // Assert
    chai.expect(called).to.equal(2);
});

mochaLoader.it("doesn't call the modular function if the value is not a number", (): void => {
    // Arrange
    let called: number = 0;
    const settings: any = {
        valueDefault: "0",
        modularity: 15,
        onModular: (): void => {
            called += 1;
        }
    };
    const item: IItemValue = stubItemValue(stubItemsHoldr(), "weight", settings);

    // Act
    item.setValue((settings.modularity * 2).toString());

    // Assert
    chai.expect(called).to.equal(0);
});
