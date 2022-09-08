import { expect } from "chai";

import { WorldSeedr } from "./WorldSeedr";

function randomInOrder(...values: number[]) {
    let index = -1;

    return () => {
        if (index === values.length - 1) {
            throw new Error("Test value requested after end of array.");
        }

        return values[(index += 1)];
    };
}

const area = {
    bottom: 0,
    left: 0,
    right: 12,
    top: 8,
};

(window as any).WorldSeedr = WorldSeedr;

describe("WorldSeedr", () => {
    describe("generate", () => {
        it("places a result when it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            size: {
                                height: 7,
                                width: 7,
                            },
                            title: "Actor",
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 1 },
                    title: "Actor",
                },
            ]);
        });

        it("uses a randomized title when the title is randomized", () => {
            // Arrange
            const title = "Actor";
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            size: {
                                height: 7,
                                width: 7,
                            },
                            title: [
                                {
                                    probability: 100,
                                    value: title,
                                },
                            ],
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 1 },
                    title,
                },
            ]);
        });

        it("adds constant properties to a result when they exist", () => {
            // Arrange
            const properties = { key: "value" };
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            properties,
                            size: {
                                height: 7,
                                width: 7,
                            },
                            title: "Actor",
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 1 },
                    properties,
                    title: "Actor",
                },
            ]);
        });

        it("adds randomized properties to a result when they exist", () => {
            // Arrange
            const properties = { key: "value" };
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            properties: [
                                {
                                    probability: 100,
                                    value: properties,
                                },
                            ],
                            size: {
                                height: 7,
                                width: 7,
                            },
                            title: "Actor",
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 1 },
                    properties,
                    title: "Actor",
                },
            ]);
        });

        it("places a sized result when it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            size: {
                                height: 4,
                                width: 10,
                            },
                            title: "Actor",
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 4 },
                    title: "Actor",
                },
            ]);
        });

        it("places only fitting sized results when an array is provided", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: [3, 4, 7].map((size) => ({
                            size: {
                                height: size,
                                width: size,
                            },
                            title: "Actor",
                            type: "Result",
                        })),
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 5 },
                    title: "Actor",
                },
                {
                    area: { ...area, bottom: 1, top: 5 },
                    title: "Actor",
                },
            ]);
        });

        for (const [direction, align, sizeChild, areaChanges] of [
            ["bottom", "left", undefined, { bottom: 3, right: 10, top: 8 }],
            ["bottom", "left", { height: 3, width: 4 }, { bottom: 5, right: 4 }],
            ["bottom", "right", undefined, { bottom: 3, left: 2 }],
            ["bottom", "right", { height: 3, width: 4 }, { bottom: 5, left: 8 }],
            ["bottom", "stretch", undefined, { bottom: 3 }],
            ["bottom", "stretch", { height: 3, width: 4 }, { bottom: 5 }],
            ["left", "bottom", undefined, { left: 2, top: 5 }],
            ["left", "bottom", { height: 3, width: 4 }, { left: 8, top: 3 }],
            ["left", "stretch", undefined, { left: 2 }],
            ["left", "stretch", { height: 3, width: 4 }, { left: 8 }],
            ["left", "top", undefined, { bottom: 3, left: 2 }],
            ["left", "top", { height: 3, width: 4 }, { bottom: 5, left: 8 }],
            ["right", "bottom", undefined, { right: 10, top: 5 }],
            ["right", "bottom", { height: 3, width: 4 }, { right: 4, top: 3 }],
            ["right", "stretch", undefined, { right: 10 }],
            ["right", "stretch", { height: 3, width: 4 }, { right: 4 }],
            ["right", "top", undefined, { bottom: 3, right: 10 }],
            ["right", "top", { height: 3, width: 4 }, { bottom: 5, right: 4 }],
            ["top", "left", undefined, { right: 10, top: 5 }],
            ["top", "left", { height: 3, width: 4 }, { right: 4, top: 3 }],
            ["top", "right", undefined, { left: 2, right: 12, top: 5 }],
            ["top", "right", { height: 3, width: 4 }, { left: 8, right: 12, top: 3 }],
            ["top", "stretch", undefined, { top: 5 }],
            ["top", "stretch", { height: 3, width: 4 }, { top: 3 }],
        ] as const) {
            it(`snaps a sized result when direction is ${direction}, align is ${align}, and child.size ${
                sizeChild ? "exists" : "does not exist"
            }`, () => {
                // Arrange
                const worldSeeder = new WorldSeedr({
                    possibilities: {
                        Container: {
                            align,
                            children: {
                                size: sizeChild,
                                title: "Actor",
                                type: "Result",
                            },
                            direction,
                            size: {
                                height: 5,
                                width: 10,
                            },
                        },
                    },
                });

                // Act
                const result = worldSeeder.generate("Container", area);

                // Assert
                expect(result).to.be.deep.equal([
                    {
                        area: { ...area, ...areaChanges },
                        title: "Actor",
                    },
                ]);
            });
        }

        it("places multiple aligned children using their own alignment", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Map: {
                        children: [
                            {
                                size: {
                                    height: 5,
                                    width: 5,
                                },
                                title: "First",
                                type: "Result",
                            },
                            {
                                align: "bottom",
                                size: {
                                    height: 5,
                                    width: 5,
                                },
                                title: "Second",
                                type: "Result",
                            },
                            {
                                align: "top",
                                size: {
                                    height: 5,
                                    width: 5,
                                },
                                title: "Third",
                                type: "Result",
                            },
                        ],
                        direction: "right",
                        size: {
                            height: 15,
                            width: 15,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Map", {
                bottom: 0,
                left: 0,
                right: 15,
                top: 15,
            });

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: {
                        bottom: 0,
                        left: 0,
                        right: 5,
                        top: 15,
                    },
                    title: "First",
                },
                {
                    area: {
                        bottom: 0,
                        left: 5,
                        right: 10,
                        top: 5,
                    },
                    title: "Second",
                },
                {
                    area: {
                        bottom: 10,
                        left: 10,
                        right: 15,
                        top: 15,
                    },
                    title: "Third",
                },
            ]);
        });

        it("does not place a sized result when it does not fit in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: {
                            size: {
                                height: 15,
                                width: 15,
                            },
                            title: "Actor",
                            type: "Result",
                        },
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([]);
        });

        it("recurses on a possibility to an actor when it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: [
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 6,
                                        width: 6,
                                    },
                                    title: "Actor",
                                    type: "Result",
                                },
                            },
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 5,
                                        width: 5,
                                    },
                                    title: "Container",
                                    type: "Possibility",
                                },
                            },
                        ],
                        direction: "bottom",
                        size: {
                            height: 8,
                            width: 12,
                        },
                    },
                },
                random: randomInOrder(0.49, 0.51),
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 2 },
                    title: "Actor",
                },
            ]);
        });

        it("repeats a repeating result while it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: [
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 2,
                                        width: 2,
                                    },
                                    title: "Actor1",
                                    type: "Result",
                                },
                            },
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 3,
                                        width: 3,
                                    },
                                    title: "Actor2",
                                    type: "Result",
                                },
                            },
                        ],
                        direction: "bottom",
                        repeat: 9001,
                        size: {
                            height: 5,
                            width: 12,
                        },
                    },
                },
                random: randomInOrder(0.1, 0.9, 0.2, 0.8),
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 6, top: 8 },
                    title: "Actor1",
                },
                {
                    area: { ...area, bottom: 3, top: 6 },
                    title: "Actor2",
                },
                {
                    area: { ...area, bottom: 1, top: 3 },
                    title: "Actor1",
                },
            ]);
        });

        it("repeats a fixed spacing repeating result while it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: [
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 2,
                                        width: 2,
                                    },
                                    title: "Actor1",
                                    type: "Result",
                                },
                            },
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 3,
                                        width: 3,
                                    },
                                    title: "Actor2",
                                    type: "Result",
                                },
                            },
                        ],
                        direction: "bottom",
                        repeat: 9001,
                        spacing: 1,
                        size: {
                            height: 5,
                            width: 12,
                        },
                    },
                },
                random: randomInOrder(0.1, 0.9, 0.2, 0.8),
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 5, top: 8 },
                    title: "Actor1",
                },
                {
                    area: { ...area, bottom: 1, top: 5 },
                    title: "Actor2",
                },
            ]);
        });

        it("repeats a variable array spacing repeating result while it fits in the area", () => {
            // Arrange
            const worldSeeder = new WorldSeedr({
                possibilities: {
                    Container: {
                        children: [
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 2,
                                        width: 2,
                                    },
                                    title: "Actor1",
                                    type: "Result",
                                },
                            },
                            {
                                probability: 50,
                                value: {
                                    size: {
                                        height: 3,
                                        width: 3,
                                    },
                                    title: "Actor2",
                                    type: "Result",
                                },
                            },
                        ],
                        direction: "bottom",
                        repeat: 9001,
                        spacing: [
                            {
                                probability: 50,
                                value: 0.5,
                            },
                            {
                                probability: 50,
                                value: 1,
                            },
                        ],
                        size: {
                            height: 5,
                            width: 12,
                        },
                    },
                },
                random: randomInOrder(0.1, 0.9, 0.2, 0.8),
            });

            // Act
            const result = worldSeeder.generate("Container", area);

            // Assert
            expect(result).to.be.deep.equal([
                {
                    area: { ...area, bottom: 4.5, top: 8 },
                    title: "Actor2",
                },
                {
                    area: { ...area, bottom: 2, top: 4.5 },
                    title: "Actor1",
                },
            ]);
        });
    });
});
