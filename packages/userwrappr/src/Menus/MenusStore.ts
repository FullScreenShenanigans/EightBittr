import { IClassNames } from "../Bootstrapping/ClassNames";
import { IStyles } from "../Bootstrapping/Styles";
import { IAbsoluteSizeSchema } from "../Sizing";
import { IMenuSchema } from "./MenuSchemas";
import { MenuStore } from "./MenuStore";
import { OptionsStore } from "./Options/OptionsStore";

/**
 * Menu and option pairing.
 */
export interface IMenuAndOptionsListStores {
    /**
     * Wrapping menu.
     */
    menu: MenuStore;

    /**
     * Contained options.
     */
    options: OptionsStore;
}

/**
 * Dependencies to initialize a new MenusStore.
 */
export interface IMenusStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Size of the bounding container.
     */
    containerSize: IAbsoluteSizeSchema;

    /**
     * Menu schemas to render.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;
}

export class MenusStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IMenusStoreDependencies;

    /**
     * Stores for each menu and options pairing.
     */
    private readonly childStores: IMenuAndOptionsListStores[];

    /**
     * Initializes a new instance of the MenusStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: IMenusStoreDependencies) {
        this.dependencies = dependencies;

        this.childStores = this.createChildStores();
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Size of the bounding container.
     */
    public get containerSize(): IAbsoluteSizeSchema {
        return this.dependencies.containerSize;
    }

    /**
     * Stores for each menu and options pairing.
     */
    public get menuAndOptionListStores(): IMenuAndOptionsListStores[] {
        return this.childStores;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): IStyles {
        return this.dependencies.styles;
    }

    /**
     * Creates stores for child menus and options.
     *
     * @returns Stores for child menus and options.
     */
    private createChildStores(): IMenuAndOptionsListStores[] {
        const stores: IMenuAndOptionsListStores[] = [];

        for (const menu of this.dependencies.menus) {
            const menuStore = new MenuStore({
                classNames: this.dependencies.classNames,
                styles: this.dependencies.styles,
                title: menu.title
            });

            const optionsStore = new OptionsStore({
                classNames: this.dependencies.classNames,
                containerSize: this.dependencies.containerSize,
                onMouseLeave: menuStore.close,
                onTitleMouseEnter: menuStore.open,
                options: menu.options,
                styles: this.dependencies.styles,
                title: menu.title
            });

            stores.push({
                menu: menuStore,
                options: optionsStore
            });
        }

        return stores;
    }
}
