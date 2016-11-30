import { IInputWritr } from "inputwritr/lib/IInputWritr";

import {
    IAliases, IButtonListing, IControllerMapping, IControllerMappings,
    IDeviceLayr, IDeviceLayrSettings,
    IGamepad, IJoystickListing, IJoystickTriggerAxis, ITriggers
} from "./IDeviceLayr";

/**
 * Status possibilities for an axis. Neutral is the default; positive is above
 * its threshold; negative is below the threshold / -1.
 */
export enum AxisStatus {
    /**
     * Low axis status (lower than the negative of the threshold).
     */
    negative,

    /**
     * Default axis status (absolutely closer to 0 than the threshold).
     */
    neutral,

    /**
     * High axis status (higher than the threshold).
     */
    positive
}

/**
 * GamePad API bindings for InputWritr pipes.
 */
export class DeviceLayr implements IDeviceLayr {
    /**
     * Known mapping schemas for standard controllers. These are referenced
     * by added gamepads via the gamepads' .name attribute.
     */
    private static controllerMappings: IControllerMappings = {
        /**
         * Controller mapping for a typical Xbox style controller.
         */
        standard: {
            axes: [
                {
                    axis: "x",
                    joystick: 0,
                    name: "leftJoystick"
                },
                {
                    axis: "y",
                    joystick: 0,
                    name: "leftJoystick"
                },
                {
                    axis: "x",
                    joystick: 1,
                    name: "rightJoystick"
                },
                {
                    axis: "y",
                    joystick: 1,
                    name: "rightJoystick"
                }
            ],
            buttons: [
                "a",
                "b",
                "x",
                "y",
                "leftTop",
                "rightTop",
                "leftTrigger",
                "rightTrigger",
                "select",
                "start",
                "leftStick",
                "rightStick",
                "dpadUp",
                "dpadDown",
                "dpadLeft",
                "dpadRight"
            ],
            joystickThreshold: .49
        }
    };

    /**
     * The InputWritr being piped button and joystick triggers commands.
     */
    private InputWritr: IInputWritr;

    /**
     * Mapping of which device controls should cause what triggers, along
     * with their current statuses.
     */
    private triggers: ITriggers;

    /**
     * For "on" and "off" activations, the equivalent event keys to pass to
     * the internal InputWritr.
     */
    private aliases: IAliases;

    /**
     * Any added gamepads (devices), in order of activation.
     */
    private gamepads: IGamepad[];

    /**
     * Initializes a new instance of the DeviceLayr class.
     * 
     * @param settings   Settings to use for initialization.
     */
    public constructor(settings: IDeviceLayrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to DeviceLayr.");
        }
        if (typeof settings.InputWriter === "undefined") {
            throw new Error("No InputWriter given to DeviceLayr.");
        }

        this.InputWritr = settings.InputWriter;
        this.triggers = settings.triggers || {};
        this.aliases = settings.aliases || {
            on: "on",
            off: "off"
        };

        this.gamepads = [];
    }

    /**
     * @returns The InputWritr being piped button and joystick triggers.
     */
    public getInputWritr(): IInputWritr {
        return this.InputWritr;
    }

    /**
     * @returns Mapping of which device controls should cause what triggers,
     *          along with their current statuses.
     */
    public getTriggers(): ITriggers {
        return this.triggers;
    }

    /**
     * @returns For "on" and "off" activations, the equivalent event keys
     *          to pass to the internal InputWritr.
     */
    public getAliases(): IAliases {
        return this.aliases;
    }

    /**
     * @returns Any added gamepads (devices), in order of activation.
     */
    public getGamepads(): IGamepad[] {
        return this.gamepads;
    }

    /**
     * If possible, checks the navigator for new gamepads, and adds them if found.
     * 
     * @returns How many gamepads were added.
     */
    public checkNavigatorGamepads(): number {
        if (typeof navigator.getGamepads === "undefined" || !navigator.getGamepads()[this.gamepads.length]) {
            return 0;
        }

        this.registerGamepad(navigator.getGamepads()[this.gamepads.length]);

        return this.checkNavigatorGamepads() + 1;
    }

    /**
     * Registers a new gamepad.
     * 
     * @param gamepad   The gamepad to register.
     */
    public registerGamepad(gamepad: IGamepad): void {
        this.gamepads.push(gamepad);
        this.setDefaultTriggerStatuses(gamepad, this.triggers);
    }

    /**
     * Checks the trigger statuses of all known gamepads.
     */
    public activateAllGamepadTriggers(): void {
        for (const gamepad of this.gamepads) {
            this.activateGamepadTriggers(gamepad);
        }
    }

    /**
     * Checks the trigger status of a gamepad, calling the equivalent InputWritr
     * events if any triggers have occurred.
     * 
     * @param gamepad   The gamepad whose status is to be checked.
     */
    public activateGamepadTriggers(gamepad: IGamepad): void {
        const mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"];

        for (let i: number = Math.min(mapping.axes.length, gamepad.axes.length) - 1; i >= 0; i -= 1) {
            this.activateAxisTrigger(gamepad, mapping.axes[i].name, mapping.axes[i].axis, gamepad.axes[i]);
        }

        for (let i: number = Math.min(mapping.buttons.length, gamepad.buttons.length) - 1; i >= 0; i -= 1) {
            this.activateButtonTrigger(mapping.buttons[i], gamepad.buttons[i].pressed);
        }
    }

    /**
     * Checks for triggered changes to an axis, and calls the equivalent InputWritr
     * event if one is found.
     * 
     * @param gamepad   The gamepad whose triggers are to be checked.
     * @param name   The name of the axis, typically "x" or "y".
     * @param magnitude   The current value of the axis, in [1, -1].
     * @returns Whether the trigger was activated.
     */
    public activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean {
        const listing: IJoystickTriggerAxis = (this.triggers[name] as IJoystickListing)[axis];
        if (!listing) {
            return false;
        }

        // If the axis' current status matches the new one, don't do anything
        const status: AxisStatus = this.getAxisStatus(gamepad, magnitude);
        if (listing.status === status) {
            return false;
        }

        // If it exists, release the old axis via the InputWritr using the off alias
        if (listing.status !== undefined && (listing as any)[AxisStatus[listing.status]] !== undefined) {
            this.InputWritr.callEvent(this.aliases.off, (listing as any)[AxisStatus[listing.status]]);
        }

        // Mark the new status in the listing
        listing.status = status;

        // Trigger the new status via the InputWritr using the on alias
        if ((listing as any)[AxisStatus[status]] !== undefined) {
            this.InputWritr.callEvent(this.aliases.on, (listing as any)[AxisStatus[status]]);
        }

        return true;
    }

    /**
     * Checks for triggered changes to a button, and calls the equivalent InputWritr
     * event if one is found.
     * 
     * @param name   The name of the button, such as "a" or "left".
     * @param status   Whether the button is activated (pressed).
     * @returns Whether the trigger was activated.
     */
    public activateButtonTrigger(name: string, status: boolean): boolean {
        const listing: IButtonListing = this.triggers[name] as IButtonListing;

        // If the button's current status matches the new one, don't do anything
        if (!listing || listing.status === status) {
            return false;
        }

        listing.status = status;

        // Trigger the new status via the InputWritr using the new alias
        this.InputWritr.callEvent(status ? this.aliases.on : this.aliases.off, listing.trigger);

        return true;
    }

    /**
     * Clears the statuses of all axes and buttons on all known gamepads.
     */
    public clearAllGamepadTriggers(): void {
        for (const gamepad of this.gamepads) {
            this.clearGamepadTriggers(gamepad);
        }
    }

    /**
     * Clears the status of all axes and buttons on a gamepad.
     * 
     * @param gamepad   The gamepad whose triggers are to be cleared.
     */
    public clearGamepadTriggers(gamepad: IGamepad): void {
        const mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"];

        for (const axis of mapping.axes) {
            this.clearAxisTrigger(axis.name, axis.axis);
        }

        for (const button of mapping.buttons) {
            this.clearButtonTrigger(button);
        }
    }

    /**
     * Sets the status of an axis to neutral.
     * 
     * @param name   The name of the axis, typically "x" or "y".
     */
    public clearAxisTrigger(name: string, axis: string): void {
        const listing: IJoystickTriggerAxis = (this.triggers[name] as IJoystickListing)[axis];

        listing.status = AxisStatus.neutral;
    }

    /**
     * Sets the status of a button to off.
     * 
     * @param name   The name of the button, such as "a" or "left".
     */
    public clearButtonTrigger(name: string): void {
        const listing: IButtonListing = this.triggers[name] as IButtonListing;

        listing.status = false;
    }

    /**
     * Puts the default values for all buttons and joystick axes that don't already
     * have statuses. This is useful so activation checks don't glitch out.
     * 
     * @param gamepad   The gamepad whose triggers are to be defaulted.
     * @param triggers   The triggers to default, as listings keyed by name.
     */
    private setDefaultTriggerStatuses(gamepad: IGamepad, triggers: ITriggers): void {
        const mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"];

        for (let i: number = 0; i < mapping.buttons.length; i += 1) {
            const button: IButtonListing = triggers[mapping.buttons[i]] as IButtonListing;

            if (button && button.status === undefined) {
                button.status = false;
            }
        }

        for (let i: number = 0; i < mapping.axes.length; i += 1) {
            const joystick: IJoystickListing = triggers[mapping.axes[i].name] as IJoystickListing;

            for (const j in joystick) {
                if (!joystick.hasOwnProperty(j)) {
                    continue;
                }

                if (joystick[j].status === undefined) {
                    joystick[j].status = AxisStatus.neutral;
                }
            }
        }
    }

    /**
     * @param gamepad   The gamepad whose axis is being looked up.
     * @param magnitude   The direction an axis is measured at, in [-1, 1].
     * @returns What direction a magnitude is relative to 0.
     */
    private getAxisStatus(gamepad: IGamepad, magnitude: number): AxisStatus {
        const joystickThreshold: number = DeviceLayr.controllerMappings[gamepad.mapping || "standard"].joystickThreshold;

        if (magnitude > joystickThreshold) {
            return AxisStatus.positive;
        }

        if (magnitude < -joystickThreshold) {
            return AxisStatus.negative;
        }

        return AxisStatus.neutral;
    }
}
