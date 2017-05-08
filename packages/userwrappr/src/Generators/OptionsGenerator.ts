import { IOptionsGenerator, IUserWrappr } from "../IUserWrappr";
import { ISchema } from "../UISchemas";

/**
 * Base class for options generators. These all store a UserWrapper and
 * its GameStartr, along with a generate Function 
 */
export abstract class OptionsGenerator implements IOptionsGenerator {
    /**
     * The container UserWrappr using this generator.
     */
    protected userWrapper: IUserWrappr;

    /**
     * Initializes a new instance of the OptionsGenerator class.
     * 
     * @param userWrappr   The container UserWrappr using this generator.
     */
    public constructor(userWrapper: IUserWrappr) {
        this.userWrapper = userWrapper;
    }

    /**
     * Generates a control element based on the provided schema.
     *
     * @param schema   A description of an element to create.
     * @returns An HTML element representing the schema.
     */
    public abstract generate(schema: ISchema): HTMLDivElement;

    /**
     * Recursively searches for an element with the "control" class
     * that's a parent of the given element.
     * 
     * @param element   An element to start searching on.
     * @returns The closest node with className "control" to the given element
     *          in its ancestry tree.
     */
    protected getParentControlElement(element: HTMLElement): HTMLElement {
        if (element.className === "control" || !element.parentNode) {
            return element;
        }

        return this.getParentControlElement(element.parentElement!);
    }
}
