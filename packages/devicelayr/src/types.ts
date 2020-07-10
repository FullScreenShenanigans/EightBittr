import { IInputWritr } from "inputwritr";

/**
 * A representation of a gamepad, directly taken from navigator.getGamepads.
 */
export interface IGamepad {
    readonly axes: ReadonlyArray<number>;
    readonly buttons: ReadonlyArray<IGamepadButton>;
    readonly mapping: string;
}

/**
 * A single button in an IGamepad.
 */
export interface IGamepadButton {
    value: number;
    pressed: boolean;
}

/**
 * A mapping from button names to their equivalent InputWritr pipes.
 */
export interface ITriggers {
    [i: string]: IButtonListing | IJoystickListing;
}

/**
 * Representation of a single button's status.
 */
export interface IButtonListing {
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
export interface IJoystickListing {
    [i: string]: IJoystickTriggerAxis;
}

/**
 * A single joystick axis status.
 */
export interface IJoystickTriggerAxis {
    /**
     * The current status of the axis.
     */
    status?: number;
}

/**
 * Equivalent event keys from "on" and "off" activations to pass to the InputWritr.
 */
export interface IAliases {
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
export interface IControllerMappings {
    [i: string]: IControllerMapping;
}

/**
 * A description of what a controller looks like.
 */
export interface IControllerMapping {
    /**
     * Known axis descriptions for the controller.
     */
    axes: IAxisSchema[];

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
export interface IAxisSchema {
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
export interface IDeviceLayrSettings {
    /**
     * The IInputWritr to pipe button and joystick trigger commands.
     */
    inputWriter: IInputWritr;

    /**
     * Which device controls should cause what triggers.
     */
    triggers?: ITriggers;

    /**
     * For "on" and "off" activations, equivalent event keys to pass
     * to the IInputWritr.
     */
    aliases?: IAliases;
}
