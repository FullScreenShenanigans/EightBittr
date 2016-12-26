import { GameStartr } from "gamestartr/lib/GameStartr";

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
 * How wide and tall an IUserWrappr's contained GameStartr should be sized.
 */
export interface ISizeSummary {
    /**
     * How wide the contained GameStartr should be, as a standard Number or Infinity.
     */
    width: number;

    /**
     * How tall the contained GameStartr should be, as a standard Number or Infinity.
     */
    height: number;

    /**
     * Whether the contained GameStartr should request full screen size.
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
     * The GameStartr instance being wrapped.
     */
    gameStarter: GameStartr;

    /**
     * Schemas for each UI control to be made.
     */
    schemas?: ISchema[];

    /**
     * Allowed sizes for the game.
     */
    sizes?: ISizeSummaries;

    /**
     * The default starting size.
     */
    sizeDefault: string;
}

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export interface IUserWrappr {
    /**
     * The GameStartr instance being wrapped.
     */
    getGameStarter(): GameStartr;

    /**
     * @returns Allowed sizes for the GameStartr.
     */
    getSizes(): ISizeSummaries;

    /**
     * @returns The current GameStartr size.
     */
    getSize(): ISizeSummary;

    /**
     * Resets the GameStartr to the given size.
     * 
     * @param size The size to set, as either its name or settings.
     */
    setSize(size: string | ISizeSummary): void;

    /**
     * Resets the visual aspect of the controls so they are updated with the
     * recently changed values in ItemsHolder.
     */
    resetControls(): void;
}
