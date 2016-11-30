import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("sets the theme to undefined", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.playTheme(fakes.stubSoundName);
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.be.undefined;
});

mochaLoader.it("sets the themeName to undefined", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.playTheme(fakes.stubSoundName);
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.be.undefined;
});

mochaLoader.it("leaves the theme unchanged if no theme was set", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.be.undefined;
});

mochaLoader.it("leaves the themeName unchanged if no theme was set", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.be.undefined;
});
