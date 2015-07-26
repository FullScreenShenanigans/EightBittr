// @echo '/// <reference path="InputWritr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/InputWritr-0.2.0.ts" />
/// <reference path="GamepadWrapperModule.d.ts" />
// @endif

// @include ../Source/GamepadWrapperModule.d.ts

module GamepadWrapperModule {
    "use strict";

    /**
     * 
     */
    export class GamepadWrapperModule implements IGamepadWrapperModule {
        /**
         * 
         */
        private static controllerMappings: IControllerMappings = {
            "standard": {
                "axes": [
                    {
                        "axis": "x",
                        "joystick": 0,
                        "name": "leftJoystick"
                    },
                    {
                        "axis": "y",
                        "joystick": 0,
                        "name": "leftJoystick"
                    },
                    {
                        "axis": "x",
                        "joystick": 1,
                        "name": "rightJoystick"
                    },
                    {
                        "axis": "y",
                        "joystick": 1,
                        "name": "rightJoystick"
                    }
                ],
                "buttons": [
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
                "joystickThreshold": .49
            }
        };

        /**
         * 
         */
        InputWritr: InputWritr.IInputWritr;

        /**
         * 
         */
        triggers: ITriggers;

        /**
         * 
         */
        aliases: IAliases;

        /**
         * 
         */
        gamepads: IGamepad[];

        /**
         * 
         */
        constructor(settings: IGamepadWrapperModuleSettings) {
            this.InputWritr = settings.InputWriter;
            this.triggers = settings.triggers;
            this.aliases = settings.aliases;

            this.gamepads = [];
        }


        /* Simple gets
        */

        /**
         * 
         */
        getInputWritr(): InputWritr.IInputWritr {
            return this.InputWritr;
        }

        /**
         * 
         */
        getTriggers(): ITriggers {
            return this.triggers;
        }

        /**
         * 
         */
        getAliases(): IAliases {
            return this.aliases;
        }

        /**
         * 
         */
        getRegisteredGamepads(): IGamepad[] {
            return this.gamepads;
        }


        /* Registration
        */

        /**
         * 
         * 
         * @return {Number} How many gamepads were added.
         */
        checkNavigatorGamepads(): number {
            if (!(<any>navigator).getGamepads()[this.gamepads.length]) {
                return 0;
            }

            this.registerGamepad((<any>navigator).getGamepads()[this.gamepads.length]);

            return this.checkNavigatorGamepads() + 1;
        }

        /**
         * 
         */
        registerGamepad(gamepad: IGamepad): void {
            this.gamepads.push(gamepad);
        }


        /* Triggers
        */

        /**
         * 
         */
        activateAllGamepadTriggers(): void {
            for (var i: number = 0; i < this.gamepads.length; i += 1) {
                this.activateGamepadTriggers(this.gamepads[i]);
            }
        }

        /**
         * 
         */
        activateGamepadTriggers(gamepad: IGamepad): void {
            var mapping: IControllerMapping = GamepadWrapperModule.controllerMappings[gamepad.mapping],
                i: number;

            for (i = 0; i < mapping.axes.length; i += 1) {
                this.activateAxisTrigger(gamepad, mapping.axes[i].name, mapping.axes[i].axis, gamepad.axes[i]);
            }

            for (i = 0; i < mapping.buttons.length; i += 1) {
                this.activateButtonTrigger(gamepad, mapping.buttons[i], gamepad.buttons[i].pressed);
            }
        }

        /**
         * 
         * 
         * @return {Boolean} Whether the trigger was activated.
         */
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean {
            var listing: IJoystickTriggerAxis = (<IJoystickListing>this.triggers[name])[axis],
                status: AxisStatus = this.getAxisStatus(gamepad, magnitude);

            // If the axis' current status matches the new one, don't do anything
            if (listing.status === status) {
                return false;
            }

            // Release the old axis via the InputWritr using the off alias
            this.InputWritr.callEvent(this.aliases.off, listing[AxisStatus[listing.status]]);

            // Mark the new status in the listing
            listing.status = status;

            // Trigger the new status via the InputWritr using the on alias
            this.InputWritr.callEvent(this.aliases.on, listing[AxisStatus[status]]);

            return true;
        }

        /**
         * 
         * 
         * @return {Boolean} Whether the trigger was activated.
         */
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean): boolean {
            var listing: IButtonListing = <IButtonListing>this.triggers[name];

            // If the button's current status matches the new one, don't do anything
            if (listing.status === status) {
                return false;
            }

            listing.status = status;

            // Trigger the new status via the InputWritr using the new alias
            this.InputWritr.callEvent(status ? this.aliases.on : this.aliases.off, listing.trigger);

            return true;
        }


        /* Private utilities
        */

        /**
         * @param {Gamepad} gamepad
         * @param {Number} magnitude   The direction an axis is measured at, in [-1, 1].
         * @return {AxisStatus} What direction a magnitude is relative to 0 (namely
         *                      positive, negative, or neutral).
         */
        private getAxisStatus(gamepad: IGamepad, magnitude: number): AxisStatus {
            if (magnitude > GamepadWrapperModule.controllerMappings[gamepad.mapping].joystickThreshold) {
                return AxisStatus.positive;
            }

            if (magnitude < -GamepadWrapperModule.controllerMappings[gamepad.mapping].joystickThreshold) {
                return AxisStatus.negative;
            }

            return AxisStatus.neutral;
        }
    }
}
