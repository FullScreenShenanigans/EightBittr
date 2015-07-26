// @ifdef INCLUDE_DEFINITIONS
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
            this.triggers = settings.triggers;
            this.aliases = settings.aliases;

            this.gamepads = [];
        }


        /* Simple gets
        */

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
         */
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): void {
            var listing: IJoystickListing = <IJoystickListing>this.triggers[name],
                status: AxisStatus = this.getAxisStatus(gamepad, magnitude);

            console.log(listing, "has", axis, status);
        }

        /**
         * 
         */
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean): void {
            var listing: IButtonListing = <IButtonListing>this.triggers[name];

            // If the button's current status matches the new one, don't do anything
            if (listing.status === status) {
                return;
            }

            if (status) {
                console.log(name, "is", this.aliases.on);
            } else {
                console.log(name, "is", this.aliases.off);
            }

            listing.status = status;
        }


        /* Private utilities
        */

        /**
         * 
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
