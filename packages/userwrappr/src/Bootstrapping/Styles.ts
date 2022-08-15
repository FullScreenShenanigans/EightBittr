import * as Preact from "preact";

/**
 * String styles that work for Preact's CSS styles.
 */
export type PreactCSSProperties = Partial<{
    [K in keyof Omit<Preact.JSX.CSSProperties, "length">]: Exclude<
        Preact.JSX.CSSProperties[K],
        number | null
    >;
}>;

/**
 * Styles to use for display elements.
 */
export interface Styles {
    /**
     * Styles for the content area container.
     */
    contentArea?: PreactCSSProperties;

    /**
     * Styles for input elements.
     */
    input?: PreactCSSProperties;

    /**
     * Styles for input buttons.
     */
    inputButton?: PreactCSSProperties;

    /**
     * Styles for action input buttons.
     */
    inputButtonAction?: PreactCSSProperties;

    /**
     * Styles for boolean input buttons.
     */
    inputButtonBoolean?: PreactCSSProperties;

    /**
     * Styles for input buttons in an off state.
     */
    inputButtonOff?: PreactCSSProperties;

    /**
     * Styles for input buttons in an on state.
     */
    inputButtonOn?: PreactCSSProperties;

    /**
     * Styles for select dropdowns.
     */
    inputSelect?: PreactCSSProperties;

    /**
     * Styles for a hidden children container in a menu.
     */
    menuChildrenClosed?: PreactCSSProperties;

    /**
     * Styles for a visible children container in a menu.
     */
    menuChildrenOpen?: PreactCSSProperties;

    /**
     * Styles for each menu.
     */
    menu?: PreactCSSProperties;

    /**
     * Styles for the inner area of the menus container.
     */
    menusInnerArea?: PreactCSSProperties;

    /**
     * Styles for a fake version of inner area of the menus container.
     */
    menusInnerAreaFake?: PreactCSSProperties;

    /**
     * Styles for each menu's title.
     */
    menuTitle?: PreactCSSProperties;

    /**
     * Styles for each menu's title button.
     */
    menuTitleButton?: PreactCSSProperties;

    /**
     * Styles for each menu's faked title button.
     */
    menuTitleButtonFake?: PreactCSSProperties;

    /**
     * Styles for an option's container.
     */
    option?: PreactCSSProperties;

    /**
     * Styles for the left half of a two-part option.
     */
    optionLeft?: PreactCSSProperties;

    /**
     * Styles for the right half of a two-part option.
     */
    optionRight?: PreactCSSProperties;

    /**
     * Styles for a container of options.
     */
    options?: PreactCSSProperties;

    /**
     * Styles for a list of options within its container.
     */
    optionsList?: PreactCSSProperties;
}

/**
 * Default styles to use for display elements.
 */
export const defaultStyles: Styles = {
    contentArea: {
        position: "relative",
    },
    input: {},
    inputButton: {
        cursor: "pointer",
    },
    menu: {
        flex: "1",
        position: "relative",
        textAlign: "center",
    },
    menuChildrenClosed: {
        display: "none",
    },
    menuTitle: {
        cursor: "default",
        display: "inline-block",
        margin: "0",
        padding: "3px 21px",
        position: "relative",
        zIndex: "1" as any,
    },
    menuTitleButton: {
        cursor: "pointer",
    },
    menuTitleButtonFake: {
        cursor: "wait",
    },
    menusInnerArea: {
        alignItems: "stretch",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    option: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    optionLeft: {
        width: "50%",
    },
    optionRight: {
        width: "50%",
    },
    options: {
        bottom: "7px",
        position: "absolute",
        width: "100%",
    },
    optionsList: {
        overflowY: "auto",
    },
};
