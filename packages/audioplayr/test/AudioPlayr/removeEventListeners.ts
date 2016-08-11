/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("throws an error if the sound doesn't exist", (): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();

    // Assert
    chai.expect(AudioPlayer.removeEventListeners.bind(AudioPlayer, "X")).to.throw("Unknown name given to removeEventListeners: 'X'.");
});