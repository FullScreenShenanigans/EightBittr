import { InputWritr } from "inputwritr";

import { Control } from "./Control";
import { JoystickStyles } from "./JoystickControl";

/**
 * Schema for where a control should lay on the screen.
 */
export interface Position {
    /**
     * Vertical position, as "top", "bottom", or "center".
     */
    vertical: string;

    /**
     * Horizontal position, as "top", "right", "center".
     */
    horizontal: string;

    /**
     * Offset measurements to shift from the vertical and horizontal position.
     */
    offset?: PositionOffset;
}

/**
 * Offset measurements for a schema's position.
 */
export interface PositionOffset {
    /**
     * How much to shift horizontally, as a number or CSS-ready String measurement.
     */
    left?: number | string;

    /**
     * How much to shift vertically, as a number or CSS-ready String measurement.
     */
    top?: number | string;
}

/**
 * Global declaration of styles for all controls, typically passed from
 * TouchPassr to its generated controls.
 */
export interface RootControlStyles {
    Joystick: JoystickStyles;
    [i: string]: ControlStyles;
}

/**
 * Container for control classes, keyed by name.
 */
export type ControlClassesContainer = Record<string, typeof Control<any>>;

/**
 * Container for controls, keyed by name.
 */
export type ControlsContainer = Record<string, Control<ControlSchema>>;

/**
 * Container for control schemas, keyed by name.
 */
export type ControlSchemasContainer = Record<string, ControlSchema>;

/**
 * General container for element styles of a control. It should be extended
 * for more specific controls.
 */
export interface ControlStyles {
    /**
     * Styles to apply to the primary (outer) control element.
     */
    element?: CSSRuleList;

    /**
     * Styles to apply to the inner control element.
     */
    elementInner?: CSSRuleList;
}

/**
 * Root schema to be followed for all controls. More specific schema versions
 * will extend this.
 */
export interface ControlSchema {
    /**
     * What name this will be keyed under in the parent ITouchPassr.
     */
    name: string;

    /**
     * The type of control this should create, such as "Button".
     */
    control: string;

    /**
     * Where the generated code should be on the screen.
     */
    position: Position;

    /**
     * A label to display in the control.
     */
    label?: string;

    /**
     * Additional styles to pass to the control.
     */
    styles?: ControlStyles;
}

/**
 * Schema for how a control should interact with its InputWriter. Each member key
 * is the control action, which is linked to any number of InputWriter events, each
 * of which contains any number of key codes to send.
 */
export interface Pipes {
    /**
     * Event triggers to pass when a control is activated.
     */
    activated?: Record<string, (string | number)[]>;

    /**
     * Event triggers to pass when a control is deactivated.
     */
    deactivated?: Record<string, (string | number)[]>;
}

/**
 * Settings to initialize a new ITouchPassr.
 */
export interface TouchPassrSettings {
    /**
     * An InputWritr for controls to pipe event triggers to.
     */
    inputWriter: InputWritr;

    /**
     * An HTMLElement all controls are placed within.
     */
    parentContainer?: HTMLElement;

    /**
     * Root container for styles to be added to control elements.
     */
    styles?: Partial<RootControlStyles>;

    /**
     * Container for generated controls, keyed by their name.
     */
    controls?: ControlSchemasContainer;

    /**
     * Whether this is currently enabled and visually on the screen.
     */
    enabled?: boolean;
}
