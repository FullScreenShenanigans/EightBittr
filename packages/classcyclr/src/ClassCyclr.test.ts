import { expect } from "chai";

import { createClassCycler, createStubActor } from "./fakes.test";

const interval = 8;

describe("ClassCyclr", () => {
    describe("addClassCycle", () => {
        it("immediately runs a first class cycle when the actor does not have any cycles or class name", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("immediately runs a first class cycle when the actor does not have any cycles", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor({ className: "initial" });

            // Act
            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            // Assert
            expect(actor.className).to.be.equal("initial apple");
        });

        it("immediately runs a first class cycle when the actor previously does have cycles", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor({ className: "initial" });

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle1", interval);

            // Act
            classCycler.addClassCycle(actor, ["cherry", "dragonfruit"], "myCycle2", interval);

            // Assert
            expect(actor.className).to.be.equal("initial apple cherry");
        });

        it("switches classes when the cycle time ticks", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor({ className: "initial" });

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            // Act
            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("initial banana");
        });

        it("does not remove an existing, duplicate class name when the cycle time ticks", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = {
                className: "initial apple",
                placed: true,
            };

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            // Act
            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("initial apple banana");
        });

        it("switches classes again when the cycle time ticks twice", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor({ className: "initial" });

            classCycler.addClassCycle(actor, ["apple", "banana", "cherry"], "myCycle", interval);

            // Act
            for (let i = 0; i < interval * 2; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("initial cherry");
        });

        it("restarts classes when the cycle time ticks through all classes after no initial class name", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana", "cherry"], "myCycle", interval);

            // Act
            for (let i = 0; i < interval * 3; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("restarts classes when the cycle time ticks through all classes after an initial class name", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor({ className: "initial" });

            classCycler.addClassCycle(actor, ["apple", "banana", "cherry"], "myCycle", interval);

            // Act
            for (let i = 0; i < interval * 3; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("initial apple");
        });

        it("allows for multiple independent cycles", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle1", interval);
            classCycler.addClassCycle(
                actor,
                ["cherry", "dragonfruit"],
                "myCycle2",
                interval * 1.5
            );

            // Act
            for (let i = 0; i < interval * 3; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("cherry banana");
        });
    });

    describe("addClassCycleSynched", () => {
        it("immediately runs a class cycle when the timeHandler", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycleSynched(actor, ["apple", "banana"], "myCycle", interval);

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("does not advance a class cycle when the timeHandler has not yet reached the tick interval", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycleSynched(actor, ["apple", "banana"], "myCycle", interval);

            for (let i = 0; i < interval - 1; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("advances a class cycle when the timeHandler reaches the tick interval", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycleSynched(actor, ["apple", "banana"], "myCycle", interval);

            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("banana");
        });

        it("adds a class when provided as a function that returns a string", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycle(
                actor,
                [() => "apple", () => "banana"],
                "myCycle",
                interval
            );

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("adds a next class when provided as a function that returns a string", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycle(
                actor,
                [() => "apple", () => "banana"],
                "myCycle",
                interval
            );

            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("banana");
        });

        it("does not continue cycling when when provided a function that returns true", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycle(
                actor,
                [() => "apple", () => true, () => "cherry"],
                "myCycle",
                interval
            );

            for (let i = 0; i < interval * 2; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("");
        });

        it("continues cycling when when provided a function that returns false", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            // Act
            classCycler.addClassCycle(
                actor,
                [() => "apple", () => false, () => "cherry"],
                "myCycle",
                interval
            );

            for (let i = 0; i < interval * 2; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("cherry");
        });
    });

    describe("cancelAllCycles", () => {
        it("does not crash when an actor does not yet have cycles", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            // Act
            const act = () => classCycler.cancelAllCycles(actor);

            // Assert
            expect(act).not.to.throw();
        });

        it("cancels multiple cycles", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle1", interval);
            classCycler.addClassCycle(actor, ["cherry", "dragonfruit"], "myCycle2", interval);

            // Act
            classCycler.cancelClassCycle(actor, "myCycle1");
            classCycler.cancelClassCycle(actor, "myCycle2");

            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Assert
            expect(actor.className).to.be.equal("apple cherry");
        });
    });

    describe("cancelClassCycle", () => {
        it("does not crash when an actor does not yet have cycles", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            // Act
            const act = () => classCycler.cancelClassCycle(actor, "myCycle");

            // Assert
            expect(act).not.to.throw();
        });

        it("cancels a cycle when the cycle has not reached its second iteration", () => {
            // Arrange
            const { classCycler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            // Act
            classCycler.cancelClassCycle(actor, "myCycle");

            // Assert
            expect(actor.className).to.be.equal("apple");
        });

        it("cancels a cycle when the cycle has not yet looped", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            for (let i = 0; i < interval; i += 1) {
                timeHandler.advance();
            }

            // Act
            classCycler.cancelClassCycle(actor, "myCycle");

            // Assert
            expect(actor.className).to.be.equal("banana");
        });

        it("cancels a cycle when the cycle has looped", () => {
            // Arrange
            const { classCycler, timeHandler } = createClassCycler();
            const actor = createStubActor();

            classCycler.addClassCycle(actor, ["apple", "banana"], "myCycle", interval);

            for (let i = 0; i < interval * 2; i += 1) {
                timeHandler.advance();
            }

            // Act
            classCycler.cancelClassCycle(actor, "myCycle");

            // Assert
            expect(actor.className).to.be.equal("apple");
        });
    });
});
