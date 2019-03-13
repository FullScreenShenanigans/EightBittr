import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Event hooks for major gameplay state changes.
 */
export class Gameplay<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * Unpauses the game by resuming music and firing a mod event.
     *
     * @returns A Promise for unpausing the game.
     */
    public async onPlay(): Promise<void> {
        await this.eightBitter.audioPlayer.resumeAll();
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGamePlay);
    }

    /**
     * Pauses the game by stopping music and firing a mod event.
     *
     * @returns A Promise for pausing the game.
     */
    public async onPause(): Promise<void> {
        await this.eightBitter.audioPlayer.pauseAll();
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGamePause);
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
