import { expect } from "chai";

import { it } from "../../main";
import { stubClassNames, stubStyles } from "../../UserWrappr/stubs";
import { stubAreasFaker, stubContainerSize } from "./stubs";

it("creates an outer area with the outer area class name", async () => {
    // Arrange
    const areasFaker = stubAreasFaker();

    // Act
    const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);

    // Assert
    expect(menuArea.className).to.be.equal(stubClassNames.menusOuterArea);
});

it("creates an inner area with the inner area fake class name and styles", async () => {
    // Arrange
    const areasFaker = stubAreasFaker();

    // Act
    const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);
    const innerArea = menuArea.children[0] as HTMLElement;

    // Assert
    expect(innerArea.className).to.be.equal([
        stubClassNames.menusInnerArea,
        stubClassNames.menusInnerAreaFake,
    ].join(" "));
    expect(innerArea.style).to.contain({
        ...stubStyles.menusInnerArea,
        ...stubStyles.menusInnerAreaFake
    });
});

it("creates stub menu titles when provided menu schemas", async () => {
    // Arrange
    const areasFaker = stubAreasFaker({
        menus: [
            {
                options: [],
                title: "abc"
            },
            {
                options: [],
                title: "def"
            }
        ]
    });

    // Act
    const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);

    // Assert
    expect(menuArea.textContent).to.be.equal("abcdef");
});
