import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("does not call the callback before the sound is played", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());
    let num: number = 0;
    const increase: () => void = () => {
        num += 1;
    };

    // Act
    AudioPlayer.addEventListener(fakes.stubSoundName, "play", increase);
    const watcher: number = num;
    AudioPlayer.play(fakes.stubSoundName);

    // Assert
    fakes.delayForAudioRaceCondition((): void => {
        chai.expect(watcher).to.equal(0);
        done();
    });
});
