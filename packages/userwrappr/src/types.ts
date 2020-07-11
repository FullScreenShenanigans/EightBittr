import { IClassNames } from "./Bootstrapping/ClassNames";
import { ICreateElement } from "./Bootstrapping/CreateElement";
import { IGetAvailableContainerHeight } from "./Bootstrapping/GetAvailableContainerHeight";
import { IStyles } from "./Bootstrapping/Styles";
import { ICreateContents } from "./Display";
import { IMenuSchema } from "./Menus/MenuSchemas";
import { IRelativeSizeSchema } from "./Sizing";

/**
 * Loads external scripts.
 *
 * @param modules   Module identifiers of the scripts.
 * @param onComplete   Handler for load success.
 * @param onError   Handler for load failure.
 */
export type IRequireJs = (modules: string[], onComplete: Function, onError: Function) => void;

/**
 * Filled-out optional settings to initialize a new UserWrappr.
 */
export interface IOptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Initial size to create contents at.
     */
    defaultSize: IRelativeSizeSchema;

    /**
     * Gets how much height is available to hold contents.
     */
    getAvailableContainerHeight: IGetAvailableContainerHeight;

    /**
     * RequireJS path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside the menus area.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;

    /**
     * Loads external scripts.
     */
    requirejs: IRequireJs;
}

/**
 * Acceptable optional settings to initialize a new UserWrappr.
 */
export interface IPartialOptionalUserWrapprSettings {
    /**
     * Class names to use for display elements.
     */
    classNames: Partial<IClassNames>;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Initial size to create a container at.
     */
    defaultSize: IRelativeSizeSchema;

    /**
     * Gets how much height is available to size a container.
     */
    getAvailableContainerHeight: IGetAvailableContainerHeight;

    /**
     * Require path to the menu initialization script.
     */
    menuInitializer: string;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: Partial<IStyles>;

    /**
     * Loads external scripts.
     */
    requirejs: IRequireJs;
}

/**
 * Required settings to initialize a new UserWrappr.
 */
export interface IRequiredUserWrapprSettings {
    /**
     * Creates contents for a size.
     */
    createContents: ICreateContents;
}

/**
 * Settings to initialize a new UserWrappr.
 */
export type IUserWrapprSettings = Partial<IPartialOptionalUserWrapprSettings> &
    IRequiredUserWrapprSettings;

/**
 * Filled-out settings to initialize a new UserWrappr.
 */
export type ICompleteUserWrapprSettings = IOptionalUserWrapprSettings &
    IRequiredUserWrapprSettings;
