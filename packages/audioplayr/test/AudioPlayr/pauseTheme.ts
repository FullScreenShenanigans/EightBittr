import { mochaLoader } from "../main";

mochaLoader.it("pauses the theme (commented out)", (done): void => {
    // paused is undefined in this version of PhantomJS

    /*// Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    AudioPlayer.playTheme(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.pauseTheme();

        // Assert
        chai.expect(AudioPlayer.getTheme().paused).to.be.true;
        done();
    });*/

    // remove this once the PhantomJS issue is resolved
    done();
});

mochaLoader.it("doesn't pause a sound that isn't the theme (commented out)", (done): void => {
    // paused is undefined in this version of PhantomJS

    /*// Arrange
    const AudioPlayer: IAudioPlayr = fakes.stubAudioPlayr(fakes.stubAudioPlayrSettings())

    // Act
    const sound: HTMLAudioElement = AudioPlayer.play(fakes.stubSoundName);
    fakes.delayForAudioRaceCondition((): void => {
        AudioPlayer.pauseTheme();

        // Assert
        chai.expect(sound.paused).to.be.false;
        done();
    });*/

    // remove this once the PhantomJS issue is resolved
    done();
});
