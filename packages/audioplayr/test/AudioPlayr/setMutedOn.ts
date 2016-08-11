/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("mutes if the sound is playing", (done): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(mocks.mockSoundName);
    setTimeout((): void => {
        AudioPlayer.setMutedOn();

        // Assert
        chai.expect(sound.volume).to.equal(0);
        done();
    }, 1);
});

mochaLoader.addTest("mutes if the sound is paused", (done): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(mocks.mockSoundName);
    setTimeout((): void => {
        AudioPlayer.pauseTheme();
        AudioPlayer.setMutedOn();

        // Assert
        chai.expect(sound.volume).to.equal(0);
        done();
    }, 1);
});