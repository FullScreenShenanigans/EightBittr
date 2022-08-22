import * as Preact from "preact";

export type JoinObjects<T, U> = {
    [K in keyof T & keyof U]?: T[K] & U[K];
};

/**
 * Styles that can be passed both as a Preact style and a native DOM style.
 */
export type CSSLikeStyles = JoinObjects<Preact.JSX.CSSProperties, Partial<CSSStyleDeclaration>>;

/**
 * Styles to use for display elements.
 */
export interface Styles {
    /**
     * Styles for the content area container.
     */
    contentArea?: CSSLikeStyles;

    /**
     * Styles for input elements.
     */
    input?: CSSLikeStyles;

    /**
     * Styles for input buttons.
     */
    inputButton?: CSSLikeStyles;

    /**
     * Styles for action input buttons.
     */
    inputButtonAction?: CSSLikeStyles;

    /**
     * Styles for boolean input buttons.
     */
    inputButtonBoolean?: CSSLikeStyles;

    /**
     * Styles for link input buttons.
     */
    inputButtonLink?: CSSLikeStyles;

    /**
     * Styles for input buttons in an off state.
     */
    inputButtonOff?: CSSLikeStyles;

    /**
     * Styles for input buttons in an on state.
     */
    inputButtonOn?: CSSLikeStyles;

    /**
     * Styles for select dropdowns.
     */
    inputSelect?: CSSLikeStyles;

    /**
     * Styles for a hidden children container in a menu.
     */
    menuChildrenClosed?: CSSLikeStyles;

    /**
     * Styles for a visible children container in a menu.
     */
    menuChildrenOpen?: CSSLikeStyles;

    /**
     * Styles for each menu.
     */
    menu?: CSSLikeStyles;

    /**
     * Styles for the inner area of the menus container.
     */
    menusInnerArea?: CSSLikeStyles;

    /**
     * Styles for a fake version of inner area of the menus container.
     */
    menusInnerAreaFake?: CSSLikeStyles;

    /**
     * Styles for each menu's title.
     */
    menuTitle?: CSSLikeStyles;

    /**
     * Styles for each menu's title button.
     */
    menuTitleButton?: CSSLikeStyles;

    /**
     * Styles for each menu's faked title button.
     */
    menuTitleButtonFake?: CSSLikeStyles;

    /**
     * Styles for an option's container.
     */
    option?: CSSLikeStyles;

    /**
     * Styles for the left half of a two-part option.
     */
    optionLeft?: CSSLikeStyles;

    /**
     * Styles for the right half of a two-part option.
     */
    optionRight?: CSSLikeStyles;

    /**
     * Styles for a container of options.
     */
    options?: CSSLikeStyles;

    /**
     * Styles for a list of options within its container.
     */
    optionsList?: CSSLikeStyles;
}

/**
 * Default styles to use for display elements.
 */
export const defaultStyles: Styles = {
    contentArea: {
        position: "relative",
    },
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
        paddingLeft: "0",
        overflowY: "auto",
    },
};
