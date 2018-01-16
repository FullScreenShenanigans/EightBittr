import { GameStartr } from "../GameStartr";
import { GeneralComponent } from "./GeneralComponent";

/**
 * Event hooks for major gameplay state changes.
 */
export class Gameplay<TGameStartr extends GameStartr> extends GeneralComponent<TGameStartr> {
    /**
     * Unpauses the game by resuming music and firing a mod event.
     *
     * @returns A Promise for unpausing the game.
     */
    public async onPlay(): Promise<void> {
        await this.gameStarter.audioPlayer.resumeAll();
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onGamePlay);
    }

    /**
     * Pauses the game by stopping music and firing a mod event.
     *
     * @returns A Promise for pausing the game.
     */
    public async onPause(): Promise<void> {
        await this.gameStarter.audioPlayer.pauseAll();
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onGamePause);
    }

    /**
     * Checks whether inputs can be fired, which by default is always true.
     *
     * @returns Whether inputs can be fired, which is always true.
     */
    public canInputsTrigger(): boolean {
        return true;
    }
}
