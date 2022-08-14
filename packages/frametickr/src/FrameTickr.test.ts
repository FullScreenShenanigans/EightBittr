import { expect } from "chai";
import * as sinon from "sinon";

import { stubFrameTickr } from "./fakes.test";

describe("FrameTickr", () => {
    describe("getPaused", () => {
        it("returns true before play has started", () => {
            // Arrange
            const { frameTicker } = stubFrameTickr();

            // Act
            const paused = frameTicker.getPaused();

            // Assert
            expect(paused).to.be.equal(true);
        });

        it("returns false after play has started", () => {
            // Arrange
            const { frameTicker } = stubFrameTickr();

            frameTicker.play();

            // Act
            const paused = frameTicker.getPaused();

            // Assert
            expect(paused).to.be.equal(false);
        });

        it("returns true after play is paused", () => {
            // Arrange
            const { frameTicker } = stubFrameTickr();

            frameTicker.play();
            frameTicker.pause();

            // Act
            const paused = frameTicker.getPaused();

            // Assert
            expect(paused).to.be.equal(true);
        });
    });

    describe("pause", () => {
        it("stops frame from executing when previously playing", () => {
            // Arrange
            const frame = sinon.stub();
            const interval = 10;
            const { clock, frameTicker } = stubFrameTickr({ frame, interval });

            frameTicker.play();
            frameTicker.pause();

            // Act
            clock.tick(interval);

            // Assert
            expect(frame).to.have.callCount(1);
        });

        it("doesn't fire a pause event before being called", () => {
            // Arrange
            const events = {
                pause: sinon.stub(),
            };
            const { frameTicker } = stubFrameTickr({ events });

            // Act
            frameTicker.play();

            // Assert
            expect(events.pause).to.callCount(0);
        });

        it("fires a pause event when there is one", () => {
            // Arrange
            const events = {
                pause: sinon.stub(),
            };
            const { frameTicker } = stubFrameTickr({ events });

            frameTicker.play();

            // Act
            frameTicker.pause();

            // Assert
            expect(events.pause).to.callCount(1);
        });
    });

    describe("play", () => {
        it("executes frame immediately when previously paused", () => {
            // Arrange
            const frame = sinon.stub();
            const { frameTicker } = stubFrameTickr({ frame });

            // Act
            frameTicker.play();

            // Assert
            expect(frame).to.have.callCount(1);
        });

        it("doesn't re-run frame when run twice", () => {
            // Arrange
            const frame = sinon.stub();
            const { frameTicker } = stubFrameTickr({ frame });

            // Act
            frameTicker.play();
            frameTicker.play();

            // Assert
            expect(frame).to.have.callCount(1);
        });

        it("doesn't run frame again before the interval has passed", () => {
            // Arrange
            const frame = sinon.stub();
            const interval = 10;
            const { clock, frameTicker } = stubFrameTickr({ frame, interval });

            frameTicker.play();

            // Act
            clock.tick(interval - 1);

            // Assert
            expect(frame).to.have.callCount(1);
        });

        it("runs frame again when the interval has passed", () => {
            // Arrange
            const frame = sinon.stub();
            const interval = 10;
            const { clock, frameTicker } = stubFrameTickr({ frame, interval });

            frameTicker.play();

            // Act
            clock.tick(interval);

            // Assert
            expect(frame).to.have.callCount(2);
        });

        it("doesn't fire a pause event before being called", () => {
            // Arrange
            const events = {
                play: sinon.stub(),
            };

            // Act
            stubFrameTickr({ events });

            // Assert
            expect(events.play).to.callCount(0);
        });

        it("fires a pause event when there is one", () => {
            // Arrange
            const events = {
                play: sinon.stub(),
            };
            const { frameTicker } = stubFrameTickr({ events });

            // Act
            frameTicker.play();

            // Assert
            expect(events.play).to.callCount(1);
        });
    });

    describe("setInterval", () => {
        it("affects previously scheduled ticks", () => {
            // Arrange
            const frame = sinon.stub();
            const interval = 10;
            const { clock, frameTicker } = stubFrameTickr({ frame, interval });

            frameTicker.play();

            // Act
            frameTicker.setInterval(100);
            clock.tick(interval);

            // Assert
            expect(frame).to.have.callCount(1);
        });

        it("changes the schedule for future ticks", () => {
            // Arrange
            const frame = sinon.stub();
            const interval = 10;
            const newInterval = 100;
            const { clock, frameTicker } = stubFrameTickr({ frame, interval });

            // Act
            frameTicker.setInterval(newInterval);
            frameTicker.play();
            clock.tick(newInterval);

            // Assert
            expect(frame).to.have.callCount(2);
        });
    });

    describe("getInterval", () => {
        it("gets the initial interval when interval hasn't been changed", () => {
            // Arrange
            const initialInterval = 10;
            const { frameTicker } = stubFrameTickr({
                interval: initialInterval,
            });

            // Act
            const retrievedInterval = frameTicker.getInterval();

            // Assert
            expect(retrievedInterval).to.be.equal(initialInterval);
        });

        it("gets an updated interval when the interval has been changed", () => {
            // Arrange
            const updatedInterval = 10;
            const { frameTicker } = stubFrameTickr({
                interval: updatedInterval / 2,
            });

            frameTicker.setInterval(updatedInterval);

            // Act
            const retrievedInterval = frameTicker.getInterval();

            // Assert
            expect(retrievedInterval).to.be.equal(updatedInterval);
        });
    });
});
