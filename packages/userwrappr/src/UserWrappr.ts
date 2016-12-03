import { IGameStartrSettings } from "gamestartr/lib/IGameStartr";

import { ButtonsGenerator } from "./Generators/ButtonsGenerator";
import { MapsGridGenerator } from "./Generators/MapsGridGenerator";
import { TableGenerator } from "./Generators/TableGenerator";
import {
    IGameStartr, IGameStartrCreator, IHTMLElement, IOptionsGenerator, IOptionsGenerators,
    ISizeSummaries, ISizeSummary, IUserWrappr, IUserWrapprSettings
} from "./IUserWrappr";
import { ISchema } from "./UISchemas";

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * The default list of all allowed keyboard keys.
     */
    private static allPossibleKeys: string[] = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "up", "right", "down", "left", "space", "shift", "ctrl"
    ];

    /**
     * The GameStartr implementation this is wrapping around.
     */
    private gameStartrCreator: IGameStartrCreator;

    /**
     * The GameStartr instance created by GameStartrConstructor and stored
     * under window.
     */
    private gameStarter: IGameStartr;

    /**
     * The settings used to construct the UserWrappr.
     */
    private settings: IUserWrapprSettings;

    /**
     * Custom arguments to be passed to the GameStartr's modules.
     */
    private customs: any;

    /**
     * All the keys the user is allowed to pick from as key bindings.
     */
    private allPossibleKeys: string[];

    /**
     * The allowed sizes for the game.
     */
    private sizes: ISizeSummaries;

    /**
     * The currently selected size for the game.
     */
    private currentSize: ISizeSummary;

    /**
     * The CSS selector for the HTML element containing GameStarter's container.
     */
    private gameElementSelector: string;

    /**
     * The CSS selector for the HTMl element containing the UI buttons.
     */
    private gameControlsSelector: string;

    /**
     * Whether the game is currently in full screen mode.
     */
    private isFullScreen: boolean;

    /**
     * Whether the page is currently known to be hidden.
     */
    private isPageHidden: boolean;

    /**
     * A utility Function to log messages, commonly console.log.
     */
    private logger: (...args: any[]) => any;

    /**
     * Generators used to generate HTML controls for the user.
     */
    private generators: { [i: string]: IOptionsGenerator };

    /**
     * Identifier for the interval Function checking for device input.
     */
    private deviceChecker: number;

    /**
     * The document element that will contain the game.
     */
    private documentElement: HTMLElement = document.documentElement as any;

    /**
     * A browser-dependent method for request to enter full screen mode.
     */
    private requestFullScreen: () => void = (
        (this.documentElement as IHTMLElement).requestFullScreen
        || (this.documentElement as IHTMLElement).webkitRequestFullScreen
        || (this.documentElement as IHTMLElement).mozRequestFullScreen
        || (this.documentElement as IHTMLElement).msRequestFullscreen
        || ((): void => alert("Not able to request full screen...")));

    /**
     * A browser-dependent method for request to exit full screen mode.
     */
    private cancelFullScreen: () => void = (
        (this.documentElement as IHTMLElement).cancelFullScreen
        || (this.documentElement as IHTMLElement).webkitCancelFullScreen
        || (this.documentElement as IHTMLElement).mozCancelFullScreen
        || (this.documentElement as IHTMLElement).msCancelFullScreen
        || ((): void => alert("Not able to cancel full screen...")));

    /**
     * Initializes a new instance of the UserWrappr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to UserWrappr.");
        }
        if (typeof settings.GameStartrConstructor === "undefined") {
            throw new Error("No GameStartrConstructor given to UserWrappr.");
        }
        if (typeof settings.sizes === "undefined") {
            throw new Error("No sizes given to UserWrappr.");
        }
        if (typeof settings.sizeDefault === "undefined") {
            throw new Error("No sizeDefault given to UserWrappr.");
        }
        if (typeof settings.schemas === "undefined") {
            throw new Error("No schemas given to UserWrappr.");
        }

        this.settings = settings;
        this.gameStartrCreator = settings.GameStartrConstructor;

        this.sizes = this.importSizes(settings.sizes);

        this.customs = settings.gameStarterSettings || {};
        this.gameElementSelector = settings.gameElementSelector || "#game";
        this.gameControlsSelector = settings.gameControlsSelector || "#controls";
        this.logger = settings.logger || console.log.bind(console);

        this.isFullScreen = false;
        this.setCurrentSize(this.sizes[settings.sizeDefault]);

        this.allPossibleKeys = settings.allPossibleKeys || UserWrappr.allPossibleKeys;

        // Size information is also passed to modules via this.customs
        for (const i in this.currentSize) {
            if (this.currentSize.hasOwnProperty(i)) {
                this.customs[i] = (this.currentSize as any)[i];
            }
        }

        this.resetGameStarter(settings, this.customs);
    }

    /**
     * Resets the internal GameStarter by storing it under window, adding
     * InputWritr pipes for input to the page, creating the HTML buttons,
     * and setting additional CSS styles and page visiblity.
     * 
     * @param settings   Settings for the GameStartr constructor.
     * @param settings   Additional settings for sizing information.
     */
    public resetGameStarter(settings: IUserWrapprSettings, customs: any = {}): void {
        this.loadGameStarter(this.fixGameStartrSettings(customs));

        (this.gameStarter as any).UserWrapper = this;

        this.loadGenerators();
        this.resetControls();

        if (settings.styleSheet) {
            this.gameStarter.utilities.addPageStyles(settings.styleSheet);
        }

        this.resetPageVisibilityHandlers();

        this.gameStarter.gameplay.gameStart();

        this.startCheckingDevices();
    }

    /**
     * Resets the visual aspect of the controls so they are updated with the
     * recently changed values in ItemsHolder.
     */
    public resetControls(): void {
        this.loadControls(this.settings.schemas);
    }

    /**
     * @returns The GameStartr implementation this is wrapping around.
     */
    public getGameStartrCreator(): IGameStartrCreator {
        return this.gameStartrCreator;
    }

    /**
     * @returns The GameStartr instance created by GameStartrConstructor.
     */
    public getGameStarter(): IGameStartr {
        return this.gameStarter;
    }

    /**
     * @returns The settings used to construct this UserWrappr.
     */
    public getSettings(): IUserWrapprSettings {
        return this.settings;
    }

    /**
     * @returns The customs used to construct the IGameStartr.
     */
    public getGameStartrSettings(): IGameStartrSettings {
        return this.customs;
    }

    /**
     * @returns All the keys the user is allowed to pick from in UI controls.
     */
    public getAllPossibleKeys(): string[] {
        return this.allPossibleKeys;
    }

    /**
     * @returns The allowed sizes for the game.
     */
    public getSizes(): ISizeSummaries {
        return this.sizes;
    }

    /**
     * @returns The currently selected size for the game.
     */
    public getCurrentSize(): ISizeSummary {
        return this.currentSize;
    }

    /**
     * @returns Whether the game is currently in full screen mode.
     */
    public getIsFullScreen(): boolean {
        return this.isFullScreen;
    }

    /**
     * @returns Whether the page is currently known to be hidden.
     */
    public getIsPageHidden(): boolean {
        return this.isPageHidden;
    }

    /**
     * @returns A utility Function to log messages, commonly console.log.
     */
    public getLogger(): (...args: any[]) => string {
        return this.logger;
    }

    /**
     * @returns Generators used to generate HTML controls for the user.
     */
    public getGenerators(): IOptionsGenerators {
        return this.generators;
    }

    /**
     * @returns The document element that contains the game.
     */
    public getDocumentElement(): HTMLHtmlElement {
        return this.documentElement as HTMLHtmlElement;
    }

    /**
     * @returns The method to request to enter full screen mode.
     */
    public getRequestFullScreen(): () => void {
        return this.requestFullScreen;
    }

    /**
     * @returns The method to request to exit full screen mode.
     */
    public getCancelFullScreen(): () => void {
        return this.cancelFullScreen;
    }

    /**
     * @returns The identifier for the device input checking interval.
     */
    public getDeviceChecker(): number {
        return this.deviceChecker;
    }

    /**
     * Sets the size of the GameStartr by resetting the game with the size
     * information as part of its customs object. Full screen status is
     * changed accordingly.
     * 
     * @param size The size to set, as a String to retrieve the size from
     *             known info, or a container of settings.
     */
    public setCurrentSize(size: string | ISizeSummary): void {
        if (typeof size === "string" || size.constructor === String) {
            if (!this.sizes.hasOwnProperty(size as string)) {
                throw new Error(`Size '${size}' does not exist on the UserWrappr.`);
            }

            size = this.sizes[size as string];
        }

        this.customs = this.fixGameStartrSettings(this.customs);

        if ((size as ISizeSummary).full) {
            this.requestFullScreen();
            this.isFullScreen = true;
        } else if (this.isFullScreen) {
            this.cancelFullScreen();
            this.isFullScreen = false;
        }

        this.currentSize = size as ISizeSummary;

        if (this.gameStarter) {
            this.gameStarter.container.parentNode.removeChild(this.gameStarter.container);
            this.resetGameStarter(this.settings, this.customs);
        }
    }

    /**
     * Starts the checkDevices loop to scan for gamepad status changes.
     */
    private startCheckingDevices(): void {
        this.checkDevices();
    }

    /**
     * Calls the DeviceLayer to check for gamepad triggers, after scheduling
     * another checkDevices call via setTimeout.
     */
    private checkDevices(): void {
        this.deviceChecker = setTimeout(
            this.checkDevices.bind(this),
            this.gameStarter.GamesRunner.getPaused()
                ? 117
                : this.gameStarter.GamesRunner.getInterval() / this.gameStarter.GamesRunner.getSpeed());

        this.gameStarter.DeviceLayer.checkNavigatorGamepads();
        this.gameStarter.DeviceLayer.activateAllGamepadTriggers();
    }

    /**
     * Creates as a copy of the given sizes with names as members.
     * 
     * @param sizesRaw   The listing of preset sizes to go by.
     * @returns A copy of sizes, with names as members.
     */
    private importSizes(sizesRaw: ISizeSummaries): ISizeSummaries {
        const sizes: ISizeSummaries = {};

        for (const i in sizesRaw) {
            if (sizesRaw.hasOwnProperty(i)) {
                sizes[i] = sizesRaw[i];
            }
        }

        for (const i in sizes) {
            if (sizes.hasOwnProperty(i)) {
                sizes[i].name = sizes[i].name || i;
            }
        }

        return sizes;
    }

    /**
     * Creates a copy of the given customs and adjusts sizing information,
     * such as for infinite width or height.
     * 
     * @param settingsRaw   Raw, user-provided customs.
     */
    private fixGameStartrSettings(settingsRaw: IGameStartrSettings): any {
        const settings: IGameStartrSettings = {};

        for (const i in settingsRaw) {
            if (settingsRaw.hasOwnProperty(i)) {
                (settings as any)[i] = (settingsRaw as any)[i];
            }
        }

        for (const i in this.currentSize) {
            if (this.currentSize.hasOwnProperty(i)) {
                (settings as any)[i] = (this.currentSize as any)[i];
            }
        }

        if (!settings.width || !isFinite(settings.width)) {
            settings.width = document.body.clientWidth;
        }

        if (!settings.height || !isFinite(settings.height)) {
            if (settings.full) {
                settings.height = screen.height;
            } else if (this.isFullScreen) {
                // Guess for browser window...
                // @todo Actually compute this!
                settings.height = window.innerHeight - 140;
            } else {
                settings.height = window.innerHeight;
            }
            // 49px from header, 77px from menus
            settings.height -= 126;
        }

        return settings;
    }

    /**
     * Adds a "visibilitychange" handler to the document bound to 
     * this.handleVisibilityChange.
     */
    private resetPageVisibilityHandlers(): void {
        document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
    }

    /**
     * Handles a visibility change event by calling either this.onPageHidden
     * or this.onPageVisible.
     */
    private handleVisibilityChange(): void {
        switch (document.visibilityState) {
            case "hidden":
                this.onPageHidden();
                return;
            case "visible":
                this.onPageVisible();
                return;
            default:
                return;
        }
    }

    /**
     * Reacts to the page becoming hidden by pausing the GameStartr.
     */
    private onPageHidden(): void {
        if (!this.gameStarter.GamesRunner.getPaused()) {
            this.isPageHidden = true;
            this.gameStarter.GamesRunner.pause();
        }
    }

    /**
     * Reacts to the page becoming visible by unpausing the GameStartr.
     */
    private onPageVisible(): void {
        if (this.isPageHidden) {
            this.isPageHidden = false;
            this.gameStarter.GamesRunner.play();
        }
    }

    /**
     * Loads the internal GameStarter, resetting it with the given customs
     * and attaching handlers to document.body and the holder elements.
     * 
     * @param settings   Custom arguments to pass to this.GameStarter.
     */
    private loadGameStarter(gameStartrSettings: IGameStartrSettings): void {
        const section: HTMLElement = document.querySelector(this.gameElementSelector) as HTMLElement;

        if (this.gameStarter) {
            this.gameStarter.GamesRunner.pause();
        }

        this.gameStarter = this.gameStartrCreator(gameStartrSettings);
        (this.gameStarter as any).UserWrapper = this;

        section.textContent = "";
        section.appendChild(this.gameStarter.container);

        this.gameStarter.utilities.proliferate(document.body, {
            onkeydown: this.gameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
            onkeyup: this.gameStarter.InputWriter.makePipe("onkeyup", "keyCode")
        });

        this.gameStarter.utilities.proliferate(section, {
            onmousedown: this.gameStarter.InputWriter.makePipe("onmousedown", "which"),
            oncontextmenu: this.gameStarter.InputWriter.makePipe("oncontextmenu", "", true)
        });
    }

    /**
     * Loads the internal OptionsGenerator instances under this.generators.
     */
    private loadGenerators(): void {
        this.generators = {
            OptionsButtons: new ButtonsGenerator(this),
            OptionsTable: new TableGenerator(this),
            MapsGrid: new MapsGridGenerator(this)
        };
    }

    /**
     * Loads the externally facing UI controls and the internal ItemsHolder,
     * appending the controls to the controls HTML element.
     * 
     * @param schemas   The schemas for each UI control to be made.
     */
    private loadControls(schemas: ISchema[]): void {
        const section: HTMLElement = document.querySelector(this.gameControlsSelector) as HTMLElement;

        section.textContent = "";
        section.className = "length-" + length;

        for (const schema of schemas) {
            section.appendChild(this.loadControlDiv(schema));
        }
    }

    /** 
     * Creates an individual UI control element based on a UI schema.
     * 
     * @param schemas   The schemas for a UI control to be made.
     * @returns An individual UI control element.
     */
    private loadControlDiv(schema: ISchema): HTMLDivElement {
        const control: HTMLDivElement = document.createElement("div");
        const heading: HTMLHeadingElement = document.createElement("h4");
        const inner: HTMLDivElement = document.createElement("div");

        control.className = "control";
        control.id = "control-" + schema.title;

        heading.textContent = schema.title;

        inner.className = "control-inner";
        inner.appendChild(this.generators[schema.generator].generate(schema));

        control.appendChild(heading);
        control.appendChild(inner);

        // Touch events often propogate to children before the control div has
        // been fully extended. Delaying the "active" attribute fixes that.
        control.onmouseover = (): void => {
            setTimeout(
                (): void => control.setAttribute("active", "on"),
                35);
        };

        control.onmouseout = (): void => control.setAttribute("active", "off");

        return control;
    }
}
