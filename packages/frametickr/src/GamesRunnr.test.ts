import { expect } from "chai";
import * as sinon from "sinon";

import { stubGamesRunnr } from "./fakes.test";

describe("GamesRunnr", () => {
    describe("getPaused", () => {
        it("returns true before play has started", () => {
            // Arrange
            const { gamesRunner } = stubGamesRunnr();

            // Act
            const paused = gamesRunner.getPaused();

            // Assert
            expect(paused).to.be.equal(true);
        });

        it("returns false after play has started", () => {
            // Arrange
            const { gamesRunner } = stubGamesRunnr();

            gamesRunner.play();

            // Act
            const paused = gamesRunner.getPaused();

            // Assert
            expect(paused).to.be.equal(false);

        });

        it("returns true after play is paused", () => {
            // Arrange
            const { gamesRunner } = stubGamesRunnr();

            gamesRunner.play();
            gamesRunner.pause();

            // Act
            const paused = gamesRunner.getPaused();

            // Assert
            expect(paused).to.be.equal(true);
        });
    });

    describe("pause", () => {
        it("stops games from executing when previously playing", () => {
            // Arrange
            const games = [sinon.stub()];
            const interval = 10;
            const { clock, gamesRunner } = stubGamesRunnr({ games, interval });

            gamesRunner.play();
            gamesRunner.pause();

            // Act
            clock.tick(interval);

            // Assert
            expect(games[0]).to.have.callCount(1);
        });

        it("doesn't fire a pause event before being called", () => {
            // Arrange
            const events = {
                pause: sinon.stub(),
            };
            const { gamesRunner } = stubGamesRunnr({ events });

            // Act
            gamesRunner.play();

            // Assert
            expect(events.pause).to.callCount(0);
        });

        it("fires a pause event when there is one", () => {
            // Arrange
            const events = {
                pause: sinon.stub(),
            };
            const { gamesRunner } = stubGamesRunnr({ events });

            gamesRunner.play();

            // Act
            gamesRunner.pause();

            // Assert
            expect(events.pause).to.callCount(1);
        });
    });

    describe("play", () => {
        it("executes games immediately when previously paused", () => {
            // Arrange
            const games = [sinon.stub(), sinon.stub()];
            const { gamesRunner } = stubGamesRunnr({ games });

            // Act
            gamesRunner.play();

            // Assert
            expect(games[0]).to.have.callCount(1);
            expect(games[1]).to.have.callCount(1);
        });

        it("doesn't re-run games when run twice", () => {
            // Arrange
            const games = [sinon.stub()];
            const { gamesRunner } = stubGamesRunnr({ games });

            // Act
            gamesRunner.play();
            gamesRunner.play();

            // Assert
            expect(games[0]).to.have.callCount(1);
        });

        it("doesn't run games again before the interval has passed", () => {
            // Arrange
            const games = [sinon.stub()];
            const interval = 10;
            const { clock, gamesRunner } = stubGamesRunnr({ games, interval });

            gamesRunner.play();

            // Act
            clock.tick(interval - 1);

            // Assert
            expect(games[0]).to.have.callCount(1);
        });

        it("runs games again when the interval has passed", () => {
            // Arrange
            const games = [sinon.stub()];
            const interval = 10;
            const { clock, gamesRunner } = stubGamesRunnr({ games, interval });

            gamesRunner.play();

            // Act
            clock.tick(interval);

            // Assert
            expect(games[0]).to.have.callCount(2);
        });

        it("doesn't fire a pause event before being called", () => {
            // Arrange
            const events = {
                play: sinon.stub(),
            };

            // Act
            stubGamesRunnr({ events });

            // Assert
            expect(events.play).to.callCount(0);
        });

        it("fires a pause event when there is one", () => {
            // Arrange
            const events = {
                play: sinon.stub(),
            };
            const { gamesRunner } = stubGamesRunnr({ events });

            // Act
            gamesRunner.play();

            // Assert
            expect(events.play).to.callCount(1);
        });
    });

    describe("setInterval", () => {
        it("doesn't affect previously scheduled ticks", () => {
            // Arrange
            const games = [sinon.stub()];
            const interval = 10;
            const { clock, gamesRunner } = stubGamesRunnr({ games, interval });

            gamesRunner.play();

            // Act
            gamesRunner.setInterval(100);
            clock.tick(interval);

            // Assert
            expect(games[0]).to.have.callCount(2);
        });

        it("changes the schedule for future ticks", () => {
            // Arrange
            const games = [sinon.stub()];
            const interval = 10;
            const newInterval = 100;
            const { clock, gamesRunner } = stubGamesRunnr({ games, interval });

            // Act
            gamesRunner.setInterval(newInterval);
            gamesRunner.play();
            clock.tick(newInterval);

            // Assert
            expect(games[0]).to.have.callCount(2);
        });
    });

    describe("getInterval", () => {
        it("gets the initial interval when interval hasn't been changed", () => {
            // Arrange
            const initialInterval = 10;
            const { gamesRunner } = stubGamesRunnr({
                interval: initialInterval,
            });

            // Act
            const retrievedInterval = gamesRunner.getInterval();

            // Assert
            expect(retrievedInterval).to.be.equal(initialInterval);
        });

        it("gets an updated interval when the interval has been changed", () => {
            // Arrange
            const updatedInterval = 10;
            const { gamesRunner } = stubGamesRunnr({
                interval: updatedInterval / 2,
            });

            gamesRunner.setInterval(updatedInterval);

            // Act
            const retrievedInterval = gamesRunner.getInterval();

            // Assert
            expect(retrievedInterval).to.be.equal(updatedInterval);
        });
    });
});
