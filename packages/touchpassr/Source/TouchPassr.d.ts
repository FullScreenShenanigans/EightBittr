declare module TouchPassr {
    /**
     * Schema for where a control should lay on the screen. 
     */
    export interface IPosition {
        vertical: string;
        horizontal: string;
        offset?: IPositionOffset
    }

    /**
     * Offset measurements for a schema's position.
     */
    export interface IPositionOffset {
        left?: number | string;
        top?: number | string;
    }

    /**
     * Global declaration of styles for all controls, typically passed from a
     * TouchPassr to its generated controls.
     */
    export interface IRootControlStyles {
        global: IControlStyles;
        Button: IButtonStyles;
        Joystick: IJoystickStyles;
    }

    /**
     * Container for controls, keyed by name.
     */
    export interface IControlsContainer {
        [i: string]: Control;
    }

    /**
     * Container for control schemas, keyed by name.
     */
    export interface IControlSchemasContainer {
        [i: string]: IControlSchema;
    }
    
    /**
     * General container for element styles of a control. It should be extended
     * for more specific controls.
     */
    export interface IControlStyles {
        element?: CSSRuleList;
        elementInner?: CSSRuleList;
    }

    /**
     * Root schema to be followed for all controls. More specific schema versions
     * will extend this.
     */
    export interface IControlSchema {
        name: string;
        control: string;
        position: IPosition;
        label?: string;
        styles?: IControlStyles;
    }

    /**
     * Schema for how a control should interact with its InputWriter. Each member key
     * is the control action, which is linked to any number of InputWriter events, each
     * of which contains any number of key codes to send. 
     */
    export interface IPipes {
        activated?: { [i: string]: (string | number)[] };
        deactivated?: { [i: string]: (string | number)[] };
    }

    /**
     * Control schema for a simple button. Pipes are activated on press and on release.
     */
    export interface IButtonSchema extends IControlSchema {
        pipes?: IPipes;
    }
    
    /**
     * Styles schema for a button control, which doesn't change anything.
     */
    export interface IButtonStyles extends IControlStyles { }

    /**
     * Control schema for a joystick. It may have any number of directions that it
     * will snap to, each of which will have its own pipes.
     */
    export interface IJoystickSchema extends IControlSchema {
        directions: IJoystickDirection[];
    }

    /**
     * Schema for a single direction for a joystick. It will be represented as a tick
     * on the joystick that the control will snap its direction to.
     */
    export interface IJoystickDirection {
        name: string;
        degrees: number;
        neighbors?: string[];
        pipes?: IPipes;
    }
    
    /**
     * Styles schema for a joystick control, adding its ticks and indicator elements.
     */
    export interface IJoystickStyles extends IControlStyles {
        circle?: IControlStyles;
        tick?: IControlStyles;
        dragLine?: IControlStyles;
        dragShadow?: IControlStyles;
    }

    export interface ITouchPassrSettings {
        InputWriter: InputWritr.IInputWritr;
        prefix?: string;
        container?: HTMLElement;
        styles?: any;
        controls?: { [i: string]: IControlSchema };
        enabled?: boolean;
    }

    export interface ITouchPassr {
        getInputWriter(): InputWritr.IInputWritr;
        getEnabled(): boolean;
        getStyles(): IRootControlStyles;
        getControls(): IControlsContainer;
        getContainer(): HTMLElement;
        getParentContainer(): HTMLElement;
        enable(): void;
        disable(): void;
        setParentContainer(parentElement: HTMLElement): void;
        addControls(schemas: IControlSchemasContainer): void;
        addControl(schema: IControlSchema): void;
    }
}
