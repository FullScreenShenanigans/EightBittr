import { expect } from "chai";
import { stubGameStartr, stubThing } from "../fakes.test";

describe("Physics", () => {
    describe("setBottom", () => {
        it("sets bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newBottom = 3.5;

            // Act
            physics.setBottom(thing, newBottom);

            // Assert
            expect(thing.bottom).to.be.equal(newBottom);
        });

        it("adjusts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newBottom = 3.5;
            const newTop = newBottom - thing.height;

            // Act
            physics.setBottom(thing, newBottom);

            // Assert
            expect(thing.top).to.be.equal(newTop);
        });
    });

    describe("setLeft", () => {
        it("sets left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newLeft = 3.5;

            // Act
            physics.setLeft(thing, newLeft);

            // Assert
            expect(thing.left).to.be.equal(newLeft);
        });

        it("adjusts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newLeft = 3.5;
            const newRight = newLeft + thing.width;

            // Act
            physics.setLeft(thing, newLeft);

            // Assert
            expect(thing.right).to.be.equal(newRight);
        });
    });

    describe("setMid", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const height = thing.height;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(thing, newMidX, newMidY);

            // Assert
            expect(thing.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(thing, newMidX, newMidY);

            // Assert
            expect(thing.right).to.be.equal(newMidX + width / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const height = thing.height;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(thing, newMidX, newMidY);

            // Assert
            expect(thing.bottom).to.be.equal(newMidY + height / 2);
        });

        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(thing, newMidX, newMidY);

            // Assert
            expect(thing.left).to.be.equal(newMidX - width / 2);
        });
    });

    describe("setMidObj", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const height = thing.height;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(thing, positioner);

            // Assert
            expect(thing.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(thing, positioner);

            // Assert
            expect(thing.right).to.be.equal(newMidX + width / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const height = thing.height;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(thing, positioner);

            // Assert
            expect(thing.bottom).to.be.equal(newMidY + height / 2);
        });

        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(thing, positioner);

            // Assert
            expect(thing.left).to.be.equal(newMidX - width / 2);
        });
    });

    describe("setMidX", () => {
        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;

            // Act
            physics.setMidX(thing, newMidX);

            // Assert
            expect(thing.left).to.be.equal(newMidX - width / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;

            // Act
            physics.setMidX(thing, newMidX);

            // Assert
            expect(thing.right).to.be.equal(newMidX + width / 2);
        });
    });

    describe("setMidXObj", () => {
        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;

            physics.setMidX(positioner, newMidX);

            // Act
            physics.setMidXObj(thing, positioner);

            // Assert
            expect(thing.left).to.be.equal(newMidX - width / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const width = thing.width;
            const newMidX = 3.5;

            physics.setMidX(positioner, newMidX);

            // Act
            physics.setMidXObj(thing, positioner);

            // Assert
            expect(thing.right).to.be.equal(newMidX + width / 2);
        });
    });

    describe("setMidY", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const height = thing.height;
            const newMidY = 3.5;

            // Act
            physics.setMidY(thing, newMidY);

            // Assert
            expect(thing.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const height = thing.height;
            const newMidY = 3.5;

            // Act
            physics.setMidY(thing, newMidY);

            // Assert
            expect(thing.bottom).to.be.equal(newMidY + height / 2);
        });
    });

    describe("setMidYObj", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const height = thing.height;
            const newMidY = 3.5;

            physics.setMidY(positioner, newMidY);

            // Act
            physics.setMidYObj(thing, positioner);

            // Assert
            expect(thing.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const positioner = stubThing();
            const thing = stubThing();
            const height = thing.height;
            const newMidY = 3.5;

            physics.setMidY(positioner, newMidY);

            // Act
            physics.setMidYObj(thing, positioner);

            // Assert
            expect(thing.bottom).to.be.equal(newMidY + height / 2);
        });
    });

    describe("setRight", () => {
        it("sets right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newRight = 3.5;

            // Act
            physics.setRight(thing, newRight);

            // Assert
            expect(thing.right).to.be.equal(newRight);
        });

        it("adjusts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newRight = 3.5;
            const newLeft = newRight - thing.width;

            // Act
            physics.setRight(thing, newRight);

            // Assert
            expect(thing.left).to.be.equal(newLeft);
        });
    });

    describe("setTop", () => {
        it("sets top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newTop = 3.5;

            // Act
            physics.setTop(thing, newTop);

            // Assert
            expect(thing.top).to.be.equal(newTop);
        });

        it("adjusts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newTop = 3.5;
            const newbottom = newTop + thing.height;

            // Act
            physics.setTop(thing, newTop);

            // Assert
            expect(thing.bottom).to.be.equal(newbottom);
        });
    });

    describe("shiftHoriz", () => {
        it("shifts horizontally", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const left = thing.left;
            const right = thing.right;
            const amount = 7;

            // Act
            physics.shiftHoriz(thing, amount);

            // Assert
            expect(thing.left).to.be.equal(left + amount);
            expect(thing.right).to.be.equal(right + amount);
        });

        it("doesn't shift vertically", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const top = thing.top;
            const bottom = thing.bottom;

            // Act
            physics.shiftHoriz(thing, 7);

            // Assert
            expect(thing.top).to.be.equal(top);
            expect(thing.bottom).to.be.equal(bottom);
        });
    });

    describe("shiftVert", () => {
        it("shifts vertically", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const top = thing.top;
            const bottom = thing.bottom;
            const amount = 7;

            // Act
            physics.shiftVert(thing, amount);

            // Assert
            expect(thing.top).to.be.equal(top + amount);
            expect(thing.bottom).to.be.equal(bottom + amount);
        });

        it("doesn't shift horizontally", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const left = thing.left;
            const right = thing.right;

            // Act
            physics.shiftVert(thing, 7);

            // Assert
            expect(thing.left).to.be.equal(left);
            expect(thing.right).to.be.equal(right);
        });
    });

    describe("slideToX", () => {
        it("shifts completely to the left with no limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 35;
            const newMidX = 11.7;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(newMidX);
        });

        it("shifts completely to the right with no limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 11.7;
            const newMidX = 35;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(newMidX);
        });

        it("shifts completely to the left with a large limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 35;
            const newMidX = 11.7;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX, 700);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(newMidX);
        });

        it("shifts completely to the right with a large limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 11.7;
            const newMidX = 35;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX, 700);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(newMidX);
        });

        it("shifts partially to the left with a limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 35;
            const newMidX = 11.7;
            const limit = 7;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX, limit);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(midX - limit);
        });

        it("shifts partially to the right with a limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midX = 11.7;
            const newMidX = 35;
            const limit = 7;

            physics.setMidX(thing, midX);

            // Act
            physics.slideToX(thing, newMidX, limit);

            // Assert
            expect(physics.getMidX(thing)).to.be.equal(midX + limit);
        });
    });

    describe("slideToY", () => {
        it("shifts completely to the top with no limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 35;
            const newMidY = 11.7;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(newMidY);
        });

        it("shifts completely to the bottom with no limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 11.7;
            const newMidY = 35;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(newMidY);
        });

        it("shifts completely to the top with a large limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 35;
            const newMidY = 11.7;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY, 700);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(newMidY);
        });

        it("shifts completely to the bottom with a large limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 11.7;
            const newMidY = 35;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY, 700);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(newMidY);
        });

        it("shifts partially to the top with a limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 35;
            const newMidY = 11.7;
            const limit = 7;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY, limit);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(midY - limit);
        });

        it("shifts partially to the bottom with a limit", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const midY = 11.7;
            const newMidY = 35;
            const limit = 7;

            physics.setMidY(thing, midY);

            // Act
            physics.slideToY(thing, newMidY, limit);

            // Assert
            expect(physics.getMidY(thing)).to.be.equal(midY + limit);
        });
    });

    describe("thingAbove", () => {
        it("is true when thing is above", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setBottom(thing, 0);
            physics.setTop(other, 7);

            // Act
            const thingAbove = physics.thingAbove(thing, other);

            // Assert
            expect(thingAbove).to.be.equal(true);
        });

        it("is true when thing overlaps above", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setMidY(thing, 7);
            physics.setMidY(other, 7.7);

            // Act
            const thingAbove = physics.thingAbove(thing, other);

            // Assert
            expect(thingAbove).to.be.equal(true);
        });

        it("is false when thing is below", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setTop(thing, 0);
            physics.setBottom(other, 7);

            // Act
            const thingAbove = physics.thingAbove(thing, other);

            // Assert
            expect(thingAbove).to.be.equal(false);
        });

        it("is false when thing overlaps below", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setMidY(thing, 7.7);
            physics.setMidY(other, 7);

            // Act
            const thingAbove = physics.thingAbove(thing, other);

            // Assert
            expect(thingAbove).to.be.equal(false);
        });
    });

    describe("thingToLeft", () => {
        it("is true when thing is to the left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setRight(thing, 0);
            physics.setLeft(other, 7);

            // Act
            const thingToLeft = physics.thingToLeft(thing, other);

            // Assert
            expect(thingToLeft).to.be.equal(true);
        });

        it("is true when thing overlaps to the left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setMidX(thing, 7);
            physics.setMidX(other, 7.7);

            // Act
            const thingToLeft = physics.thingToLeft(thing, other);

            // Assert
            expect(thingToLeft).to.be.equal(true);
        });

        it("is false when thing is to the right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setLeft(thing, 0);
            physics.setRight(other, 7);

            // Act
            const thingToLeft = physics.thingToLeft(thing, other);

            // Assert
            expect(thingToLeft).to.be.equal(false);
        });

        it("is false when thing overlaps to the right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const other = stubThing();

            physics.setMidY(thing, 7.7);
            physics.setMidY(other, 7);

            // Act
            const thingToLeft = physics.thingToLeft(thing, other);

            // Assert
            expect(thingToLeft).to.be.equal(false);
        });
    });

    describe("updateBottom", () => {
        it("updates bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const bottom = thing.bottom;
            const newBottom = bottom + 3.5;

            // Act
            physics.setBottom(thing, newBottom);

            // Assert
            expect(thing.bottom).to.be.equal(newBottom);
        });

        it("adjusts top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const bottom = thing.bottom;
            const newBottom = bottom + 3.5;
            const newTop = newBottom - thing.height;

            // Act
            physics.setBottom(thing, newBottom);

            // Assert
            expect(thing.top).to.be.equal(newTop);
        });
    });

    describe("updateLeft", () => {
        it("updates left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const left = thing.left;
            const newLeft = left + 3.5;

            // Act
            physics.setLeft(thing, newLeft);

            // Assert
            expect(thing.left).to.be.equal(newLeft);
        });

        it("adjusts right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const left = thing.left;
            const newLeft = left + 3.5;
            const newRight = newLeft + thing.width;

            // Act
            physics.setLeft(thing, newLeft);

            // Assert
            expect(thing.right).to.be.equal(newRight);
        });
    });

    describe("updateRight", () => {
        it("updates right", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const newRight = thing.right + 3.5;

            // Act
            physics.setRight(thing, newRight);

            // Assert
            expect(thing.right).to.be.equal(newRight);
        });

        it("adjusts left", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const right = thing.right;
            const newRight = right + 3.5;
            const newLeft = newRight - thing.width;

            // Act
            physics.setRight(thing, newRight);

            // Assert
            expect(thing.left).to.be.equal(newLeft);
        });
    });

    describe("updateTop", () => {
        it("updates top", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const top = thing.top;
            const newTop = top + 3.5;

            // Act
            physics.setTop(thing, newTop);

            // Assert
            expect(thing.top).to.be.equal(newTop);
        });

        it("adjusts bottom", (): void => {
            // Arrange
            const { physics } = stubGameStartr();
            const thing = stubThing();
            const top = thing.top;
            const newTop = top + 3.5;
            const newBottom = newTop + thing.height;

            // Act
            physics.setTop(thing, newTop);

            // Assert
            expect(thing.bottom).to.be.equal(newBottom);
        });
    });
});
