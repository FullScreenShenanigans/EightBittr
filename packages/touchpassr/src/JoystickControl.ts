import { Control } from "./Control";
import { IControlSchema, IControlStyles, IPipes, IRootControlStyles } from "./ITouchPassr";

/**
 * Control schema for a joystick. It may have any number of directions that it
 * will snap to, each of which will have its own pipes.
 */
export interface IJoystickSchema extends IControlSchema {
    /**
     * Direction ticks to display on the control.
     */
    directions: IJoystickDirection[];
}

/**
 * Schema for a single direction for a joystick. It will be represented as a tick
 * on the joystick that the control will snap its direction to.
 */
export interface IJoystickDirection {
    /**
     * The unique name of this direction, such as "Up".
     */
    name: string;

    /**
     * What degree measurement to place the tick at.
     */
    degrees: number;

    /**
     * Pipe descriptions for what should be sent to the InputWritr.
     */
    pipes?: IPipes;
}

/**
 * Styles schema for a joystick control, adding its ticks and indicator elements.
 */
export interface IJoystickStyles extends IControlStyles {
    /**
     * Styles for the round circle elements.
     */
    circle?: IControlStyles;

    /**
     * Styles for the individual "tick" elements.
     */
    tick?: IControlStyles;

    /**
     * Styles for the dragging line element.
     */
    dragLine?: IControlStyles;

    /**
     * Styles for the outer shadow element.
     */
    dragShadow?: IControlStyles;
}

/**
 * Joystick control. An inner circle can be dragged to one of a number
 * of directions to trigger pipes on and off.
 */
export class JoystickControl extends Control<IJoystickSchema> {
    /**
     * The large inner circle that visually surrounds the ticks and other
     * inner elements.
     */
    protected elementCircle: HTMLDivElement;

    /**
     * The normally hidden tick to display a snapped direction.
     */
    protected elementDragLine: HTMLDivElement;

    /**
     * The normally hidden circle that emulates the outer part of a joystick.
     */
    protected elementDragShadow: HTMLDivElement;

    /**
     * Whether dragging is currently enabled, generally by the user starting
     * an interation event with touch or a mouse.
     */
    protected dragEnabled: boolean;

    /**
     * The currently snaped direction, if dragEnabled is true.
     */
    protected currentDirection: IJoystickDirection;

    /**
     * Resets the element by creating a tick for each direction, along with
     * the multiple circular elements with their triggers.
     * 
     * @param styles   Container styles for the contained elements.
     */
    protected resetElement(styles: IRootControlStyles): void {
        super.resetElement(styles, "Joystick");

        const directions: IJoystickDirection[] = (this.schema as IJoystickSchema).directions;
            // element: HTMLDivElement,
            // degrees: number,
            // sin: number,
            // cos: number,
            // dx: number,
            // dy: number,
            // i: number;

        this.proliferateElement(this.elementInner, {
            "style": {
                "border-radius": "100%"
            }
        });

        // The visible circle is what is actually visible to the user
        this.elementCircle = this.createElement("div", {
            "className": "control-inner control-joystick-circle",
            "style": {
                "position": "absolute",
                "background": "red",
                "borderRadius": "100%"
            }
        }) as HTMLDivElement;
        this.proliferateElement(this.elementCircle, (styles as any).Joystick.circle);

        // Each direction creates a "tick" element, like on a clock
        for (let i: number = 0; i < directions.length; i += 1) {
            const degrees: number = directions[i].degrees;

            // sin and cos are an amount / 1 the tick is offset from the center
            const sin: number = Math.sin(degrees * Math.PI / 180);
            const cos: number = Math.cos(degrees * Math.PI / 180);

            // dx and dy are measured as percent from the center, based on sin & cos
            let dx: number = cos * 50 + 50;
            let dy: number = sin * 50 + 50;

            const element: HTMLDivElement = this.createElement("div", {
                "className": "control-joystick-tick",
                "style": {
                    "position": "absolute",
                    "left": dx + "%",
                    "top": dy + "%",
                    "marginLeft": (-cos * 5 - 5) + "px",
                    "marginTop": (-sin * 2 - 1) + "px"
                }
            }) as HTMLDivElement;

            this.proliferateElement(element, (styles as any).Joystick.tick);
            this.setRotation(element, degrees);

            this.elementCircle.appendChild(element);
        }

        // In addition to the ticks, a drag element shows current direction
        this.elementDragLine = this.createElement("div", {
            "className": "control-joystick-drag-line",
            "style": {
                "position": "absolute",
                "opacity": "0",
                "top": ".77cm",
                "left": ".77cm"
            }
        }) as HTMLDivElement;
        this.proliferateElement(this.elementDragLine, (styles as any).Joystick.dragLine);
        this.elementCircle.appendChild(this.elementDragLine);

        // A shadow-like circle supports the drag effect
        this.elementDragShadow = this.createElement("div", {
            "className": "control-joystick-drag-shadow",
            "style": {
                "position": "absolute",
                "opacity": "1",
                "top": "14%",
                "right": "14%",
                "bottom": "14%",
                "left": "14%",
                "marginLeft": "0",
                "marginTop": "0",
                "borderRadius": "100%"
            }
        }) as HTMLDivElement;
        this.proliferateElement(this.elementDragShadow, (styles as any).Joystick.dragShadow);
        this.elementCircle.appendChild(this.elementDragShadow);

        this.elementInner.appendChild(this.elementCircle);

        this.elementInner.addEventListener("click", this.triggerDragger.bind(this));
        this.elementInner.addEventListener("touchmove", this.triggerDragger.bind(this));
        this.elementInner.addEventListener("mousemove", this.triggerDragger.bind(this));

        this.elementInner.addEventListener("mouseover", this.positionDraggerEnable.bind(this));
        this.elementInner.addEventListener("touchstart", this.positionDraggerEnable.bind(this));

        this.elementInner.addEventListener("mouseout", this.positionDraggerDisable.bind(this));
        this.elementInner.addEventListener("touchend", this.positionDraggerDisable.bind(this));
    }

    /**
     * Enables dragging, showing the elementDragLine.
     */
    protected positionDraggerEnable(): void {
        this.dragEnabled = true;
        this.elementDragLine.style.opacity = "1";
    }

    /**
     * Disables dragging, hiding the drag line and re-centering the 
     * inner circle shadow.
     */
    protected positionDraggerDisable(): void {
        this.dragEnabled = false;
        this.elementDragLine.style.opacity = "0";

        this.elementDragShadow.style.top = "14%";
        this.elementDragShadow.style.right = "14%";
        this.elementDragShadow.style.bottom = "14%";
        this.elementDragShadow.style.left = "14%";

        if (this.currentDirection) {
            if (this.currentDirection.pipes && this.currentDirection.pipes.deactivated) {
                this.onEvent(this.currentDirection.pipes.deactivated, event);
            }

            this.currentDirection = undefined;
        }
    }

    /**
     * Triggers a movement point for the joystick, and snaps the stick to
     * the nearest direction (based on the angle from the center to the point).
     * 
     * @param event   A user-triggered event.
     */
    protected triggerDragger(event: DragEvent | MouseEvent): void {
        event.preventDefault();

        if (!this.dragEnabled) {
            return;
        }

        const coordinates: number[] = this.getEventCoordinates(event);
        const x: number = coordinates[0];
        const y: number = coordinates[1];
        const offsets: number[] = this.getOffsets(this.elementInner);
        const midX: number = offsets[0] + this.elementInner.offsetWidth / 2;
        const midY: number = offsets[1] + this.elementInner.offsetHeight / 2;
        const dxRaw: number = (x - midX) | 0;
        const dyRaw: number = (midY - y) | 0;
        const thetaRaw: number = this.getThetaRaw(dxRaw, dyRaw);
        const directionNumber: number = this.findClosestDirection(thetaRaw);
        const direction: IJoystickDirection = (this.schema as IJoystickSchema).directions[directionNumber];
        const theta: number = (direction.degrees + 450) % 360;
        const components: number[] = this.getThetaComponents(theta);
        const dx: number = components[0];
        const dy: number = -components[1];

        this.elementDragLine.style.marginLeft = ((dx * 77) | 0) + "%";
        this.elementDragLine.style.marginTop = ((dy * 77) | 0) + "%";

        this.elementDragShadow.style.top = ((14 + dy * 10) | 0) + "%";
        this.elementDragShadow.style.right = ((14 - dx * 10) | 0) + "%";
        this.elementDragShadow.style.bottom = ((14 - dy * 10) | 0) + "%";
        this.elementDragShadow.style.left = ((14 + dx * 10) | 0) + "%";

        this.setRotation(this.elementDragLine, theta);
        this.positionDraggerEnable();

        this.setCurrentDirection(direction, event);
    }

    /**
     * Finds the raw coordinates of an event, whether it's a drag (touch)
     * or mouse event.
     * 
     * @returns The x- and y- coordinates of the event.
     */
    protected getEventCoordinates(event: DragEvent | MouseEvent): number[] {
        if (event.type === "touchmove") {
            // TypeScript doesn't seem to have TouchEvent yet.
            const touch: any = (event as any).touches[0];
            return [touch.pageX, touch.pageY];
        }

        return [(event as MouseEvent).x, (event as MouseEvent).y];
    }

    /**
     * Finds the angle from a joystick center to an x and y. This assumes 
     * straight up is 0, to the right is 90, down is 180, and left is 270.
     * 
     * @returns The degrees to the given point.
     */
    protected getThetaRaw(dxRaw: number, dyRaw: number): number {
        // Based on the quadrant, theta changes...
        if (dxRaw > 0) {
            if (dyRaw > 0) {
                // Quadrant I
                return Math.atan(dxRaw / dyRaw) * 180 / Math.PI;
            } else {
                // Quadrant II
                return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 90;
            }
        } else {
            if (dyRaw < 0) {
                // Quadrant III
                return Math.atan(dxRaw / dyRaw) * 180 / Math.PI + 180;
            } else {
                // Quadrant IV
                return -Math.atan(dyRaw / dxRaw) * 180 / Math.PI + 270;
            }
        }
    }

    /**
     * Converts an angle to its relative dx and dy coordinates.
     * 
     * @param thetaRaw   The raw degrees of an anle.
     * @returns The x- and y- parts of an angle.
     */
    protected getThetaComponents(thetaRaw: number): [number, number] {
        const theta: number = thetaRaw * Math.PI / 180;
        return [Math.sin(theta), Math.cos(theta)];
    }

    /**
     * Finds the index of the closest direction to an angle. 
     * 
     * @param degrees   The degrees of an angle.
     * @returns The index of the closest known direction to the degrees.a
     */
    protected findClosestDirection(degrees: number): number {
        const directions: IJoystickDirection[] = (this.schema as IJoystickSchema).directions;
        let smallestDegrees: number = directions[0].degrees;
        let smallestDegreesRecord: number = 0;
        let difference: number = Math.abs(directions[0].degrees - degrees);
        let record: number = 0;
        let differenceTest: number;

        // Find the direction with the smallest difference in degrees
        for (let i: number = 1; i < directions.length; i += 1) {
            differenceTest = Math.abs(directions[i].degrees - degrees);

            if (differenceTest < difference) {
                difference = differenceTest;
                record = i;
            }
            if (directions[i].degrees < smallestDegrees) {
                smallestDegrees = directions[i].degrees;
                smallestDegreesRecord = i;
            }
        }

        // 359 is closer to 360 than 0, so pretend the smallest is above 360
        differenceTest = Math.abs(smallestDegrees + 360 - degrees);
        if (differenceTest < difference) {
            difference = differenceTest;
            record = smallestDegreesRecord;
        }

        return record;
    }

    /**
     * Sets the current direction of the joystick, calling the relevant 
     * InputWriter pipes if necessary.
     * 
     * @param direction   A new direction to face.
     * @param event   A user-triggered event.
     */
    protected setCurrentDirection(direction: IJoystickDirection, event?: Event): void {
        if (this.currentDirection === direction) {
            return;
        }

        if (this.currentDirection && this.currentDirection.pipes && this.currentDirection.pipes.deactivated) {
            this.onEvent(this.currentDirection.pipes.deactivated, event);
        }

        if (direction.pipes && direction.pipes.activated) {
            this.onEvent(direction.pipes.activated, event);
        }

        this.currentDirection = direction;
    }

    /**
     * Trigger for calling pipes when a new direction is set. All children
     * of the pipe has each of its keys triggered.
     * 
     * @param pipes   Pipes to trigger.
     * @param event   A user-triggered event.
     */
    protected onEvent(pipes: IPipes, event?: Event): void {
        for (const i in pipes) {
            if (!pipes.hasOwnProperty(i)) {
                continue;
            }

            for (let j: number = 0; j < (pipes as any)[i].length; j += 1) {
                this.InputWriter.callEvent(i, (pipes as any)[i][j], event);
            }
        }
    }
}
