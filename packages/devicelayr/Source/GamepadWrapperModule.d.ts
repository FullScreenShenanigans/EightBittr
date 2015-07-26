declare module GamepadWrapperModule {
    /**
     * 
     */
    export interface IGamepad {
        mapping: string;
    }

    /**
     * 
     */
    export interface ITriggers {
        [i: string]: IButtonListing | IJoystickListing;
    }

    /**
     * 
     */
    export interface IButtonListing {
        status?: boolean;
        trigger: string;
    }

    /**
     * 
     */
    export interface IJoystickListing {
        x: IJoystickTriggerAxis;
        y: IJoystickTriggerAxis;
    }

    /**
     * 
     */
    export interface IJoystickTriggerAxis {
        negative: string;
        positive: string;
        status?: AxisStatus;
    }
    
    /**
     * 
     */
    export enum AxisStatus {
        negative,
        neutral,
        positive
    }

    /**
     * 
     */
    export interface IAliases {
        on: string;
        off: string;
    }

    /**
     * 
     */
    export interface IControllerMappings {
        [i: string]: IControllerMapping;
    }

    /**
     * 
     */
    export interface IControllerMapping {
        axes: IAxisSchema[];
        buttons: string[];
        joystickThreshold: number;
    }

    /**
     * 
     */
    export interface IAxisSchema {
        joystick: number;
        axis: string;
    }

    export interface IGamepadWrapperModuleSettings {
        triggers: ITriggers;
        aliases: IAliases;
    }

    export interface IGamepadWrapperModule {

    }
}
