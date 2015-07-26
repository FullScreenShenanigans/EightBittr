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
                        "joystick": 0,
                        "axis": "x"
                    },
                    {
                        "joystick": 0,
                        "axis": "y"
                    },
                    {
                        "joystick": 1,
                        "axis": "x"
                    },
                    {
                        "joystick": 1,
                        "axis": "y"
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
        controllerMapping: IControllerMapping;

        /**
         * 
         */
        controllerMappingName: string;

        /**
         * 
         */
        constructor(settings: IGamepadWrapperModuleSettings) {
            this.triggers = settings.triggers;
            this.aliases = settings.aliases;
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
        getControllerMapping(): IControllerMapping {
            return this.controllerMapping;
        }

        /**
         * 
         */
        getControllerMappingName(): string {
            return this.controllerMappingName;
        }


        /* Registration
        */

        /**
         * 
         */
        setControllerMapping(name: string): IControllerMapping {
            this.controllerMappingName = name;
            this.controllerMapping = GamepadWrapperModule.controllerMappings[name];

            return this.controllerMapping;
        }


        /* Triggers
        */

        /**
         * 
         */
        activateButtonTrigger(name: string, status: boolean): void {
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

        /**
         * 
         */
        activateJoystickTrigger(name: string, x: number, y: number): void {
            console.log("Activating joystick", x, y);
        }
    }
}
