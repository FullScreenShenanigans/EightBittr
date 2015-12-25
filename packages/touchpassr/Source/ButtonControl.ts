module TouchPassr {
    "use strict";

    /**
     * Control schema for a simple button. Pipes are activated on press and on release.
     */
    export interface IButtonSchema extends IControlSchema {
        /**
         * Pipe descriptions for what should be sent to the InputWritr.
         */
        pipes?: IPipes;
    }

    /**
     * Styles schema for a button control.
     */
    export interface IButtonStyles extends IControlStyles { }

    /**
     * Global declaration of styles for all controls, typically passed from a
     * TouchPassr to its generated controls.
     */
    export interface IRootControlStyles {
        /**
         * Styles that apply to Button controls.
         */
        Button?: IButtonStyles;
    }

    /**
     * Simple button control. It activates its triggers when the user presses
     * it or releases it, and contains a simple label.
     */
    export class ButtonControl extends Control<IButtonSchema> {
        /**
         * Resets the elements by adding listeners for mouse and touch 
         * activation and deactivation events.
         * 
         * @param styles   Container styles for the contained elements.
         */
        protected resetElement(styles: IRootControlStyles): void {
            var onActivated: any = this.onEvent.bind(this, "activated"),
                onDeactivated: any = this.onEvent.bind(this, "deactivated");

            super.resetElement(styles, "Button");

            this.element.addEventListener("mousedown", onActivated);
            this.element.addEventListener("touchstart", onActivated);

            this.element.addEventListener("mouseup", onDeactivated);
            this.element.addEventListener("touchend", onDeactivated);
        }

        /**
         * Reaction callback for a triggered event.
         * 
         * @param which   The pipe being activated, such as "activated"
         *                or "deactivated".
         * @param event   The triggered event.
         */
        protected onEvent(which: string, event: Event): void {
            var events: any = (<IButtonSchema>this.schema).pipes[which],
                i: string,
                j: number;

            if (!events) {
                return;
            }

            for (i in events) {
                if (!events.hasOwnProperty(i)) {
                    continue;
                }

                for (j = 0; j < events[i].length; j += 1) {
                    this.InputWriter.callEvent(i, events[i][j], event);
                }
            }
        }
    }
}
