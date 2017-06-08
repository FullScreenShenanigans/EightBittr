import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("unmutes if the sound is playing", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.setMutedOff();

        // Assert
        chai.expect(sound.volume).to.equal(1);
        done();
    });
});

mochaLoader.it("unmutes if the sound is paused", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.pauseTheme();
        AudioPlayer.setMutedOff();

        // Assert
        chai.expect(sound.volume).to.equal(1);
        done();
    });
});
