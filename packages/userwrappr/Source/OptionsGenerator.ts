module UserWrappr.UISchemas {
    "use strict";

    /**
     * Handler for a map being selected.
     * 
     * @param GameStarter   The GameStarter whose level is being edited.
     * @param schema   The overall description of the editor control.
     * @param button   The button that was just clicked.
     * @param event   The event associated with the user clicking the button.
     */
    export interface IMapSelectionCallback {
        (GameStarter: IGameStartr, schema: IOptionsMapGridSchema, button: HTMLElement, event: Event): void;
    }

    /**
     * Base class for options generators. These all store a UserWrapper and
     * its GameStartr, along with a generate Function 
     */
    export abstract class OptionsGenerator implements IOptionsGenerator {
        /**
         * The container UserWrappr using this generator.
         */
        protected UserWrapper: UserWrappr.UserWrappr;

        /**
         * The container UserWrappr's GameStartr instance.
         */
        protected GameStarter: IGameStartr;

        /**
         * Initializes a new instance of the OptionsGenerator class.
         * 
         * @param UserWrappr   The container UserWrappr using this generator.
         */
        constructor(UserWrapper: UserWrappr.UserWrappr) {
            this.UserWrapper = UserWrapper;
            this.GameStarter = this.UserWrapper.getGameStarter();
        }

        /**
         * Generates a control element based on the provided schema.
         *
         * @param schema   A description of an element to create.
         * @returns An HTML element representing the schema.
         */
        abstract generate(schema: ISchema): HTMLDivElement;

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

            return this.getParentControlElement(element.parentElement);
        }
    }
}
