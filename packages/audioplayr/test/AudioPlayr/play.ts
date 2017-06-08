import { IAudioPlayr } from "../../src/IAudioPlayr";
import { mochaLoader } from "../main";
import * as fakes from "../utils/fakes";

mochaLoader.it("plays the sound if sounds are muted (commented out)", (done): void => {
    // paused is undefined in this version of PhantomJS

    /*// Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())
    const sound: HTMLAudioElement;

    // Act
    AudioPlayer.setMutedOn();
    sound = AudioPlayer.play(fakes.stubSoundName);

    // Assert
    fakes.delayForAudioRaceCondition((): void => {
        chai.expect(sound.paused).to.be.false;
        done();
    });*/

    // remove this once the PhantomJS issue is resolved
    done();
});

mochaLoader.it("plays the sound if sounds are not muted (commented out)", (done): void => {
    // paused is undefined in this version of PhantomJS

    /*// Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())
    const sound: HTMLAudioElement;

    // Act
    sound = AudioPlayer.play(fakes.stubSoundName);

    // Assert
    fakes.delayForAudioRaceCondition((): void => {
        chai.expect(sound.paused).to.be.false;
        done();
    });*/

    // remove this once the PhantomJS issue is resolved
    done();
});

mochaLoader.it("throws an error if the sound doesn't exist", (): void => {
    // Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings());

    // Assert
    chai.expect(AudioPlayer.play.bind(AudioPlayer, "X")).to.throw("Unknown name given to AudioPlayr.play: 'X'.");
});
