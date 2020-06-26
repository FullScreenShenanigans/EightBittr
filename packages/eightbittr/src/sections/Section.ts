import { EightBittr } from "../EightBittr";

/**
 * EightBittr component with full access to game state.
 */
export abstract class Section<TEightBittr extends EightBittr> {
    /**
     * EightBittr instance this is used for.
     */
    protected readonly eightBitter: TEightBittr;

    /**
     * Initializes a new instance of the Section class.
     *
     * @param source   EightBittr instance to wrap around, or one of its components.
     */
    public constructor(source: TEightBittr | Section<TEightBittr>) {
        this.eightBitter = source instanceof Section ? source.eightBitter : source;
    }
}
