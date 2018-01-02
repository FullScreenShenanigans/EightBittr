import { Component } from "eightbittr";

import { GameStartr } from "../GameStartr";

/**
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay<TGameStartr extends GameStartr> extends Component<TGameStartr> {
    /**
     * Triggered Function for when the game closes. The mod event is fired.
     */
    public onClose(): void {
        this.gameStarter.modAttacher.fireEvent("onGameClose");
    }

    /**
     * Unpauses the game by resuming music and firing a mod event.
     *
     * @returns A Promise for unpausing the game.
     */
    public async onPlay(): Promise<void> {
        await this.gameStarter.audioPlayer.resumeAll();
        this.gameStarter.modAttacher.fireEvent("onGamePlay");
    }

    /**
     * Pauses the game by stopping music and firing a mod event.
     *
     * @returns A Promise for pausing the game.
     */
    public async onPause(): Promise<void> {
        await this.gameStarter.audioPlayer.pauseAll();
        this.gameStarter.modAttacher.fireEvent("onGamePause");
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
        this.gameStarter.modAttacher.fireEvent("onGameStart");
    }
}
