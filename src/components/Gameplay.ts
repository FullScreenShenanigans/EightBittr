import { Component } from "eightbittr/lib/Component";

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
     * Triggered Function for when the game is unpaused. Music resumes, and
     * the mod event is fired.
     */
    public onPlay(): void {
        this.gameStarter.audioPlayer.resumeAll();
        this.gameStarter.modAttacher.fireEvent("onGamePlay");
    }

    /**
     * Triggered Function for when the game is paused. Music stops, and the
     * mod event is fired.
     */
    public onPause(): void {
        this.gameStarter.audioPlayer.pauseAll();
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
