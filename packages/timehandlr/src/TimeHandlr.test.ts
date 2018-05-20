import { expect } from "chai";
import * as sinon from "sinon";

import { TimeHandlr } from "./TimeHandlr";

describe("TimeHandlr", () => {
    describe("addEvent", () => {
        it("doesn't call an event before advancing to its tick", () => {
            // Arrange
            const timeHandler = new TimeHandlr();
            const callback = sinon.spy();

            // Act
            timeHandler.addEvent(callback);

            // Assert
            expect(callback).to.have.callCount(0);
        });

        it("adds an event to be executed on the next tick by default", () => {
            // Arrange
            const timeHandler = new TimeHandlr();
            const callback = sinon.spy();

            timeHandler.addEvent(callback);

            // Act
            timeHandler.advance();

            // Assert
            expect(callback).to.have.callCount(1);
        });

        it("doesn't call a delayed event before advancing to its tick", () => {
            // Arrange
            const timeHandler = new TimeHandlr();
            const callback = sinon.spy();
            const delay = 7;

            timeHandler.addEvent(callback, delay);

            // Act
            for (let i = 0; i < delay - 1; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(callback).to.have.callCount(0);
        });

        it("calls a delayed event when advanced to its tick", () => {
            // Arrange
            const timeHandler = new TimeHandlr();
            const callback = sinon.spy();
            const delay = 7;

            timeHandler.addEvent(callback, delay);

            // Act
            for (let i = 0; i < delay; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(callback).to.have.callCount(1);
        });

        it("passes extra args to the callback when given them", () => {
            // Arrange
            const timeHandler = new TimeHandlr();
            const callback = sinon.spy();
            const args = ["a", "b", "c"];

            timeHandler.addEvent(callback, 1, ...args);

            // Act
            timeHandler.advance();

            // Assert
            expect(callback).to.have.been.calledWithExactly(...args);
        });
    });
});
