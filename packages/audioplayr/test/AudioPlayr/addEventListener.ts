/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />
/// <reference path="../utils/mocks.ts" />

mochaLoader.addTest("does not call the callback before the sound is played", (done): void => {
    // Arrange
    const AudioPlayer: AudioPlayr.IAudioPlayr = mocks.mockAudioPlayr();
    let num: number = 0;
    const increase: () => void = () => {
        num += 1;
    }

    // Act
    AudioPlayer.addEventListener(mocks.mockSoundName, "play", increase);
    const watcher: number = num;
    AudioPlayer.play(mocks.mockSoundName);

    // Assert
    setTimeout((): void => {
        chai.expect(watcher).to.equal(0);
        done();
    }, 1);
});