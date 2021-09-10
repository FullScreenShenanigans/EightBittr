/**
 * Styles that work for both raw CSS styles and React CSS properties.
 */
export type StyleDeclaration = CSSStyleDeclaration & React.CSSProperties;

/**
 * Styles to use for display elements.
 */
export interface Styles {
    /**
     * Styles for the content area container.
     */
    contentArea?: Partial<StyleDeclaration>;

    /**
     * Styles for input elements.
     */
    input?: Partial<StyleDeclaration>;

    /**
     * Styles for input buttons.
     */
    inputButton?: Partial<StyleDeclaration>;

    /**
     * Styles for action input buttons.
     */
    inputButtonAction?: Partial<StyleDeclaration>;

    /**
     * Styles for boolean input buttons.
     */
    inputButtonBoolean?: Partial<StyleDeclaration>;

    /**
     * Styles for input buttons in an off state.
     */
    inputButtonOff?: Partial<StyleDeclaration>;

    /**
     * Styles for input buttons in an on state.
     */
    inputButtonOn?: Partial<StyleDeclaration>;

    /**
     * Styles for select dropdowns.
     */
    inputSelect?: Partial<StyleDeclaration>;

    /**
     * Styles for a hidden children container in a menu.
     */
    menuChildrenClosed?: Partial<StyleDeclaration>;

    /**
     * Styles for a visible children container in a menu.
     */
    menuChildrenOpen?: Partial<StyleDeclaration>;

    /**
     * Styles for each menu.
     */
    menu?: Partial<StyleDeclaration>;

    /**
     * Styles for the inner area of the menus container.
     */
    menusInnerArea?: Partial<StyleDeclaration>;

    /**
     * Styles for a fake version of inner area of the menus container.
     */
    menusInnerAreaFake?: Partial<StyleDeclaration>;

    /**
     * Styles for each menu's title.
     */
    menuTitle?: Partial<StyleDeclaration>;

    /**
     * Styles for each menu's title button.
     */
    menuTitleButton?: Partial<StyleDeclaration>;

    /**
     * Styles for each menu's faked title button.
     */
    menuTitleButtonFake?: Partial<StyleDeclaration>;

    /**
     * Styles for an option's container.
     */
    option?: Partial<StyleDeclaration>;

    /**
     * Styles for the left half of a two-part option.
     */
    optionLeft?: Partial<StyleDeclaration>;

    /**
     * Styles for the right half of a two-part option.
     */
    optionRight?: Partial<StyleDeclaration>;

    /**
     * Styles for a container of options.
     */
    options?: Partial<StyleDeclaration>;

    /**
     * Styles for a list of options within its container.
     */
    optionsList?: Partial<StyleDeclaration>;
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
