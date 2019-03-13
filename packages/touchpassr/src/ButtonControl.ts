import { Control } from "./Control";
import { IControlSchema, IPipes, IRootControlStyles } from "./ITouchPassr";

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
        const onActivated: any = this.onEvent.bind(this, "activated");
        const onDeactivated: any = this.onEvent.bind(this, "deactivated");

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
    private onEvent(which: keyof IPipes, event: Event): void {
        if (this.schema.pipes === undefined) {
            return;
        }

        const events = this.schema.pipes[which];

        if (!events) {
            return;
        }

        for (const i in events) {
            if (!events.hasOwnProperty(i)) {
                continue;
            }

            for (const triggerEvent of events[i]) {
                this.inputWriter.callEvent(i, triggerEvent, event);
            }
        }
    }
}
