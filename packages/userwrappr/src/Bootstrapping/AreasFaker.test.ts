import { expect } from "chai";

import { stubClassNames, stubStyles } from "../fakes.test";
import { IAbsoluteSizeSchema } from "../Sizing";
import { stubAreasFaker, stubContainerSize } from "./fakes.test";

describe("AreasFaker", () => {
    describe("createAndAppendMenuArea", () => {
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
                ...stubStyles.menusInnerAreaFake,
            });
        });

        it("creates stub menu titles when provided menu schemas", async () => {
            // Arrange
            const areasFaker = stubAreasFaker({
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

            // Act
            const { menuArea } = await areasFaker.createAndAppendMenuArea(stubContainerSize);

            // Assert
            expect(menuArea.textContent).to.be.equal("abcdef");
        });
    });

    describe("createContentArea", () => {
        it("vertically fills the content size to the container excluding the menu area", () => {
            // Arrange
            const areasFaker = stubAreasFaker();
            const containerSize: IAbsoluteSizeSchema = {
                height: 350,
                width: 490,
            };
            const menuAreaSize: IAbsoluteSizeSchema = {
                height: 140,
                width: 210,
            };

            // Act
            const { contentSize } = areasFaker.createContentArea(containerSize, menuAreaSize);

            // Assert
            expect(contentSize).to.be.deep.equal({
                height: 210,
                width: 490,
            });
        });

        it("matches its content area size style to the returned content size", () => {
            // Arrange
            const areasFaker = stubAreasFaker();
            const containerSize: IAbsoluteSizeSchema = {
                height: 350,
                width: 490,
            };
            const menuAreaSize: IAbsoluteSizeSchema = {
                height: 140,
                width: 210,
            };

            // Act
            const { contentArea, contentSize } = areasFaker.createContentArea(containerSize, menuAreaSize);

            // Assert
            expect(contentArea.style).to.contain({
                height: `${contentSize.height}px`,
                width: `${contentSize.width}px`,
            });
        });
    });
});
