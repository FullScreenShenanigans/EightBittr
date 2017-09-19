import { GameStartr } from "gamestartr/lib/GameStartr";

import { ButtonsGenerator } from "./Generators/ButtonsGenerator";
import { MapsGridGenerator } from "./Generators/MapsGridGenerator";
import { TableGenerator } from "./Generators/TableGenerator";
import {
    IHTMLElement, IOptionsGenerators,
    ISizeSummaries, ISizeSummary, IUserWrappr, IUserWrapprSettings
} from "./IUserWrappr";
import { ISchema } from "./UISchemas";

/**
 * A user interface wrapper for configurable HTML displays over GameStartr games.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * Keys that may be assigned input pipes.
     */
    public static allPossibleKeys: string[] = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "up", "right", "down", "left", "space", "shift", "ctrl", "enter",
        "escape", "backspace"
    ];

    /**
     * The GameStartr instance being wrapped.
     */
    private gameStarter: GameStartr;

    /**
     * The settings used to construct the UserWrappr.
     */
    private settings: IUserWrapprSettings;

    /**
     * The allowed sizes for the game.
     */
    private sizes: ISizeSummaries;

    /**
     * The currently selected size for the game.
     */
    private size: ISizeSummary;

    /**
     * Whether the game is currently in full screen mode.
     */
    private isFullScreen: boolean;

    /**
     * Whether the page is currently known to be hidden.
     */
    private isPageHidden: boolean;

    /**
     * Identifier for the interval Function checking for device input.
     */
    private deviceChecker: number;

    /**
     * Generators used to generate HTML controls for the user.
     */
    private generators: IOptionsGenerators = {
        OptionsButtons: new ButtonsGenerator(this),
        OptionsTable: new TableGenerator(this),
        MapsGrid: new MapsGridGenerator(this)
    };

    /**
     * The document element that will contain the game.
     */
    private document: HTMLElement = document.documentElement as any;

    /**
     * A browser-dependent method for request to enter full screen mode.
     */
    private requestFullScreen: () => void = (
        (this.document as IHTMLElement).requestFullScreen
        || (this.document as IHTMLElement).webkitRequestFullScreen
        || (this.document as IHTMLElement).mozRequestFullScreen
        || (this.document as IHTMLElement).msRequestFullscreen
        || ((): void => alert("Not able to request full screen...")));

    /**
     * A browser-dependent method for request to exit full screen mode.
     */
    private cancelFullScreen: () => void = (
        (this.document as IHTMLElement).cancelFullScreen
        || (this.document as IHTMLElement).webkitCancelFullScreen
        || (this.document as IHTMLElement).mozCancelFullScreen
        || (this.document as IHTMLElement).msCancelFullScreen
        || ((): void => alert("Not able to cancel full screen...")));

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = settings;
        this.gameStarter = settings.gameStarter;

        this.sizes = this.importSizes(settings.sizes || {});
        this.size = this.sizes[settings.sizeDefault];
        this.isFullScreen = false;

        this.resetControls();

        window.addEventListener(
            "keydown",
            this.gameStarter.inputWriter.makePipe("onkeydown", "keyCode"));

        window.addEventListener(
            "keyup",
            this.gameStarter.inputWriter.makePipe("onkeyup", "keyCode"));

        window.addEventListener(
            "mousedown",
            this.gameStarter.inputWriter.makePipe("onmousedown", "which"));

        window.addEventListener(
            "contextmenu",
            this.gameStarter.inputWriter.makePipe("oncontextmenu", "", true));

        this.document.addEventListener(
            "visibilitychange",
            (): void => this.handleVisibilityChange());

        this.checkDevices();
    }

    /**
     * @returns The GameStartr instance being wrapped.
     */
    public getGameStarter(): GameStartr {
        return this.gameStarter;
    }

    /**
     * @returns Allowed sizes for the GameStartr.
     */
    public getSizes(): ISizeSummaries {
        return this.sizes;
    }

    /**
     * @returns The current GameStartr size.
     */
    public getSize(): ISizeSummary {
        return this.size;
    }

    /**
     * Resets the GameStartr to the given size.
     *
     * @param size The size to set, as either its name or settings.
     */
    public setSize(size: string | ISizeSummary): void {
        if (typeof size === "string") {
            if (!this.sizes[size]) {
                throw new Error(`Size '${size}' does not exist on the UserWrappr.`);
            }

            // tslint:disable-next-line:no-parameter-reassignment
            size = this.sizes[size];
        }

        if (size.full) {
            this.requestFullScreen();
            this.isFullScreen = true;
        } else if (this.isFullScreen) {
            this.cancelFullScreen();
            this.isFullScreen = false;
        }

        this.size = size;

        if (this.gameStarter) {
            this.gameStarter.reset(this.size);
        }
    }

    /**
     * Resets the visual aspect of the controls so they are updated with the
     * recently changed values in ItemsHolder.
     */
    public resetControls(): void {
        const previousControls: HTMLElement | null = this.gameStarter.container.querySelector("section");
        if (previousControls) {
            this.gameStarter.container.removeChild(previousControls);
        }

        this.gameStarter.container.appendChild(this.createControlsContainer(this.settings.schemas || []));
    }

    /**
     * Calls the DeviceLayer to check for gamepad triggers, after scheduling
     * another checkDevices call via setTimeout.
     */
    private checkDevices(): void {
        this.deviceChecker = setTimeout(
            this.checkDevices.bind(this),
            this.gameStarter.gamesRunner.getPaused()
                ? 117
                : this.gameStarter.gamesRunner.getInterval() / this.gameStarter.gamesRunner.getSpeed());

        this.gameStarter.deviceLayer.checkNavigatorGamepads();
        this.gameStarter.deviceLayer.activateAllGamepadTriggers();
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
        if (!this.gameStarter.gamesRunner.getPaused()) {
            this.isPageHidden = true;
            this.gameStarter.gamesRunner.pause();
        }
    }

    /**
     * Reacts to the page becoming visible by unpausing the GameStartr.
     */
    private onPageVisible(): void {
        if (this.isPageHidden) {
            this.isPageHidden = false;
            this.gameStarter.gamesRunner.play();
        }
    }

    /**
     * Loads the externally facing UI controls and the internal ItemsHolder,
     * appending the controls to the controls HTML element.
     *
     * @param schemas   The schemas for each UI control to be made.
     */
    private createControlsContainer(schemas: ISchema[]): HTMLElement {
        const section: HTMLElement = document.createElement("section");

        section.className = "controls length-" + schemas.length;
        section.textContent = "";

        for (const schema of schemas) {
            section.appendChild(this.createControlDiv(schema));
        }

        return section;
    }

    /**
     * Creates an individual UI control element based on a UI schema.
     *
     * @param schemas   The schemas for a UI control to be made.
     * @returns An individual UI control element.
     */
    private createControlDiv(schema: ISchema): HTMLDivElement {
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
