/**
 * Class names to use for display elements.
 */
export interface ClassNames {
    /**
     * Class name for the contents container.
     */
    contentArea: string;

    /**
     * Class name for each menu's div.
     */
    menu: string;

    /**
     * Class name for each menu's children container.
     */
    menuChildren: string;

    /**
     * Class name for the inner area div.
     */
    menusInnerArea: string;

    /**
     * Class name for a faked inner area div.
     */
    menusInnerAreaFake: string;

    /**
     * Class name for the surrounding area div.
     */
    menusOuterArea: string;

    /**
     * Class name for each menu title div.
     */
    menuTitle: string;

    /**
     * Class name for an option's container.
     */
    option: string;

    /**
     * Class name for the left half of a two-part option.
     */
    optionLeft: string;

    /**
     * Class name for the right half of a two-part option.
     */
    optionRight: string;

    /**
     * Class name for each options container div.
     */
    options: string;

    /**
     * Class name for each options list within its container.
     */
    optionsList: string;
}

/**
 * Default class names to use for display elements.
 */
export const defaultClassNames: ClassNames = {
    contentArea: "content-area",
    menu: "menu",
    menuChildren: "menu-children",
    menuTitle: "menu-title",
    menusInnerArea: "menus-inner-area",
    menusInnerAreaFake: "menus-inner-area-fake",
    menusOuterArea: "menus-outer-area",
    option: "option",
    optionLeft: "option-left",
    optionRight: "option-right",
    options: "options",
    optionsList: "options-list",
};
