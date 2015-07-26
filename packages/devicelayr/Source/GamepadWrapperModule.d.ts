declare module GamepadWrapperModule {
    /**
     * 
     */
    export interface ITriggersListing {
        [i: string]: IButtonTriggerListing | IJoystickTriggerListing;
    }

    export type IButtonTriggerListing = string;

    export interface IJoystickTriggerListing {
        x: IJoystickTriggerAxis;
    }

    export interface IJoystickTriggerAxis {
        negative: string;
        positive: string;
    }

    export interface IGamepadWrapperModuleSettings {
        triggers;
    }

    export interface IGamepadWrapperModule {
        
    }
}