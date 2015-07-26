declare module DeviceLayr {
    /**
     * 
     */
    export interface IGamepad {
        axes: number[];
        buttons: IGamepadButton[];
        mapping: string;
    }

    /**
     * 
     */
    export interface IGamepadButton {
        value: number;
        pressed: boolean;
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
        [i: string]: IJoystickTriggerAxis;
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
        axis: string;
        joystick: number;
        name: string;
    }

    export interface IDeviceLayerSettings {
        InputWriter: InputWritr.IInputWritr;
        triggers: ITriggers;
        aliases: IAliases;
    }

    export interface IDeviceLayr {

    }
}
