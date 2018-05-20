import { EightBittr } from "../EightBittr";

/**
 * EightBittr component with full access to game state.
 */
export abstract class GeneralComponent<TEightBittr extends EightBittr> {
    /**
     * EightBittr instance this is used for.
     */
    protected readonly eightBitter: TEightBittr;

    /**
     * Initializes a new instance of the GeneralComponent class.
     *
     * @param source   FSP instance to wrap around, or one of its components.
     */
    public constructor(source: TEightBittr | GeneralComponent<TEightBittr>) {
        this.eightBitter = source instanceof GeneralComponent
            ? source.eightBitter
            : source;
    }
}
