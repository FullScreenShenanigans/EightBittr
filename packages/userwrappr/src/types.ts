import { ClassNames } from "./Bootstrapping/ClassNames";
import { CreateElement } from "./Bootstrapping/CreateElement";
import { GetAvailableContainerHeight } from "./Bootstrapping/GetAvailableContainerHeight";
import { Styles } from "./Bootstrapping/Styles";
import { CreateContents } from "./Display";
import { MenuSchema } from "./Menus/MenuSchemas";
import { RelativeSizeSchema } from "./Sizing";

/**
 * Loads external scripts.
 *
 * @param modules   Module identifiers of the scripts.
 * @param onComplete   Handler for load success.
 * @param onError   Handler for load failure.
 */
export type RequireJs = (modules: string[], onComplete: Function, onError: Function) => void;

/**
 * Filled-out optional settings to initialize a new UserWrappr.
 */
export interface OptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Creates a new HTML element.
     */
    createElement: CreateElement;

    /**
     * Initial size to create contents at.
     */
    defaultSize: RelativeSizeSchema;

    /**
     * Gets how much height is available to hold contents.
     */
    getAvailableContainerHeight: GetAvailableContainerHeight;

    /**
     * RequireJS path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside the menus area.
     */
    menus: MenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: Styles;

    /**
     * Loads external scripts.
     */
    requirejs: RequireJs;
}

/**
 * Acceptable optional settings to initialize a new UserWrappr.
 */
export interface PartialOptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: Partial<ClassNames>;

    /**
     * Creates a new HTML element.
     */
    createElement: CreateElement;

    /**
     * Initial size to create a container at.
     */
    defaultSize: RelativeSizeSchema;

    /**
     * Gets how much height is available to size a container.
     */
    getAvailableContainerHeight: GetAvailableContainerHeight;

    /**
     * Require path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside of the container.
     */
    menus: MenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: Partial<Styles>;

    /**
     * Loads external scripts.
     */
    requirejs: RequireJs;
}

/**
 * Required settings to initialize a new UserWrappr.
 */
export interface RequiredUserWrapprSettings {
    /**
     * Creates contents for a size.
     */
    createContents: CreateContents;
}

/**
 * Settings to initialize a new UserWrappr.
 */
export type UserWrapprSettings = Partial<PartialOptionalUserWrapprSettings> &
    RequiredUserWrapprSettings;

/**
 * Filled-out settings to initialize a new UserWrappr.
 */
export type CompleteUserWrapprSettings = OptionalUserWrapprSettings & RequiredUserWrapprSettings;
