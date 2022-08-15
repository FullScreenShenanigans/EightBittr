import { expect } from "chai";

import { createFullScreenSaver } from "./fakes.test";

describe("FullScreenSaver", () => {
    it("starts with one square", () => {
        // Arrange
        const { game } = createFullScreenSaver();

        // Assert
        expect(game.groupHolder.getGroup("Squares")).to.have.length(1);
    });

    it("adds a player when a directional input is pressed", () => {
        // Arrange
        const { game } = createFullScreenSaver();

        // Act
        game.inputWriter.callEvent("onkeydown", "left");

        // Assert
        expect(game.groupHolder.getGroup("Players")).to.have.length(1);
    });

    it("increases to two squares 150 ticks after a player is added", () => {
        // Arrange
        const { clock, game } = createFullScreenSaver();
        game.inputWriter.callEvent("onkeydown", "left");

        // (move the player out of the way)
        game.physics.shiftActors(game.groupHolder.getGroup("Players"), 9001, 9001);

        // Act
        clock.tick(150 * game.frameTicker.getInterval());

        // Assert
        expect(game.groupHolder.getGroup("Squares")).to.have.length(2);
    });

    it("stops adding squares after the player is hit", () => {
        // Arrange
        const { clock, game } = createFullScreenSaver();
        game.inputWriter.callEvent("onkeydown", "left");

        // Act
        clock.tick(300 * game.frameTicker.getInterval());

        // Assert
        expect(game.groupHolder.getGroup("Players")).to.have.length(0);
        expect(game.groupHolder.getGroup("Squares")).to.have.length(1);
    });
});
