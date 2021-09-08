import { expect } from "chai";

import { stubEightBittr, stubActor } from "../fakes.test";

describe("Physics", () => {
    describe("setBottom", () => {
        it("sets bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newBottom = 3.5;

            // Act
            physics.setBottom(actor, newBottom);

            // Assert
            expect(actor.bottom).to.be.equal(newBottom);
        });

        it("adjusts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newBottom = 3.5;
            const newTop = newBottom - actor.height;

            // Act
            physics.setBottom(actor, newBottom);

            // Assert
            expect(actor.top).to.be.equal(newTop);
        });
    });

    describe("setLeft", () => {
        it("sets left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newLeft = 3.5;

            // Act
            physics.setLeft(actor, newLeft);

            // Assert
            expect(actor.left).to.be.equal(newLeft);
        });

        it("adjusts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newLeft = 3.5;
            const newRight = newLeft + actor.width;

            // Act
            physics.setLeft(actor, newLeft);

            // Assert
            expect(actor.right).to.be.equal(newRight);
        });
    });

    describe("setMid", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const height = actor.height;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(actor, newMidX, newMidY);

            // Assert
            expect(actor.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(actor, newMidX, newMidY);

            // Assert
            expect(actor.right).to.be.equal(newMidX + width / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const height = actor.height;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(actor, newMidX, newMidY);

            // Assert
            expect(actor.bottom).to.be.equal(newMidY + height / 2);
        });

        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;
            const newMidY = 11.7;

            // Act
            physics.setMid(actor, newMidX, newMidY);

            // Assert
            expect(actor.left).to.be.equal(newMidX - width / 2);
        });
    });

    describe("setMidObj", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const height = actor.height;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(actor, positioner);

            // Assert
            expect(actor.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(actor, positioner);

            // Assert
            expect(actor.right).to.be.equal(newMidX + width / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const height = actor.height;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(actor, positioner);

            // Assert
            expect(actor.bottom).to.be.equal(newMidY + height / 2);
        });

        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;
            const newMidY = 3.5;

            physics.setMid(positioner, newMidX, newMidY);

            // Act
            physics.setMidObj(actor, positioner);

            // Assert
            expect(actor.left).to.be.equal(newMidX - width / 2);
        });
    });

    describe("setMidX", () => {
        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;

            // Act
            physics.setMidX(actor, newMidX);

            // Assert
            expect(actor.left).to.be.equal(newMidX - width / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;

            // Act
            physics.setMidX(actor, newMidX);

            // Assert
            expect(actor.right).to.be.equal(newMidX + width / 2);
        });
    });

    describe("setMidXObj", () => {
        it("shifts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;

            physics.setMidX(positioner, newMidX);

            // Act
            physics.setMidXObj(actor, positioner);

            // Assert
            expect(actor.left).to.be.equal(newMidX - width / 2);
        });

        it("shifts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const width = actor.width;
            const newMidX = 3.5;

            physics.setMidX(positioner, newMidX);

            // Act
            physics.setMidXObj(actor, positioner);

            // Assert
            expect(actor.right).to.be.equal(newMidX + width / 2);
        });
    });

    describe("setMidY", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const height = actor.height;
            const newMidY = 3.5;

            // Act
            physics.setMidY(actor, newMidY);

            // Assert
            expect(actor.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const height = actor.height;
            const newMidY = 3.5;

            // Act
            physics.setMidY(actor, newMidY);

            // Assert
            expect(actor.bottom).to.be.equal(newMidY + height / 2);
        });
    });

    describe("setMidYObj", () => {
        it("shifts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const height = actor.height;
            const newMidY = 3.5;

            physics.setMidY(positioner, newMidY);

            // Act
            physics.setMidYObj(actor, positioner);

            // Assert
            expect(actor.top).to.be.equal(newMidY - height / 2);
        });

        it("shifts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const positioner = stubActor();
            const actor = stubActor();
            const height = actor.height;
            const newMidY = 3.5;

            physics.setMidY(positioner, newMidY);

            // Act
            physics.setMidYObj(actor, positioner);

            // Assert
            expect(actor.bottom).to.be.equal(newMidY + height / 2);
        });
    });

    describe("setRight", () => {
        it("sets right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newRight = 3.5;

            // Act
            physics.setRight(actor, newRight);

            // Assert
            expect(actor.right).to.be.equal(newRight);
        });

        it("adjusts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newRight = 3.5;
            const newLeft = newRight - actor.width;

            // Act
            physics.setRight(actor, newRight);

            // Assert
            expect(actor.left).to.be.equal(newLeft);
        });
    });

    describe("setTop", () => {
        it("sets top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newTop = 3.5;

            // Act
            physics.setTop(actor, newTop);

            // Assert
            expect(actor.top).to.be.equal(newTop);
        });

        it("adjusts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newTop = 3.5;
            const newbottom = newTop + actor.height;

            // Act
            physics.setTop(actor, newTop);

            // Assert
            expect(actor.bottom).to.be.equal(newbottom);
        });
    });

    describe("shiftHoriz", () => {
        it("shifts horizontally", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const left = actor.left;
            const right = actor.right;
            const amount = 7;

            // Act
            physics.shiftHoriz(actor, amount);

            // Assert
            expect(actor.left).to.be.equal(left + amount);
            expect(actor.right).to.be.equal(right + amount);
        });

        it("doesn't shift vertically", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const top = actor.top;
            const bottom = actor.bottom;

            // Act
            physics.shiftHoriz(actor, 7);

            // Assert
            expect(actor.top).to.be.equal(top);
            expect(actor.bottom).to.be.equal(bottom);
        });
    });

    describe("shiftVert", () => {
        it("shifts vertically", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const top = actor.top;
            const bottom = actor.bottom;
            const amount = 7;

            // Act
            physics.shiftVert(actor, amount);

            // Assert
            expect(actor.top).to.be.equal(top + amount);
            expect(actor.bottom).to.be.equal(bottom + amount);
        });

        it("doesn't shift horizontally", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const left = actor.left;
            const right = actor.right;

            // Act
            physics.shiftVert(actor, 7);

            // Assert
            expect(actor.left).to.be.equal(left);
            expect(actor.right).to.be.equal(right);
        });
    });

    describe("slideToX", () => {
        it("shifts completely to the left with no limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 35;
            const newMidX = 11.7;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(newMidX);
        });

        it("shifts completely to the right with no limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 11.7;
            const newMidX = 35;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(newMidX);
        });

        it("shifts completely to the left with a large limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 35;
            const newMidX = 11.7;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX, 700);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(newMidX);
        });

        it("shifts completely to the right with a large limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 11.7;
            const newMidX = 35;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX, 700);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(newMidX);
        });

        it("shifts partially to the left with a limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 35;
            const newMidX = 11.7;
            const limit = 7;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX, limit);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(midX - limit);
        });

        it("shifts partially to the right with a limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midX = 11.7;
            const newMidX = 35;
            const limit = 7;

            physics.setMidX(actor, midX);

            // Act
            physics.slideToX(actor, newMidX, limit);

            // Assert
            expect(physics.getMidX(actor)).to.be.equal(midX + limit);
        });
    });

    describe("slideToY", () => {
        it("shifts completely to the top with no limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 35;
            const newMidY = 11.7;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(newMidY);
        });

        it("shifts completely to the bottom with no limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 11.7;
            const newMidY = 35;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(newMidY);
        });

        it("shifts completely to the top with a large limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 35;
            const newMidY = 11.7;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY, 700);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(newMidY);
        });

        it("shifts completely to the bottom with a large limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 11.7;
            const newMidY = 35;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY, 700);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(newMidY);
        });

        it("shifts partially to the top with a limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 35;
            const newMidY = 11.7;
            const limit = 7;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY, limit);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(midY - limit);
        });

        it("shifts partially to the bottom with a limit", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const midY = 11.7;
            const newMidY = 35;
            const limit = 7;

            physics.setMidY(actor, midY);

            // Act
            physics.slideToY(actor, newMidY, limit);

            // Assert
            expect(physics.getMidY(actor)).to.be.equal(midY + limit);
        });
    });

    describe("actorAbove", () => {
        it("is true when actor is above", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setBottom(actor, 0);
            physics.setTop(other, 7);

            // Act
            const actorAbove = physics.actorAbove(actor, other);

            // Assert
            expect(actorAbove).to.be.equal(true);
        });

        it("is true when actor overlaps above", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setMidY(actor, 7);
            physics.setMidY(other, 7.7);

            // Act
            const actorAbove = physics.actorAbove(actor, other);

            // Assert
            expect(actorAbove).to.be.equal(true);
        });

        it("is false when actor is below", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setTop(actor, 0);
            physics.setBottom(other, 7);

            // Act
            const actorAbove = physics.actorAbove(actor, other);

            // Assert
            expect(actorAbove).to.be.equal(false);
        });

        it("is false when actor overlaps below", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setMidY(actor, 7.7);
            physics.setMidY(other, 7);

            // Act
            const actorAbove = physics.actorAbove(actor, other);

            // Assert
            expect(actorAbove).to.be.equal(false);
        });
    });

    describe("actorToLeft", () => {
        it("is true when actor is to the left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setRight(actor, 0);
            physics.setLeft(other, 7);

            // Act
            const actorToLeft = physics.actorToLeft(actor, other);

            // Assert
            expect(actorToLeft).to.be.equal(true);
        });

        it("is true when actor overlaps to the left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setMidX(actor, 7);
            physics.setMidX(other, 7.7);

            // Act
            const actorToLeft = physics.actorToLeft(actor, other);

            // Assert
            expect(actorToLeft).to.be.equal(true);
        });

        it("is false when actor is to the right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setLeft(actor, 0);
            physics.setRight(other, 7);

            // Act
            const actorToLeft = physics.actorToLeft(actor, other);

            // Assert
            expect(actorToLeft).to.be.equal(false);
        });

        it("is false when actor overlaps to the right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const other = stubActor();

            physics.setMidY(actor, 7.7);
            physics.setMidY(other, 7);

            // Act
            const actorToLeft = physics.actorToLeft(actor, other);

            // Assert
            expect(actorToLeft).to.be.equal(false);
        });
    });

    describe("updateBottom", () => {
        it("updates bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const bottom = actor.bottom;
            const newBottom = bottom + 3.5;

            // Act
            physics.setBottom(actor, newBottom);

            // Assert
            expect(actor.bottom).to.be.equal(newBottom);
        });

        it("adjusts top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const bottom = actor.bottom;
            const newBottom = bottom + 3.5;
            const newTop = newBottom - actor.height;

            // Act
            physics.setBottom(actor, newBottom);

            // Assert
            expect(actor.top).to.be.equal(newTop);
        });
    });

    describe("updateLeft", () => {
        it("updates left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const left = actor.left;
            const newLeft = left + 3.5;

            // Act
            physics.setLeft(actor, newLeft);

            // Assert
            expect(actor.left).to.be.equal(newLeft);
        });

        it("adjusts right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const left = actor.left;
            const newLeft = left + 3.5;
            const newRight = newLeft + actor.width;

            // Act
            physics.setLeft(actor, newLeft);

            // Assert
            expect(actor.right).to.be.equal(newRight);
        });
    });

    describe("updateRight", () => {
        it("updates right", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const newRight = actor.right + 3.5;

            // Act
            physics.setRight(actor, newRight);

            // Assert
            expect(actor.right).to.be.equal(newRight);
        });

        it("adjusts left", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const right = actor.right;
            const newRight = right + 3.5;
            const newLeft = newRight - actor.width;

            // Act
            physics.setRight(actor, newRight);

            // Assert
            expect(actor.left).to.be.equal(newLeft);
        });
    });

    describe("updateTop", () => {
        it("updates top", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const top = actor.top;
            const newTop = top + 3.5;

            // Act
            physics.setTop(actor, newTop);

            // Assert
            expect(actor.top).to.be.equal(newTop);
        });

        it("adjusts bottom", (): void => {
            // Arrange
            const { physics } = stubEightBittr();
            const actor = stubActor();
            const top = actor.top;
            const newTop = top + 3.5;
            const newBottom = newTop + actor.height;

            // Act
            physics.setTop(actor, newTop);

            // Assert
            expect(actor.bottom).to.be.equal(newBottom);
        });
    });
});
