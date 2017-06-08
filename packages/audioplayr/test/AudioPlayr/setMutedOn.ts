import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("mutes if the sound is playing", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.setMutedOn();

        // Assert
        chai.expect(sound.volume).to.equal(0);
        done();
    });
});

mochaLoader.it("mutes if the sound is paused", (done): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.pauseTheme();
        AudioPlayer.setMutedOn();

        // Assert
        chai.expect(sound.volume).to.equal(0);
        done();
    });
});
