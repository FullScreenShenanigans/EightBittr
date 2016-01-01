// @echo '/// <reference path="DeviceLayr-0.2.0.ts" />'
// @echo '/// <reference path="GamesRunnr-0.2.0.ts" />'
// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'
// @echo '/// <reference path="InputWritr-0.2.0.ts" />'
// @echo '/// <reference path="LevelEditr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/DeviceLayr-0.2.0.ts" />
/// <reference path="References/GamesRunnr-0.2.0.ts" />
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="References/InputWritr-0.2.0.ts" />
/// <reference path="References/LevelEditr-0.2.0.ts" />
/// <reference path="UserWrappr.d.ts" />
/// <reference path="OptionsGenerator.ts" />
/// <reference path="ButtonsGenerator.ts" />
/// <reference path="LevelEditrGenerator.ts" />
/// <reference path="MapsGridGenerator.ts" />
/// <reference path="TableGenerator.ts" />
// @endif

// @include ../Source/UserWrappr.d.ts
// @include OptionsGenerator.ts
// @include ButtonsGenerator.ts
// @include LevelEditrGenerator.ts
// @include MapsGridGenerator.ts
// @include TableGenerator.ts

module UserWrappr {
    "use strict";

    /**
     * A user interface manager made to work on top of GameStartr implementations
     * and provide a configurable HTML display of options.
     */
    export class UserWrappr {
        /**
         * The default list of all allowed keyboard keys.
         */
        private static allPossibleKeys: string[] = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "up", "right", "down", "left", "space", "shift", "ctrl"
        ];

        /**
         * Styles for fancy text in console help messages.
         */
        private static styles: ITextStyles = {
            "code": "color: #000077; font-weight: bold; font-family: Consolas, Courier New, monospace;",
            "comment": "color: #497749; font-style: italic;",
            "head": "font-weight: bold; font-size: 117%;",
            "italic": "font-style: italic;",
            "none": ""
        };

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
         * Help settings specifically for the user interface, obtained from
         * settings.helpSettings.
         */
        private helpSettings: IUIHelpSettings;

        /**
         * What the global object is called (typically "window" for browser 
         * environments and "global" for node-style environments).
         */
        private globalName: string;

        /**
         * What to replace with the name of the game in help text.
         */
        private gameNameAlias: string;

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
        private documentElement: HTMLHtmlElement = <HTMLHtmlElement>document.documentElement;

        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen: () => void = (
            this.documentElement.requestFullScreen
            || this.documentElement.webkitRequestFullScreen
            || this.documentElement.mozRequestFullScreen
            || (<any>this.documentElement).msRequestFullscreen
            || function (): void {
                alert("Not able to request full screen...");
            }
        ).bind(this.documentElement);

        /**
         * A browser-dependent method for request to exit full screen mode.
         */
        private cancelFullScreen: () => void = (
            this.documentElement.cancelFullScreen
            || this.documentElement.webkitCancelFullScreen
            || this.documentElement.mozCancelFullScreen
            || (<any>this.documentElement).msCancelFullScreen
            || function (): void {
                alert("Not able to cancel full screen...");
            }
        ).bind(document);

        /**
         * Initializes a new instance of the UserWrappr class.
         * 
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IUserWrapprSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to UserWrappr.");
            }
            if (typeof settings.GameStartrConstructor === "undefined") {
                throw new Error("No GameStartrConstructor given to UserWrappr.");
            }
            if (typeof settings.helpSettings === "undefined") {
                throw new Error("No helpSettings given to UserWrappr.");
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
            this.helpSettings = this.settings.helpSettings;

            this.sizes = this.importSizes(settings.sizes);

            this.customs = settings.customs || {};
            this.gameNameAlias = settings.helpSettings.globalNameAlias || "{GAME}";
            this.gameElementSelector = settings.gameElementSelector || "#game";
            this.gameControlsSelector = settings.gameControlsSelector || "#controls";
            this.logger = settings.log || console.log.bind(console);

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
        resetGameStarter(settings: IUserWrapprSettings, customs: IGameStartrCustoms = {}): void {
            this.loadGameStarter(this.fixCustoms(customs));

            window[settings.globalName] = this.GameStarter;
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


        /* Simple gets
        */

        /**
         * @returns The GameStartr implementation this is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor {
            return this.GameStartrConstructor;
        }

        /**
         * @returns The GameStartr instance created by GameStartrConstructor.
         */
        getGameStarter(): IGameStartr {
            return this.GameStarter;
        }

        /**
         * @returns The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * @returns The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings {
            return this.settings;
        }

        /**
         * @returns The customs used to construct the IGameStartr.
         */
        getCustoms(): IGameStartrCustoms {
            return this.customs;
        }

        /**
         * @returns The help settings from settings.helpSettings.
         */
        getHelpSettings(): IUIHelpSettings {
            return this.helpSettings;
        }

        /**
         * @returns What the global object is called, such as "window".
         */
        getGlobalName(): string {
            return this.globalName;
        }

        /**
         * @returns What to replace with the name of the game in help text.
         */
        getGameNameAlias(): string {
            return this.gameNameAlias;
        }

        /**
         * @returns All the keys the user is allowed to pick from in UI controls.
         */
        getAllPossibleKeys(): string[] {
            return this.allPossibleKeys;
        }

        /**
         * @returns The allowed sizes for the game.
         */
        getSizes(): ISizeSummaries {
            return this.sizes;
        }

        /**
         * @returns The currently selected size for the game.
         */
        getCurrentSize(): ISizeSummary {
            return this.currentSize;
        }

        /**
         * @returns Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean {
            return this.isFullScreen;
        }

        /**
         * @returns Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean {
            return this.isPageHidden;
        }

        /**
         * @returns A utility Function to log messages, commonly console.log.
         */
        getLogger(): (...args: any[]) => string {
            return this.logger;
        }

        /**
         * @returns Generators used to generate HTML controls for the user.
         */
        getGenerators(): IOptionsGenerators {
            return this.generators;
        }

        /**
         * @returns The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement {
            return this.documentElement;
        }

        /**
         * @returns The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void {
            return this.requestFullScreen;
        }

        /**
         * @returns The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void {
            return this.cancelFullScreen;
        }

        /**
         * @returns The identifier for the device input checking interval.
         */
        getDeviceChecker(): number {
            return this.deviceChecker;
        }


        /* Externally allowed sets
        */

        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         * 
         * @param size The size to set, as a String to retrieve the size from
         *             known info, or a container of settings.
         */
        setCurrentSize(size: string | ISizeSummary): void {
            if (typeof size === "string" || size.constructor === String) {
                if (!this.sizes.hasOwnProperty(<string>size)) {
                    throw new Error("Size " + size + " does not exist on the UserWrappr.");
                }
                size = <ISizeSummary>this.sizes[<string>size];
            }

            this.customs = this.fixCustoms(this.customs);

            if ((<ISizeSummary>size).full) {
                this.requestFullScreen();
                this.isFullScreen = true;
            } else if (this.isFullScreen) {
                this.cancelFullScreen();
                this.isFullScreen = false;
            }

            this.currentSize = <ISizeSummary>size;

            if (this.GameStarter) {
                this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
                this.resetGameStarter(this.settings, this.customs);
            }
        }


        /* Help dialog
        */

        /**
         * Displays the root help menu dialog, which contains all the openings
         * for each help settings opening.
         */
        displayHelpMenu(): void {
            this.helpSettings.openings.forEach(
                (opening: string[]): void => this.logHelpText(opening));
        }

        /**
         * Displays the texts of each help settings options, all surrounded by
         * instructions on how to focus on a group.
         */
        displayHelpOptions(): void {
            this.logHelpText([
                `To focus on a group, enter %c${this.globalName}.UserWrapper.displayHelpOption("<group-name>");%c`,
                "code"
            ]);

            Object.keys(this.helpSettings.options).forEach(
                (key: string): void => this.displayHelpGroupSummary(key));

            this.logHelpText([
                `\nTo focus on a group, enter %c${this.globalName}.UserWrapper.displayHelpOption("<group-name>");%c`,
                "code"
            ]);
        }

        /**
         * Displays the summary for a help group of the given optionName.
         * 
         * @param optionName   The help group to display the summary of.
         */
        displayHelpGroupSummary(optionName: string): void {
            var actions: IHelpOption[] = this.helpSettings.options[optionName],
                action: IHelpOption,
                maxTitleLength: number = 0,
                i: number;

            this.logger(`\r\n%c${optionName}`, UserWrappr.styles.head);

            for (i = 0; i < actions.length; i += 1) {
                maxTitleLength = Math.max(maxTitleLength, this.filterHelpText(actions[i].title).length);
            }

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                this.logger(
                    `%c${this.padTextRight(this.filterHelpText(action.title), maxTitleLength)}%c  // ${action.description}`,
                    UserWrappr.styles.code,
                    UserWrappr.styles.comment);
            }
        }

        /**
         * Displays the full information on a help group of the given optionName.
         * 
         * @param optionName   The help group to display the information of.
         */
        displayHelpOption(optionName: string): void {
            var actions: IHelpOption[] = this.helpSettings.options[optionName],
                action: IHelpOption,
                example: IHelpExample,
                maxExampleLength: number,
                i: number,
                j: number;

            this.logHelpText([`\r\n\r\n%c${optionName}\r\n-------\r\n\r\n`, "head"]);

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                maxExampleLength = 0;

                this.logHelpText([
                    `%c${action.title}%c  ---  ${action.description}`,
                    "head",
                    "italic"
                ]);

                if (action.usage) {
                    this.logHelpText([
                        `%cUsage: %c${action.usage}`,
                        "comment",
                        "code"
                    ]);
                }

                if (action.examples) {
                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];

                        this.logger("\r\n");
                        this.logHelpText([`%c// ${example.comment}`, "comment"]);
                        this.logHelpText([
                            `%c${this.padTextRight(this.filterHelpText(example.code), maxExampleLength)}`,
                            "code"
                        ]);
                    }
                }

                this.logger("\r\n");
            }
        }

        /**
         * Logs a bit of help text, filtered by this.filterHelpText, with ordered styles
         * from `UserWrappr.styles` keyed by name.
         * 
         * @param text   The text to be filtered and logged.
         * @remarks See https://getfirebug.com/wiki/index.php/Console.log for "%c" usage.
         */
        private logHelpText(line: IHelpLine): void {
            if (typeof line === "string") {
                return this.logHelpText([line]);
            }

            var message: string = line[0],
                styles: string[] = (<string[]>line)
                    .slice(1)
                    .filter((style: string): boolean => UserWrappr.styles.hasOwnProperty(style))
                    .map((style: string): string => UserWrappr.styles[style]);

            // A last blank "" style  allows the last "%c" in the message to reset text styles
            this.logger(this.filterHelpText(message), ...styles, "");
        }

        /**
         * Filters a span of help text to replace the game name with its alias. If "%c" isn't
         * in the text, it's added at the end.
         * 
         * @param text The text to filter.
         * @returns The text, with `this.gameNameAlias` replaced by globalName.
         */
        private filterHelpText(textRaw: IHelpLine): string {
            if (textRaw.constructor === Array) {
                return this.filterHelpText(textRaw[0]);
            }

            return (<string>textRaw).replace(new RegExp(this.gameNameAlias, "g"), this.globalName);
        }

        /**
         * Ensures a bit of text is of least a certain length.
         * 
         * @param text   The text to pad.
         * @param length   How wide the text must be, at minimum.
         * @returns The text with spaces padded to the right.
         */
        private padTextRight(text: string, length: number): string {
            var diff: number = 1 + length - text.length;

            if (diff <= 0) {
                return text;
            }

            return text + Array.call(Array, diff).join(" ");
        }

        /* Devices
        */

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


        /* Settings parsing
        */

        /**
         * Creates as a copy of the given sizes with names as members.
         * 
         * @param sizesRaw   The listing of preset sizes to go by.
         * @returns A copy of sizes, with names as members.
         */
        private importSizes(sizesRaw: ISizeSummaries): ISizeSummaries {
            var sizes: ISizeSummaries = this.GameStartrConstructor.prototype.proliferate({}, sizesRaw),
                i: string;

            for (i in sizes) {
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
            var customs: IGameStartrCustoms = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

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


        /* Page visibility
        */

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


        /* Control section loaders
        */

        /**
         * Loads the internal GameStarter, resetting it with the given customs
         * and attaching handlers to document.body and the holder elements.
         * 
         * @param customs   Custom arguments to pass to this.GameStarter.
         */
        private loadGameStarter(customs: IGameStartrCustoms): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameElementSelector);

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
                OptionsButtons: new UISchemas.ButtonsGenerator(this),
                OptionsTable: new UISchemas.TableGenerator(this),
                LevelEditor: new UISchemas.LevelEditorGenerator(this),
                MapsGrid: new UISchemas.MapsGridGenerator(this)
            };
        }

        /**
         * Loads the externally facing UI controls and the internal ItemsHolder,
         * appending the controls to the controls HTML element.
         * 
         * @param schemas   The schemas for each UI control to be made.
         */
        private loadControls(schemas: UISchemas.ISchema[]): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameControlsSelector),
                length: number = schemas.length,
                i: number;

            this.ItemsHolder = new ItemsHoldr.ItemsHoldr({
                "prefix": this.globalName + "::UserWrapper::ItemsHolder"
            });

            section.textContent = "";
            section.className = "length-" + length;

            for (i = 0; i < length; i += 1) {
                section.appendChild(this.loadControlDiv(schemas[i]));
            }
        }

        /** 
         * Creates an individual UI control element based on a UI schema.
         * 
         * @param schemas   The schemas for a UI control to be made.
         * @returns An individual UI control element.
         */
        private loadControlDiv(schema: UISchemas.ISchema): HTMLDivElement {
            var control: HTMLDivElement = document.createElement("div"),
                heading: HTMLHeadingElement = document.createElement("h4"),
                inner: HTMLDivElement = document.createElement("div");

            control.className = "control";
            control.id = "control-" + schema.title;

            heading.textContent = schema.title;

            inner.className = "control-inner";
            inner.appendChild(this.generators[schema.generator].generate(schema));

            control.appendChild(heading);
            control.appendChild(inner);

            // Touch events often propogate to children before the control div has
            // been fully extended. Delaying the "active" attribute fixes that.
            control.onmouseover = function (): void {
                setTimeout(
                    function (): void {
                        control.setAttribute("active", "on");
                    },
                    35);
            };

            control.onmouseout = function (): void {
                control.setAttribute("active", "off");
            };

            return control;
        }
    }
}
