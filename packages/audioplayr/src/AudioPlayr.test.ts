import { expect } from "chai";

import { AudioPlayr } from "./AudioPlayr";
import { stubAudioPlayr } from "./fakes.test";
import { AudioSetting } from "./Storage";

describe("AudioPlayr", () => {
    describe("getMuted", () => {
        it("returns false by default (not muted)", () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();

            // Act
            const muted = audioPlayer.getMuted();

            // Assert
            expect(muted).to.be.equal(false);
        });

        it("returns false when not muted", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            await audioPlayer.setMuted(false);

            // Act
            const muted = audioPlayer.getMuted();

            // Assert
            expect(muted).to.be.equal(false);
        });

        it("returns true when muted", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            await audioPlayer.setMuted(true);

            // Act
            const muted = audioPlayer.getMuted();

            // Assert
            expect(muted).to.be.equal(true);
        });
    });

    describe("getVolume", () => {
        it("returns 1 by default", () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();

            // Act
            const volume = audioPlayer.getVolume();

            // Assert
            expect(volume).to.be.equal(1);
        });

        it("returns the real volume when a volume is set", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const storedVolume = 0.5;
            await audioPlayer.setVolume(storedVolume);

            // Act
            const retrievedVolume = audioPlayer.getVolume();

            // Assert
            expect(retrievedVolume).to.be.equal(storedVolume);
        });
    });

    describe("setMuted", () => {
        it("sets globalMuted for future sounds", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";
            const globalMuted = false;

            await audioPlayer.setMuted(globalMuted);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, { globalMuted });
        });

        it("updates globalMuted for existing sounds", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";
            const globalMuted = false;

            await audioPlayer.play(name);

            // Act
            await audioPlayer.setMuted(globalMuted);

            // Assert
            expect(getCreatedSound(name).setGlobalMuted).to.have.been.calledWithExactly(globalMuted);
        });
    });

    describe("setVolume", () => {
        it("sets the volume for future sounds", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";
            const volume = 0.5;

            await audioPlayer.setVolume(volume);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, {
                globalVolume: 0.5,
            });
        });

        it("updates the volume for existing sounds", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";
            const volume = 0.5;

            await audioPlayer.play(name);

            // Act
            await audioPlayer.setVolume(volume);

            // Assert
            expect(getCreatedSound(name).setGlobalVolume).to.have.been.calledWithExactly(volume);
        });
    });

    describe("play", () => {
        it("creates sounds with the provided name when no nameTransform is specified", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name);
        });

        it("creates sounds with a transformed name when nameTransform is specified", async () => {
            // Arrange
            const transformed = "transformed";
            const { audioPlayer, createSound } = stubAudioPlayr({
                nameTransform: () => transformed,
            });
            const name = "test";

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(transformed);
        });

        it("plays a new sound when one doesn't yet exist", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(getCreatedSound(name).play).to.have.callCount(1);
        });

        it("creates a new sound when the sound already exists", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";

            await audioPlayer.play(name);
            const oldSound = getCreatedSound(name);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(getCreatedSound(name)).to.not.be.equal(oldSound);
        });

        it("stops the old sound when the sound already exists", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";

            await audioPlayer.play(name);
            const oldSound = getCreatedSound(name);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(oldSound.stop).to.have.callCount(1);
        });

        it("respects the global volume when it's set", async () => {
            // Arrange
            const { audioPlayer, createSound, storage } = stubAudioPlayr();
            const name = "test";
            const globalVolume = 0.5;

            storage.setItem(AudioSetting.Volume, `${globalVolume}`);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, { globalVolume });
        });

        it("respects a sound's volume when it's set", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";
            const volume = 0.5;

            // Act
            await audioPlayer.play(name, { volume });

            // Assert
            expect(createSound).to.have.been.calledWithMatch(
                name,
                {
                    localVolume: volume,
                });
        });

        it("respects both the global volume and a sound's volume when both are set", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";
            const globalVolume = 0.7;
            const localVolume = 0.3;

            await audioPlayer.setVolume(globalVolume);

            // Act
            await audioPlayer.play(
                name,
                {
                    volume: localVolume,
                });

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, {
                globalVolume, localVolume,
            });
        });

        it("respects the global muted when it's set", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";

            await audioPlayer.setMuted(true);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, {
                globalMuted: true,
            });
        });

        it("respects a sound's muted when it's set", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";

            // Act
            await audioPlayer.play(
                name,
                {
                    muted: true,
                });

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, {
                localMuted: true,
            });
        });

        it("loops a sound when looping is true", async () => {
            // Arrange
            const { audioPlayer, createSound } = stubAudioPlayr();
            const name = "test";

            // Act
            await audioPlayer.play(name, {
                loop: true,
            });

            // Assert
            expect(createSound).to.have.been.calledWithMatch(name, {
                loop: true,
            });
        });

        it("overrides an existing sound under the same name", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const name = "test";

            await audioPlayer.play(name);
            const firstSound = getCreatedSound(name);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(firstSound.stop).to.have.callCount(1);
            expect(getCreatedSound(name)).to.not.be.equal(firstSound);
        });

        it("overrides an existing sound under the same transformed name", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr({
                nameTransform: (soundName: string): string => `${soundName}-transformed.mp3`,
            });
            const name = "test";

            await audioPlayer.play(name);
            const firstSound = getCreatedSound(name);

            // Act
            await audioPlayer.play(name);

            // Assert
            expect(firstSound.stop).to.have.callCount(1);
            expect(getCreatedSound(name)).to.not.be.equal(firstSound);
        });

        it("overrides an existing sound under the same alias", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const names = ["abc", "def"];
            const alias = "theme";

            await audioPlayer.play(names[0], { alias });
            const firstSound = getCreatedSound(names[0]);

            // Act
            await audioPlayer.play(names[1], { alias });

            // Assert
            expect(firstSound.stop).to.have.callCount(1);
        });

        it("overrides an existing sound under the same transformed alias", async () => {
            // Arrange{
            const { audioPlayer, getCreatedSound } = stubAudioPlayr({
                nameTransform: (soundName: string): string => `${soundName}-transformed.mp3`,
            });
            const names = ["abc", "def"];
            const alias = "theme";

            await audioPlayer.play(names[0], { alias });
            const firstSound = getCreatedSound(names[0]);

            // Act
            await audioPlayer.play(names[1], { alias });

            // Assert
            expect(firstSound.stop).to.have.callCount(1);
        });
    });

    describe("pauseAll", () => {
        it("pauses all named sounds when they exist", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const names = ["abc", "def"];

            await audioPlayer.play(names[0]);
            await audioPlayer.play(names[1]);

            // Act
            await audioPlayer.pauseAll();

            // Assert
            expect(getCreatedSound(names[0]).pause).to.have.callCount(1);
            expect(getCreatedSound(names[1]).pause).to.have.callCount(1);
        });
    });

    describe("resumeAll", () => {
        it("plays all named sounds when they exist", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const names = ["abc", "def"];

            await audioPlayer.play(names[0]);
            await audioPlayer.play(names[1]);

            // Act
            await audioPlayer.resumeAll();

            // Assert
            expect(getCreatedSound(names[0]).play).to.have.callCount(2);
            expect(getCreatedSound(names[1]).play).to.have.callCount(2);
        });
    });

    describe("stopAll", () => {
        it("stops all named sounds when they exist", async () => {
            // Arrange
            const { audioPlayer, getCreatedSound } = stubAudioPlayr();
            const names = ["abc", "def"];

            await audioPlayer.play(names[0]);
            await audioPlayer.play(names[1]);

            // Act
            await audioPlayer.stopAll();

            // Assert
            expect(getCreatedSound(names[0]).stop).to.have.callCount(1);
            expect(getCreatedSound(names[1]).stop).to.have.callCount(1);
        });
    });

    describe("hasSound", () => {
        it("returns false when no sounds exist", () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const name = "test";

            // Act
            const result = audioPlayer.hasSound(name);

            // Assert
            expect(result).to.be.equal(false);
        });

        it("returns false when sounds don't exist under the alias", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const exists = "exists";
            const none = "none";

            await audioPlayer.play(exists);

            // Act
            const result = audioPlayer.hasSound(none);

            // Assert
            expect(result).to.be.equal(false);
        });

        it("returns true when a sound exists under the alias and no name is specified", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const name = "test";

            await audioPlayer.play(name);

            // Act
            const result = audioPlayer.hasSound(name);

            // Assert
            expect(result).to.be.equal(true);
        });

        it("returns false when a sound exists under the alias but doesn't match a specified name", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const name = "test";
            const exists = "exists";
            const none = "none";

            await audioPlayer.play(name, { alias: exists });

            // Act
            const result = audioPlayer.hasSound(name, none);

            // Assert
            expect(result).to.be.equal(false);
        });

        it("returns true when a sound exists under the alias and name", async () => {
            // Arrange
            const { audioPlayer } = stubAudioPlayr();
            const name = "test";
            const alias = "alias";

            await audioPlayer.play(name, { alias });

            // Act
            const result = audioPlayer.hasSound(name, alias);

            // Assert
            expect(result).to.be.equal(false);
        });
    });
});
