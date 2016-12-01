import { Component } from "eightbittr/lib/Component";

import { GameStartr } from "./GameStartr";

/**
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay<TIEightBittr extends GameStartr> extends Component<TIEightBittr> {
    /**
     * Triggered Function for when the game closes. The mod event is fired.
     */
    public onClose(): void {
        this.EightBitter.ModAttacher.fireEvent("onGameClose");
    }

    /**
     * Triggered Function for when the game is unpaused. Music resumes, and
     * the mod event is fired.
     */
    public onPlay(): void {
        this.EightBitter.AudioPlayer.resumeAll();
        this.EightBitter.ModAttacher.fireEvent("onGamePlay");
    }

    /**
     * Triggered Function for when the game is paused. Music stops, and the
     * mod event is fired.
     */
    public onPause(): void {
        this.EightBitter.AudioPlayer.pauseAll();
        this.EightBitter.ModAttacher.fireEvent("onGamePause");
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
        this.EightBitter.ModAttacher.fireEvent("onGameStart");
    }
}
