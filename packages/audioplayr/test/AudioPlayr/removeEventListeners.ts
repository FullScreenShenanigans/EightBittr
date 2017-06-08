import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("throws an error if the sound doesn't exist", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Assert
    chai.expect(AudioPlayer.removeEventListeners.bind(AudioPlayer, "X")).to.throw("Unknown name given to removeEventListeners: 'X'.");
});
