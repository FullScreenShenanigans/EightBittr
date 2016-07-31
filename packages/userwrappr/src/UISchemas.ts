/**
 * A general descripton of a user control containing some number of options.
 */
export interface ISchema {
    /**
     * The name of the generator that should create this control.
     */
    generator: string;

    /**
     * The label for the control that users will see.
     */
    title: string;
}

/**
 * A general description of a single option within a user control.
 */
export interface IOption {
    /**
     * The label for the option that users will see.
     */
    title: string;

    /**
     * A source Function for the option's initial value.
     */
    source: IOptionSource;
}

/**
 * A source Function for an option's individual value.
 * 
 * @param GameStarter   The GameStarter instance this control is for.
 * @returns An initial value for an option control.
 */
export interface IOptionSource {
    (GameStarter: any, ...args: any[]): any;
}

/**
 * An HTMLElement that has been given a utility setValue Function.
 */
export interface IChoiceElement extends HTMLElement {
    /**
     * A utility Function to set this HTMLElement's value.
     * 
     * @param value   A new value for this element.
     */
    setValue(value: any): void;
}

/**
 * An HTMLInputElement that has been given a utility setValue Function.
 */
export interface IInputElement extends HTMLInputElement, IChoiceElement { }

/**
 * An HTMLSelectElement that has been given a utility setValue Function, as
 * well as a variable to hold a previous value.
 */
export interface ISelectElement extends HTMLSelectElement {
    /**
     * A previous value for this element.
     */
    valueOld?: string;

    /**
     * A utility Function to set this HTMLElement's value.
     * 
     * @param value   A new value for this element.
     */
    setValue(value: any): void;
}
