import { expect } from "chai";

import { stubWrappingViewDependencies } from "./fakes.test";
import { initializeMenus } from "./InitializeMenus";

describe("initializeMenus", () => {
    it("replaces the inner area with a non-fake area", async () => {
        // Arrange
        const dependencies = stubWrappingViewDependencies();
        const { classNames, container } = dependencies;

        // Act
        await initializeMenus(dependencies);

        // Assert
        expect(container.children[0].children[0].className).to.be.equal(classNames.menusInnerArea);
    });

    it("renders menu titles when given menu schemas", async () => {
        // Arrange
        const dependencies = stubWrappingViewDependencies({
            menus: [
                {
                    options: [],
                    title: "abc",
                },
                {
                    options: [],
                    title: "def",
                },
            ],
        });
        const { container } = dependencies;

        // Act
        await initializeMenus(dependencies);

        // Assert
        expect(container.textContent).to.be.equal("abcdef");
    });
});
