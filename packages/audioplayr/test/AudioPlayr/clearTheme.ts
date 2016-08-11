/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("sets the theme to undefined", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.playTheme(mocks.mockSoundName);
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.be.undefined;
});

mochaLoader.addTest("sets the themeName to undefined", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.playTheme(mocks.mockSoundName);
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.be.undefined;
});

mochaLoader.addTest("leaves the theme unchanged if no theme was set", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.be.undefined;
});

mochaLoader.addTest("leaves the themeName unchanged if no theme was set", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.clearTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.be.undefined;
});
