import { EightBittr } from "../EightBittr";

/**
 * EightBittr component with full access to game state.
 */
export abstract class Section<TEightBittr extends EightBittr> {
    /**
     * EightBittr instance this is used for.
     */
    protected readonly game: TEightBittr;

    /**
     * Initializes a new instance of the Section class.
     *
     * @param source   EightBittr instance to wrap around, or one of its components.
     */
    public constructor(source: TEightBittr | Section<TEightBittr>) {
        this.game = source instanceof Section ? source.game : source;
    }
}
