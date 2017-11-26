/**
 * Styles to use for display elements.
 */
export interface IStyles {
    /**
     * Styles for the content area container.
     */
    contentArea: Partial<CSSStyleDeclaration>;

    /**
     * Styles for input elements.
     */
    input: Partial<CSSStyleDeclaration>;

    /**
     * Styles for input buttons.
     */
    inputButton: Partial<CSSStyleDeclaration>;

    /**
     * Styles for action input buttons.
     */
    inputButtonAction: Partial<CSSStyleDeclaration>;

    /**
     * Styles for boolean input buttons.
     */
    inputButtonBoolean: Partial<CSSStyleDeclaration>;

    /**
     * Styles for input buttons in an off state.
     */
    inputButtonOff: Partial<CSSStyleDeclaration>;

    /**
     * Styles for input buttons in an on state.
     */
    inputButtonOn: Partial<CSSStyleDeclaration>;

    /**
     * Styles for select dropdowns.
     */
    inputSelect: Partial<CSSStyleDeclaration>;

    /**
     * Styles for a hidden children container in a menu.
     */
    menuChildrenClosed: Partial<CSSStyleDeclaration>;

    /**
     * Styles for a visible children container in a menu.
     */
    menuChildrenOpen: Partial<CSSStyleDeclaration>;

    /**
     * Styles for each menu.
     */
    menu: Partial<CSSStyleDeclaration>;

    /**
     * Styles for the inner area of the menus container.
     */
    menusInnerArea: Partial<CSSStyleDeclaration>;

    /**
     * Styles for a fake version of inner area of the menus container.
     */
    menusInnerAreaFake: Partial<CSSStyleDeclaration>;

    /**
     * Styles for each menu's title.
     */
    menuTitle: Partial<CSSStyleDeclaration>;

    /**
     * Styles for an option's container.
     */
    option: Partial<CSSStyleDeclaration>;

    /**
     * Styles for the left half of a two-part option.
     */
    optionLeft: Partial<CSSStyleDeclaration>;

    /**
     * Styles for the right half of a two-part option.
     */
    optionRight: Partial<CSSStyleDeclaration>;

    /**
     * Styles for a container of options.
     */
    options: Partial<CSSStyleDeclaration>;

    /**
     * Styles for a list of options within its container.
     */
    optionsList: Partial<CSSStyleDeclaration>;
}

/**
 * Default styles to use for display elements.
 */
export const defaultStyles: IStyles = {
    contentArea: {
        position: "relative"
    },
    menusInnerArea: {
        alignItems: "stretch",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    menusInnerAreaFake: {},
    input: {},
    inputButton: {},
    inputButtonAction: {},
    inputButtonBoolean: {},
    inputButtonOff: {},
    inputButtonOn: {},
    inputSelect: {},
    menuChildrenOpen: {},
    menuChildrenClosed: {
        display: "none"
    },
    menu: {
        flex: "1",
        position: "relative",
        textAlign: "center"
    },
    menuTitle: {
        cursor: "default",
        display: "inline-block",
        margin: "0",
        padding: "3px 21px"
    },
    option: {
        display: "flex",
        flexDirection: "row",
        flexGrow: "0",
        flexWrap: "wrap"
    },
    optionLeft: {
        flexGrow: "1",
        width: "50%"
    },
    optionRight: {
        flexGrow: "1",
        width: "50%"
    },
    options: {
        bottom: "0",
        position: "absolute",
        width: "100%"
    },
    optionsList: {
        overflowY: "auto"
    }
};
