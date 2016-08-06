/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/LevelEditr.d.ts" />

import { ISchema } from "./UISchemas";

export interface IHTMLElement extends HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    msRequestFullscreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

export interface IEvent {
    target: HTMLElement;
}

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
    createElement(tag: "div", ...args: any[]): HTMLDivElement;
    proliferate(recipient: any, donor: any, noOverride?: boolean): any;
}

/**
 * Custom settings for an individual IGameStartr instance, such as size info.
 */
export type IGameStartrCustoms = any;

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
    generate: (schema: ISchema) => HTMLDivElement;
}

/**
 * Options generators, keyed by name.
 */
export interface IOptionsGenerators {
    [i: string]: IOptionsGenerator;
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
    schemas: ISchema[];

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
    logger?: (...args: any[]) => void;

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
 * A user interface wrapper for configurable HTML displays over GameStartr games.
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
     * Resets the visual aspect of the controls so they are updated with the
     * recently changed values in ItemsHolder.
     */
    resetControls(): void;

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
}
