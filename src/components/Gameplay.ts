import { IAudioPlayr } from "audioplayr/lib/iaudioplayr";
import { IModAttachr } from "modattachr/lib/imodattachr";

/**
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay {
    /**
     * Audio playback manager for persistent and on-demand themes and sounds.
     */
    private readonly audioPlayer: IAudioPlayr;

    /**
     * Hookups for extensible triggered mod events.
     */
    private readonly modAttacher: IModAttachr;

    /**
     * Initializes a new instance of the Gameplay class.
     * 
     * @param audioPlayer   Audio playback manager for persistent and on-demand themes and sounds.
     * @param modAttacher   Hookups for extensible triggered mod events.
     */
    public constructor(audioPlayer: IAudioPlayr, modAttacher: IModAttachr) {
        this.audioPlayer = audioPlayer;
        this.modAttacher = modAttacher;
    }

    /**
     * Triggered Function for when the game closes. The mod event is fired.
     */
    public onClose(): void {
        this.modAttacher.fireEvent("onGameClose");
    }

    /**
     * Triggered Function for when the game is unpaused. Music resumes, and
     * the mod event is fired.
     */
    public onPlay(): void {
        this.audioPlayer.resumeAll();
        this.modAttacher.fireEvent("onGamePlay");
    }

    /**
     * Triggered Function for when the game is paused. Music stops, and the
     * mod event is fired.
     */
    public onPause(): void {
        this.audioPlayer.pauseAll();
        this.modAttacher.fireEvent("onGamePause");
    }

    /**
     * Checks whether inputs can be fired, which by default is always true.
     * 
     * @returns Whether inputs can be fired, which is always true.
     */
    public canInputsTrigger(): boolean {
        return true;
    }

    /**
     * Generic Function to start the game. Nothing actually happens here.
     */
    public gameStart(): void {
        this.modAttacher.fireEvent("onGameStart");
    }
}
