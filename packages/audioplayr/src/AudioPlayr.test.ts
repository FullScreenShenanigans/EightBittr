import { expect } from "chai";

import {
    delayForAudioRaceCondition, stubAudioPlayr, stubAudioPlayrSettings, stubItemsHoldr, stubSoundName,
} from "./fakes.test";

describe("AudioPlayr", () => {
    describe("addEventImmediate", () => {
        it("calls the function immediately if the sound doesn't exist", () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            let num = 0;
            const increase: () => void = () => {
                num += 1;
            };

            // Act
            audioPlayer.addEventImmediate("X", "loadeddata", increase);

            // Assert
            expect(num).to.equal(1);
        });

        it("doesn't call the function if the sound is not paused and exists", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            let num = 0;
            const increase: () => void = () => {
                num += 1;
            };

            // Act
            audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.addEventImmediate(stubSoundName, "loadeddata", increase);

            // Assert
            expect(num).to.equal(0);
        });

        it("calls the function if the sound is neither paused nor playing", () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            let num = 0;
            const increase: () => void = () => {
                num += 1;
            };

            // Act
            audioPlayer.addEventImmediate(stubSoundName, "loadeddata", increase);

            // Assert
            expect(num).to.equal(1);
        });
    });

    describe("addEventListener", () => {
        it("does not call the callback before the sound is played", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            let num = 0;
            const increase: () => void = () => {
                num += 1;
            };

            // Act
            audioPlayer.addEventListener(stubSoundName, "play", increase);
            const watcher: number = num;
            audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();

            // Assert
            expect(watcher).to.equal(0);
        });
    });

    describe("clearTheme", () => {
        it("sets the theme to undefined", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.playTheme(stubSoundName);
            audioPlayer.clearTheme();

            // Assert
            expect(audioPlayer.getTheme()).to.equal(undefined);
        });

        it("sets the themeName to undefined", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.playTheme(stubSoundName);
            audioPlayer.clearTheme();

            // Assert
            expect(audioPlayer.getThemeName()).to.equal(undefined);
        });

        it("leaves the theme unchanged if no theme was set", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.clearTheme();

            // Assert
            expect(audioPlayer.getTheme()).to.equal(undefined);
        });

        it("leaves the themeName unchanged if no theme was set", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.clearTheme();

            // Assert
            expect(audioPlayer.getThemeName()).to.equal(undefined);
        });
    });

    describe("pauseAll", () => {
        it("pauses a theme", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const theme = audioPlayer.playTheme(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.pauseAll();

            // Assert
            expect(theme.paused).to.equal(true);
        });

        it("pauses a sound (commented out)", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.pauseTheme();

            // Assert
            expect(sound.paused).to.equal(false);
        });
    });

    describe("pauseTheme", () => {
        it("pauses the theme (commented out)", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            const theme = audioPlayer.playTheme(stubSoundName);
            await delayForAudioRaceCondition();

            // Act
            audioPlayer.pauseTheme();

            // Assert
            expect(theme.paused).to.equal(true);
        });

        it("doesn't pause a sound that isn't the theme (commented out)", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());
            const sound = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();

            // Act
            audioPlayer.pauseTheme();

            // Assert
            expect(sound.paused).to.equal(false);
        });
    });

    describe("play", () => {
        it("plays the sound if sounds are muted (commented out)", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.setMutedOn();
            const sound = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();

            // Assert
            expect(sound.paused).to.equal(false);
        });

        it("plays the sound if sounds are not muted (commented out)", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();

            // Assert
            expect(sound.paused).to.equal(false);
        });

        it("throws an error if the sound doesn't exist", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Assert
            expect(audioPlayer.play.bind(audioPlayer, "X")).to.throw("Unknown name given to AudioPlayr.play: 'X'.");
        });
    });

    describe("playLocal", () => {
        it("sets the volume to 0 if sounds are muted", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            audioPlayer.setMutedOn();
            const sound: HTMLAudioElement = audioPlayer.playLocal(stubSoundName);

            // Assert
            expect(sound.volume).to.equal(0);
        });

        it("sets the volume to a default of 1 if sounds are not muted", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.playLocal(stubSoundName);

            // Assert
            expect(sound.volume).to.equal(1);
        });
    });

    describe("playTheme", () => {
        it("sets the theme", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.playTheme(stubSoundName);

            // Assert
            expect(audioPlayer.getTheme()).to.deep.equal(sound);
        });

        it("sets the loop attribute to true", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const theme = audioPlayer.playTheme(stubSoundName);

            // Assert
            expect(theme.loop).to.equal(true);
        });

        it("sets the loop attribute to false", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const theme = audioPlayer.playTheme(stubSoundName, false);

            // Assert
            expect(theme.loop).to.equal(false);
        });

        it("uses default getter (of type string)", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr({
                library: {
                    Sounds: [
                        "Ringtone",
                    ],
                    Themes: [
                        stubSoundName,
                    ],
                },
                getThemeDefault: stubSoundName,
                itemsHolder: stubItemsHoldr(),
            });

            // Act
            audioPlayer.playTheme();

            // Assert
            expect(audioPlayer.getThemeName()).to.equal(stubSoundName);
        });

        it("uses default getter (of type function)", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr({
                library: {
                    Sounds: [
                        "Ringtone",
                    ],
                    Themes: [
                        stubSoundName,
                    ],
                },
                getThemeDefault: (): string => stubSoundName,
                itemsHolder: stubItemsHoldr(),
            });

            // Act
            audioPlayer.playTheme();

            // Assert
            expect(audioPlayer.getThemeName()).to.equal(stubSoundName);
        });
    });

    describe("removeEventListeners", () => {
        it("throws an error if the sound doesn't exist", (): void => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const action = () => {
                audioPlayer.removeEventListeners("unknown", "X");
            };

            // Assert
            expect(action).to.throw("Unknown name given to removeEventListeners: 'unknown'.");
        });
    });

    describe("setMutedOff", () => {
        it("unmutes if the sound is playing", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.setMutedOff();

            // Assert
            expect(sound.volume).to.equal(1);
        });

        it("unmutes if the sound is paused", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.pauseTheme();
            audioPlayer.setMutedOff();

            // Assert
            expect(sound.volume).to.equal(1);
        });
    });

    describe("setMutedOn", () => {
        it("mutes if the sound is playing", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.setMutedOn();

            // Assert
            expect(sound.volume).to.equal(0);
        });

        it("mutes if the sound is paused", async () => {
            // Arrange
            const audioPlayer = stubAudioPlayr(stubAudioPlayrSettings());

            // Act
            const sound: HTMLAudioElement = audioPlayer.play(stubSoundName);
            await delayForAudioRaceCondition();
            audioPlayer.pauseTheme();
            audioPlayer.setMutedOn();

            // Assert
            expect(sound.volume).to.equal(0);
        });
    });
});
