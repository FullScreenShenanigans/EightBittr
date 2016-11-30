import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("sets the volume to 0 if sounds are muted", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.setMutedOn();
    const sound: HTMLAudioElement = AudioPlayer.playLocal(fakes.stubSoundName);

    // Assert
    chai.expect(sound.volume).to.equal(0);
});

mochaLoader.it("sets the volume to a default of 1 if sounds are not muted", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    const sound: HTMLAudioElement = AudioPlayer.playLocal(fakes.stubSoundName);

    // Assert
    chai.expect(sound.volume).to.equal(1);
});
