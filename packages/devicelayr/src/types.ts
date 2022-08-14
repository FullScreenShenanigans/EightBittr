import { InputWritr } from "inputwritr";

/**
 * A representation of a gamepad, directly taken from navigator.getGamepads.
 */
export interface Gamepad {
    readonly axes: readonly number[];
    readonly buttons: readonly GamepadButton[];
    readonly mapping: string;
}

/**
 * A single button in an Gamepad.
 */
export interface GamepadButton {
    value: number;
    pressed: boolean;
}

/**
 * A mapping from button names to their equivalent InputWritr pipes.
 */
export type Triggers = Record<string, ButtonListing | JoystickListing>;

/**
 * Representation of a single button's status.
 */
export interface ButtonListing {
    /**
     * A sourceEvent name to pass to InputWritr.
     */
    trigger: string;

    /**
     * Whether the button is currently pressed.
     */
    status?: boolean;
}

/**
 * Representation of a single joystick's axis' statuses.
 */
export type JoystickListing = Record<string, JoystickTriggerAxis>;

/**
 * A single joystick axis status.
 */
export interface JoystickTriggerAxis {
    /**
     * The current status of the axis.
     */
    status?: number;
}

/**
 * Equivalent event keys from "on" and "off" activations to pass to the InputWritr.
 */
export interface Aliases {
    /**
     * The name of the event key for "on" activations.
     */
    on: string;

    /**
     * The name of the event key for "off" activations.
     */
    off: string;
}

/**
 * A listing of controller mappings, keyed by their configuration name.
 */
export type ControllerMappings = Record<string, ControllerMapping>;

/**
 * A description of what a controller looks like.
 */
export interface ControllerMapping {
    /**
     * Known axis descriptions for the controller.
     */
    axes: AxisSchema[];

    /**
     * Names of the controller's buttons.
     */
    buttons: string[];

    /**
     * The threshold for passing from a neutral status to a positive or negative.
     */
    joystickThreshold: number;
}

/**
 * A description of a controller's axis.
 */
export interface AxisSchema {
    /**
     * The name of the axis, such as "x" or "y".
     */
    axis: string;

    /**
     * The number the joystick is within the gamepad.
     */
    joystick: number;

    /**
     * The common name of the axis.
     */
    name: string;
}

/**
 * Settings to initialize a new IDeviceLayr instance.
 */
export interface DeviceLayrSettings {
    /**
     * The InputWritr to pipe button and joystick trigger commands.
     */
    inputWriter: InputWritr;

    /**
     * Which device controls should cause what triggers.
     */
    triggers?: Triggers;

    /**
     * For "on" and "off" activations, equivalent event keys to pass
     * to the InputWritr.
     */
    aliases?: Aliases;
}
