/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("unmutes if the sound is playing", (done): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(mocks.mockSoundName);
    setTimeout((): void => {
        AudioPlayer.setMutedOff();

        // Assert
        chai.expect(sound.volume).to.equal(1);
        done();
    }, 1);
});

mochaLoader.addTest("unmutes if the sound is paused", (done): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(mocks.mockSoundName);
    setTimeout((): void => {
        AudioPlayer.pauseTheme();
        AudioPlayer.setMutedOff();

        // Assert
        chai.expect(sound.volume).to.equal(1);
        done();
    }, 1);
});