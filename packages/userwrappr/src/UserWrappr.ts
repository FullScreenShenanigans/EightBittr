/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/LevelEditr.d.ts" />

import { ButtonsGenerator } from "./Generators/ButtonsGenerator";
import { TableGenerator } from "./Generators/TableGenerator";
import { LevelEditorGenerator } from "./Generators/LevelEditrGenerator";
import { MapsGridGenerator } from "./Generators/MapsGridGenerator";
import {
    IGameStartr, IGameStartrConstructor, IGameStartrCustoms, IHTMLElement,
    IOptionsGenerator, IOptionsGenerators, ISizeSummaries, ISizeSummary,
    IUserWrappr, IUserWrapprSettings
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
     * The GameStartr implementation this is wrapping around, such as
     * FullScreenMario or FullScreenPokemon.
     */
    private GameStartrConstructor: IGameStartrConstructor;

    /**
     * The GameStartr instance created by GameStartrConstructor and stored
     * under window.
     */
    private GameStarter: IGameStartr;

    /**
     * A ItemsHoldr used to store UI settings.
     */
    private ItemsHolder: ItemsHoldr.IItemsHoldr;

    /**
     * The settings used to construct the UserWrappr.
     */
    private settings: IUserWrapprSettings;

    /**
     * Custom arguments to be passed to the GameStartr's modules.
     */
    private customs: any;

    /**
     * What the global object is called (typically "window" for browser 
     * environments and "global" for node-style environments).
     */
    private globalName: string;

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
        || function (): void {
            alert("Not able to request full screen...");
        });

    /**
     * A browser-dependent method for request to exit full screen mode.
     */
    private cancelFullScreen: () => void = (
        (this.documentElement as IHTMLElement).cancelFullScreen
        || (this.documentElement as IHTMLElement).webkitCancelFullScreen
        || (this.documentElement as IHTMLElement).mozCancelFullScreen
        || (this.documentElement as IHTMLElement).msCancelFullScreen
        || function (): void {
            alert("Not able to cancel full screen...");
        });

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
        if (typeof settings.globalName === "undefined") {
            throw new Error("No globalName given to UserWrappr.");
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
        this.GameStartrConstructor = settings.GameStartrConstructor;
        this.globalName = settings.globalName;

        this.sizes = this.importSizes(settings.sizes);

        this.customs = settings.customs || {};
        this.gameElementSelector = settings.gameElementSelector || "#game";
        this.gameControlsSelector = settings.gameControlsSelector || "#controls";
        this.logger = settings.logger || console.log.bind(console);

        this.isFullScreen = false;
        this.setCurrentSize(this.sizes[settings.sizeDefault]);

        this.allPossibleKeys = settings.allPossibleKeys || UserWrappr.allPossibleKeys;

        // Size information is also passed to modules via this.customs
        this.GameStartrConstructor.prototype.proliferate(this.customs, this.currentSize, true);

        this.resetGameStarter(settings, this.customs);
    }

    /**
     * Resets the internal GameStarter by storing it under window, adding
     * InputWritr pipes for input to the page, creating the HTML buttons,
     * and setting additional CSS styles and page visiblity.
     * 
     * @param settings   Settings for the GameStartr constructor.
     * @param customs   Additional settings for sizing information.
     */
    public resetGameStarter(settings: IUserWrapprSettings, customs: IGameStartrCustoms = {}): void {
        this.loadGameStarter(this.fixCustoms(customs));

        (window as any)[settings.globalName] = this.GameStarter;
        this.GameStarter.UserWrapper = this;

        this.loadGenerators();
        this.loadControls(settings.schemas);

        if (settings.styleSheet) {
            this.GameStarter.addPageStyles(settings.styleSheet);
        }

        this.resetPageVisibilityHandlers();

        this.GameStarter.gameStart();

        this.startCheckingDevices();
    }

    /**
     * @returns The GameStartr implementation this is wrapping around.
     */
    public getGameStartrConstructor(): IGameStartrConstructor {
        return this.GameStartrConstructor;
    }

    /**
     * @returns The GameStartr instance created by GameStartrConstructor.
     */
    public getGameStarter(): IGameStartr {
        return this.GameStarter;
    }

    /**
     * @returns The ItemsHoldr used to store UI settings.
     */
    public getItemsHolder(): ItemsHoldr.IItemsHoldr {
        return this.ItemsHolder;
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
    public getCustoms(): IGameStartrCustoms {
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

        this.customs = this.fixCustoms(this.customs);

        if ((size as ISizeSummary).full) {
            this.requestFullScreen();
            this.isFullScreen = true;
        } else if (this.isFullScreen) {
            this.cancelFullScreen();
            this.isFullScreen = false;
        }

        this.currentSize = size as ISizeSummary;

        if (this.GameStarter) {
            this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
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
            this.GameStarter.GamesRunner.getPaused()
                ? 117
                : this.GameStarter.GamesRunner.getInterval() / this.GameStarter.GamesRunner.getSpeed());

        this.GameStarter.DeviceLayer.checkNavigatorGamepads();
        this.GameStarter.DeviceLayer.activateAllGamepadTriggers();
    }

    /**
     * Creates as a copy of the given sizes with names as members.
     * 
     * @param sizesRaw   The listing of preset sizes to go by.
     * @returns A copy of sizes, with names as members.
     */
    private importSizes(sizesRaw: ISizeSummaries): ISizeSummaries {
        const sizes: ISizeSummaries = this.GameStartrConstructor.prototype.proliferate({}, sizesRaw);

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
     * @param customsRaw   Raw, user-provided customs.
     */
    private fixCustoms(customsRaw: IGameStartrCustoms): any {
        const customs: IGameStartrCustoms = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

        this.GameStartrConstructor.prototype.proliferate(customs, this.currentSize);

        if (!isFinite(customs.width)) {
            customs.width = document.body.clientWidth;
        }

        if (!isFinite(customs.height)) {
            if (customs.full) {
                customs.height = screen.height;
            } else if (this.isFullScreen) {
                // Guess for browser window...
                // @todo Actually compute this!
                customs.height = window.innerHeight - 140;
            } else {
                customs.height = window.innerHeight;
            }
            // 49px from header, 77px from menus
            customs.height -= 126;
        }

        return customs;
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
        if (!this.GameStarter.GamesRunner.getPaused()) {
            this.isPageHidden = true;
            this.GameStarter.GamesRunner.pause();
        }
    }

    /**
     * Reacts to the page becoming visible by unpausing the GameStartr.
     */
    private onPageVisible(): void {
        if (this.isPageHidden) {
            this.isPageHidden = false;
            this.GameStarter.GamesRunner.play();
        }
    }

    /**
     * Loads the internal GameStarter, resetting it with the given customs
     * and attaching handlers to document.body and the holder elements.
     * 
     * @param customs   Custom arguments to pass to this.GameStarter.
     */
    private loadGameStarter(customs: IGameStartrCustoms): void {
        const section: HTMLElement = document.querySelector(this.gameElementSelector) as HTMLElement;

        if (this.GameStarter) {
            this.GameStarter.GamesRunner.pause();
        }

        this.GameStarter = new this.GameStartrConstructor(customs);

        section.textContent = "";
        section.appendChild(this.GameStarter.container);

        this.GameStarter.proliferate(document.body, {
            "onkeydown": this.GameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
            "onkeyup": this.GameStarter.InputWriter.makePipe("onkeyup", "keyCode")
        });

        this.GameStarter.proliferate(section, {
            "onmousedown": this.GameStarter.InputWriter.makePipe("onmousedown", "which"),
            "oncontextmenu": this.GameStarter.InputWriter.makePipe("oncontextmenu", null, true)
        });
    }

    /**
     * Loads the internal OptionsGenerator instances under this.generators.
     */
    private loadGenerators(): void {
        this.generators = {
            OptionsButtons: new ButtonsGenerator(this),
            OptionsTable: new TableGenerator(this),
            LevelEditor: new LevelEditorGenerator(this),
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

        this.ItemsHolder = new ItemsHoldr.ItemsHoldr({
            "prefix": this.globalName + "::UserWrapper::ItemsHolder"
        });

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
