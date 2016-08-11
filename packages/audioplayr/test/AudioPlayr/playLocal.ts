/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("sets the volume to 0 if sounds are muted", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    AudioPlayer.setMutedOn();
    const sound: HTMLAudioElement = AudioPlayer.playLocal(mocks.mockSoundName);

    // Assert
    chai.expect(sound.volume).to.equal(0);
});

mochaLoader.addTest("sets the volume to a default of 1 if sounds are not muted", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Act
    const sound: HTMLAudioElement = AudioPlayer.playLocal(mocks.mockSoundName);

    // Assert
    chai.expect(sound.volume).to.equal(1);
});