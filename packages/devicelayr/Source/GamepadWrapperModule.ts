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
        triggers: ITriggersListing;

        /**
         * 
         */
        constructor(settings: IGamepadWrapperModuleSettings) {
            this.triggers = settings.triggers;
        }


        /* Simple gets
        */

        /**
         * 
         */
        getTriggers(): ITriggersListing {
            return this.triggers;
        }


        /* Triggers
        */

        /**
         * 
         */
        activateButtonTrigger(name: string, value: boolean): void {
            console.log("Activating button", name, value);
        }

        /**
         * 
         */
        activateJoystickTrigger(name: string, x: number, y: number): void {
            console.log("Activating joystick", x, y);
        }
    }
}
