import { GameStartr } from "../GameStartr";

/**
 * GameStartr component with full access to game state.
 */
export abstract class GeneralComponent<TGameStartr extends GameStartr> {
    /**
     * GameStartr instance this is used for.
     */
    protected readonly gameStarter: TGameStartr;

    /**
     * Initializes a new instance of the GeneralComponent class.
     *
     * @param source   FSP instance to wrap around, or one of its components.
     */
    public constructor(source: TGameStartr | GeneralComponent<TGameStartr>) {
        this.gameStarter = source instanceof GeneralComponent
            ? source.gameStarter
            : source;
    }
}
