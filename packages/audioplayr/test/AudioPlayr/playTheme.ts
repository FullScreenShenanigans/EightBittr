import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("sets the theme", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    const sound: HTMLAudioElement = AudioPlayer.playTheme(fakes.stubSoundName);

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.deep.equal(sound);
});

mochaLoader.it("sets the loop attribute to true", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.playTheme(fakes.stubSoundName);

    // Assert
    chai.expect(AudioPlayer.getTheme()!.loop).to.be.true;
});

mochaLoader.it("sets the loop attribute to false", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.playTheme(fakes.stubSoundName, false);

    // Assert
    chai.expect(AudioPlayer.getTheme()!.loop).to.be.false;
});

mochaLoader.it("uses default getter (of type string)", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr({
        directory: "Sounds",
        fileTypes: ["mp3"],
        library: {
            Sounds: [
                "Ringtone"
            ],
            Themes: [
                fakes.stubSoundName
            ]
        },
        getThemeDefault: fakes.stubSoundName,
        ItemsHolder: fakes.stubItemsHoldr()
    });

    // Act
    AudioPlayer.playTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.equal(fakes.stubSoundName);
});

mochaLoader.it("uses default getter (of type function)", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr({
        directory: "Sounds",
        fileTypes: ["mp3"],
        library: {
            Sounds: [
                "Ringtone"
            ],
            Themes: [
                fakes.stubSoundName
            ]
        },
        getThemeDefault: (): string => fakes.stubSoundName,
        ItemsHolder: fakes.stubItemsHoldr()
    });

    // Act
    AudioPlayer.playTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.equal(fakes.stubSoundName);
});
