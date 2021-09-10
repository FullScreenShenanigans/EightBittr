import { expect } from "chai";

import { stubUserWrappr } from "./fakes.test";

describe("UserWrappr", () => {
    describe("resetDisplay", () => {
        it("loads React libraries", async () => {
            // Arrange
            const { container, requirejs, userWrapper } = stubUserWrappr();

            // Act
            await userWrapper.createDisplay(container);

            // Assert
            expect(requirejs.getCall(0).args[0]).to.deep.equal(["react", "react-dom"]);
        });

        it("places contents within the container first", async () => {
            // Arrange
            const { classNames, container, userWrapper } = stubUserWrappr();

            // Act
            await userWrapper.createDisplay(container);

            // Assert
            expect(container.children[0].className).to.be.equal(classNames.contentArea);
        });

        it("places menus within the container second", async () => {
            // Arrange
            const { classNames, container, userWrapper } = stubUserWrappr();

            // Act
            await userWrapper.createDisplay(container);

            // Assert
            expect(container.children[1].className).to.be.equal(classNames.menusOuterArea);
        });
    });
});
