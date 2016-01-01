/* tslint:disable:interface-name */

interface HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

declare module UserWrappr {
    /**
     * The class of game being controlled by the UserWrappr. This will normally
     * be implemented by the GameStartr project itself.
     */
    export interface IGameStartr {
        DeviceLayer: DeviceLayr.IDeviceLayr;
        GamesRunner: GamesRunnr.IGamesRunnr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        InputWriter: InputWritr.IInputWritr;
        LevelEditor: LevelEditr.ILevelEditr;
        UserWrapper: IUserWrappr;
        container: HTMLElement;
        addPageStyles(styles: StyleSheet): void;
        gameStart(): void;
        createElement(tag: string, ...args: any[]): HTMLElement;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
    }

    /**
     * Custom settings for an individual IGameStartr instance, such as size info.
     */
    type IGameStartrCustoms = any;

    /**
     * Initializes a new instance of the IGameStartr interface.
     */
    export interface IGameStartrConstructor {
        new (...args: any[]): IGameStartr;
    }

    /**
     * Generator for a user-facing HTML control.
     * 
     * @param schema   A general description of the control to create.
     * @returns An HTML element as described by the schema.
     */
    export interface IOptionsGenerator {
        generate: (schema: UISchemas.ISchema) => HTMLDivElement;
    }

    /**
     * Options generators, keyed by name.
     */
    export interface IOptionsGenerators {
        [i: string]: IOptionsGenerator;
    }

    /**
     * A single line of text to write to a console. If an Array, the first String is the 
     * message, and any others are aliases of UserWrappr styles to apply.
     */
    export type IHelpLine = string | string[];

    /**
     * Descriptions of help settings to display in the console.
     */
    export interface IUIHelpSettings {
        /**
         * An alias to replace with the IGameStartr's globalName.
         */
        globalNameAlias: string;

        /**
         * Lines to display immediately upon starting.
         */
        openings: IHelpLine[];

        /**
         * Descriptions of APIs users may use, along with sample code.
         */
        options: {
            [i: string]: IHelpOption[];
        };
    }

    /**
     * Descriptions of APIs users may use, along with sample code.
     */
    export interface IHelpOption {
        /**
         * A label for the API to research it by.
         */
        title: string;

        /**
         * A common description of the API.
         */
        description: string;

        /**
         * Code sample for usage of the API.
         */
        usage?: string;

        /**
         * API code samples with explanations.
         */
        examples?: IHelpExample[];
    }

    /**
     * Code sample for an API with an explanation.
     */
    export interface IHelpExample {
        /**
         * An API code sample.
         */
        code: IHelpLine;

        /**
         * An explanation for the API code sample.
         */
        comment: IHelpLine;
    }

    /**
     * Styles that may be applied to console help text.
     */
    export interface ITextStyles {
        /**
         * Style for headers.
         */
        head: string;

        /**
         * Style for code.
         */
        code: string;

        /**
         * Style for code comments.
         */
        comment: string;

        /**
         * Style for italicized text.
         */
        italic: string;

        /**
         * No styles at all (plain text).
         */
        none: string;
    }

    /**
     * How wide and tall an IUserWrappr's contained IGameStartr should be sized.
     */
    export interface ISizeSummary {
        /**
         * How wide the contained IGameStartr should be, as a standard Number or Infinity.
         */
        width: number;

        /**
         * How tall the contained IGameStartr should be, as a standard Number or Infinity.
         */
        height: number;

        /**
         * Whether the contained IGameStartr should request full screen size.
         */
        full?: boolean;

        /**
         * What this size summary should be referred to, if not its key in the container.
         */
        name?: string;
    }

    /**
     * Size summaries keyed by name.
     */
    export interface ISizeSummaries {
        [i: string]: ISizeSummary;
    }

    /**
     * Settings to initialize a new IUserWrappr.
     */
    export interface IUserWrapprSettings {
        /**
         * Descriptions of help settings to display in the console.
         */
        helpSettings: IUIHelpSettings;

        /**
         * What the global object is called, such as "window".
         */
        globalName: string;

        /**
         * Allowed sizes for the game.
         */
        sizes: ISizeSummaries;

        /**
         * The default starting size.
         */
        sizeDefault: string;

        /**
         * Schemas for each UI control to be made.
         */
        schemas: UISchemas.ISchema[];

        /**
         * A list of all allowed keyboard keys to replace the UserWrappr class default.
         */
        allPossibleKeys?: string[];

        /**
         * A CSS selector for the game's container.
         */
        gameElementSelector?: string;

        /**
         * A CSS selector for the UI buttons container.
         */
        gameControlsSelector?: string;

        /**
         * A utility Function to log messages, commonly console.log.
         */
        log?: (...args: any[]) => void;

        /**
         * Custom arguments to be passed to the IGameStartr's modules.
         */
        customs?: IGameStartrCustoms;

        /**
         * Any additional CSS styles to be applied to the page.
         */
        styleSheet?: StyleSheet;

        /**
         * The constructor for the IGameStartr implementation.
         */
        GameStartrConstructor: IGameStartrConstructor;
    }

    /**
     *
     */
    export interface IUserWrappr {
        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         * 
         * @param settings   Settings for the GameStartr constructor.
         * @param customs   Additional settings for sizing information.
         */
        resetGameStarter(settings: IUserWrapprSettings, customs?: IGameStartrCustoms): void;

        /**
         * @returns The GameStartr implementation this is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor;

        /**
         * @returns The GameStartr instance created by GameStartrConstructor.
         */
        getGameStarter(): IGameStartr;

        /**
         * @returns The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;

        /**
         * @returns The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings;

        /**
         * @returns The customs used to construct the IGameStartr.
         */
        getCustoms(): IGameStartrCustoms;

        /**
         * @returns The help settings from settings.helpSettings.
         */
        getHelpSettings(): IUIHelpSettings;

        /**
         * @returns What the global object is called, such as "window".
         */
        getGlobalName(): string;

        /**
         * @returns What to replace with the name of the game in help text.
         */
        getGameNameAlias(): string;

        /**
         * @returns All the keys the user is allowed to pick from in UI controls.
         */
        getAllPossibleKeys(): string[];

        /**
         * @returns The allowed sizes for the game.
         */
        getSizes(): ISizeSummaries;

        /**
         * @returns The currently selected size for the game.
         */
        getCurrentSize(): ISizeSummary;

        /**
         * @returns Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean;

        /**
         * @returns Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean;

        /**
         * @returns A utility Function to log messages, commonly console.log.
         */
        getLogger(): (...args: any[]) => string;

        /**
         * @returns Generators used to generate HTML controls for the user.
         */
        getGenerators(): IOptionsGenerators;

        /**
         * @returns The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement;

        /**
         * @returns The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void;

        /**
         * @returns The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void;

        /**
         * @returns The identifier for the device input checking interval.
         */
        getDeviceChecker(): number;

        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         * 
         * @param size The size to set, as a String to retrieve the size from
         *             known info, or a container of settings.
         */
        setCurrentSize(size: string | ISizeSummary): void;

        /**
         * Displays the root help menu dialog, which contains all the openings
         * for each help settings opening.
         */
        displayHelpMenu(): void;

        /**
         * Displays the texts of each help settings options, all surrounded by
         * instructions on how to focus on a group.
         */
        displayHelpOptions(): void;

        /**
         * Displays the summary for a help group of the given optionName.
         * 
         * @param optionName   The help group to display the summary of.
         */
        displayHelpGroupSummary(optionName: string): void;

        /**
         * Displays the full information on a help group of the given optionName.
         * 
         * @param optionName   The help group to display the information of.
         */
        displayHelpOption(optionName: string): void;
    }

    /**
     * Generators and descriptors for controls generated by an IUserWrappr.
     */
    export module UISchemas {
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
            (GameStarter: IGameStartr, ...args: any[]): any;
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
    }
}
