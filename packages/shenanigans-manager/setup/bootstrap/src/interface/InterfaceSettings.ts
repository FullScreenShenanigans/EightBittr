{{ #shenanigans.game }}
import { IAbsoluteSizeSchema, IUserWrapprSettings, OptionType } from "userwrappr";

import { {{ shenanigans.name }} } from "../{{ shenanigans.name }}";

/**
 * Global scope around a game, such as a DOM window.
 */
export interface IGameWindow {
    /**
     * Adds an event listener to the window.
     */
    addEventListener: typeof window.addEventListener;

    /**
     * Reference to the window document.
     */
    document: {
        /**
         * Adds an event listener to the document.
         */
        addEventListener: typeof document.addEventListener;
    };
    /**
     * Removes an event listener from the window.
     */
    removeEventListener: typeof window.removeEventListener;
}

export interface IInterfaceSettingOverrides {
    createGame?(size: IAbsoluteSizeSchema): {{ shenanigans.name }};
    gameWindow?: IGameWindow;
}

/**
 * Friendly name of the default game size.
 */
const defaultSize = "Full";

/**
 * Sizes the game is allowed to be, keyed by friendly name.
 */
const sizes = {
    [defaultSize]: {
        width: "100%",
        height: "100%",
    },
};

/**
 * Creates settings for an IUserWrappr that will create and wrap a {{ shenanigans.name }} instance.
 *
 * @param gameWindow   Global scope around the game interface, if not the global window.
 */
export const createUserWrapprSettings = ({
    createGame = (size: IAbsoluteSizeSchema) => new {{ shenanigans.name }}(size),
    gameWindow = window,
}: IInterfaceSettingOverrides = {}): IUserWrapprSettings => {
    /**
     * Game instance, once this has created it.
     */
    let game: {{ shenanigans.name }};

    /**
     * Whether InputWritr pipes have been initialized.
     */
    let initializedPipes = false;

    /**
     * Whether the page is known to be hidden.
     */
    let isPageHidden = false;

    /**
     * Reacts to the page becoming hidden by pausing the EightBittr.
     */
    const onPageHidden = (): void => {
        if (!game.frameTicker.getPaused()) {
            isPageHidden = true;
            game.frameTicker.pause();
        }
    };

    /**
     * Reacts to the page becoming visible by unpausing the EightBittr.
     */
    const onPageVisible = (): void => {
        if (isPageHidden) {
            isPageHidden = false;
            game.frameTicker.play();
        }
    };

    /**
     * Handles a visibility change event by pausing or playing if necessary.
     */
    const handleVisibilityChange = (): void => {
        switch (document.visibilityState) {
            case "hidden":
                onPageHidden();
                return;

            case "visible":
                onPageVisible();
                return;

            default:
                return;
        }
    };

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    const initializePipes = (): void => {
        // gameWindow.addEventListener(
        //     "keydown",
        //     game.inputWriter.makePipe("onkeydown", "keyCode"));

        // gameWindow.addEventListener(
        //     "keyup",
        //     game.inputWriter.makePipe("onkeyup", "keyCode"));

        // gameWindow.addEventListener(
        //     "mousedown",
        //     game.inputWriter.makePipe("onmousedown", "which"));

        // gameWindow.addEventListener(
        //     "contextmenu",
        //     game.inputWriter.makePipe("oncontextmenu", "", true));

        gameWindow.document.addEventListener(
            "visibilitychange",
            handleVisibilityChange);
    };

    return {
        defaultSize: sizes[defaultSize],
        createContents: (size: IAbsoluteSizeSchema) => {
            game = createGame(size);

            if (!initializedPipes) {
                initializePipes();
                initializedPipes = true;
            }

            return game.container;
        },
        menus: [
            {
                options: [
                    {
                        action: (): void => {
                            game.utilities.takeScreenshot(`{{ shenanigans.name }} ${Date.now()}`);
                        },
                        title: "Screenshot",
                        type: OptionType.Action,
                    },
                    {
                        getInitialValue: (): string => "1x",
                        options: [".25x", ".5x", "1x", "2x", "5x", "10x", "20x"],
                        saveValue: (value: string): void => {
                            const multiplier = parseFloat(value.replace("x", ""));
                            game.frameTicker.setInterval((1000 / 60) / multiplier);
                            game.pixelDrawer.setFramerateSkip(multiplier);
                        },
                        title: "Speed",
                        type: OptionType.Select,
                    },
                ],
                title: "Options",
            },
        ],
        styles: {
            input: {
                fontFamily: "Press Start",
                minWidth: "117px",
                padding: "3px",
            },
            inputButton: {
                background: "#ffcc33",
                cursor: "pointer",
                fontFamily: "Press Start",
                padding: "7px 3px",
            },
            inputButtonAction: {
                padding: "11px 3px",
                width: "100%",
            },
            inputButtonBoolean: {
                padding: "7px 21px",
            },
            inputButtonOff: {
                background: "#ccaa33",
            },
            inputSelect: {
                minWidth: "35px",
                padding: "3px 0",
            },
            option: {
                alignItems: "center",
                margin: "auto",
                padding: "7px 0",
                maxWidth: "calc(100% - 14px)",
            },
            options: {
                left: "4px",
                right: "4px",
                width: "auto",
                padding: "4px 3px 7px 3px",
                boxShadow: [
                    "0 3px 7px black inset",
                    "0 0 0 4px #99ccff",
                    "0 0 14px black",
                ].join(", "),
                background: "#005599",
            },
            optionsList: {
                marginBottom: "7px",
            },
            menu: {
                maxWidth: "385px",
                minWidth: "280px",
                padding: "7px",
            },
            menusInnerArea: {
                background: "black",
                color: "white",
                fontFamily: "Press Start",
                transition: "700ms color",
            },
            menusInnerAreaFake: {
                color: "grey",
            },
        },
    };
};
{{ /shenanigans.game }}
