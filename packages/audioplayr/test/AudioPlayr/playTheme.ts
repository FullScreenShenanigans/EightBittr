/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("sets the theme", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.playTheme(mocks.mockSoundName);

    // Assert
    chai.expect(AudioPlayer.getTheme()).to.deep.equal(sound);
});

mochaLoader.addTest("sets the loop attribute to true", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.playTheme(mocks.mockSoundName);

    // Assert
    chai.expect(AudioPlayer.getTheme().loop).to.be.true;
});

mochaLoader.addTest("sets the loop attribute to false", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.playTheme(mocks.mockSoundName, false);

    // Assert
    chai.expect(AudioPlayer.getTheme().loop).to.be.false;
});

mochaLoader.addTest("uses default getter (of type string)", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr({
        directory: "Sounds",
        fileTypes: ["mp3"],
        library: {
            Sounds: [
                "Ringtone"
            ],
            Themes: [
                mocks.mockSoundName
            ]
        },
        getThemeDefault: mocks.mockSoundName,
        ItemsHolder: mocks.mockItemsHoldr()
    });

    // Act
    AudioPlayer.playTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.equal(mocks.mockSoundName);
});

mochaLoader.addTest("uses default getter (of type function)", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr({
        directory: "Sounds",
        fileTypes: ["mp3"],
        library: {
            Sounds: [
                "Ringtone"
            ],
            Themes: [
                mocks.mockSoundName
            ]
        },
        getThemeDefault: (): string => mocks.mockSoundName,
        ItemsHolder: mocks.mockItemsHoldr()
    });

    // Act
    AudioPlayer.playTheme();

    // Assert
    chai.expect(AudioPlayer.getThemeName()).to.equal(mocks.mockSoundName);
});