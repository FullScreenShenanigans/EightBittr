import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("calls the function immediately if the sound doesn't exist", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())
    let num: number = 0;
    const increase: () => void = () => {
        num += 1;
    };

    // Act
    AudioPlayer.addEventImmediate("X", "loadeddata", increase);

    // Assert
    chai.expect(num).to.equal(1);
});

mochaLoader.it("doesn't call the function if the sound is not paused and exists", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())
    let num: number = 0;
    const increase: () => void = () => {
        num += 1;
    };

    // Act
    AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.addEventImmediate(fakes.stubSoundName, "loadeddata", increase);

        // Assert
        chai.expect(num).to.equal(0);
        done();
    });
});

mochaLoader.it("calls the function if the sound is neither paused nor playing", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())
    let num: number = 0;
    const increase: () => void = () => {
        num += 1;
    };

    // Act
    AudioPlayer.addEventImmediate(fakes.stubSoundName, "loadeddata", increase);

    // Assert
    chai.expect(num).to.equal(1);
});