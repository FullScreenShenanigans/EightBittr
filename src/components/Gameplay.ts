import { AudioPlayr } from "audioplayr";
import { dependency } from "babyioc";
import { ModAttachr } from "modattachr";

import { GameStartr } from "../GameStartr";

/**
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay {
    @dependency(AudioPlayr)
    private readonly audioPlayer: AudioPlayr;

    @dependency(ModAttachr)
    private readonly modAttacher: ModAttachr;

    /**
     * Unpauses the game by resuming music and firing a mod event.
     *
     * @returns A Promise for unpausing the game.
     */
    public async onPlay(): Promise<void> {
        await this.audioPlayer.resumeAll();
        this.modAttacher.fireEvent("onGamePlay");
    }

    /**
     * Pauses the game by stopping music and firing a mod event.
     *
     * @returns A Promise for pausing the game.
     */
    public async onPause(): Promise<void> {
        await this.audioPlayer.pauseAll();
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
