import { ClassNames } from "../Bootstrapping/ClassNames";
import { Styles } from "../Bootstrapping/Styles";
import { AbsoluteSizeSchema } from "../Sizing";
import { MenuSchema } from "./MenuSchemas";
import { MenuStore } from "./MenuStore";
import { OptionsStore } from "./Options/OptionsStore";

/**
 * Menu and option pairing.
 */
export interface MenuAndOptionsListStores {
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
export interface MenusStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Size of the bounding container.
     */
    containerSize: AbsoluteSizeSchema;

    /**
     * Menu schemas to render.
     */
    menus: MenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: Styles;
}

export class MenusStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: MenusStoreDependencies;

    /**
     * Stores for each menu and options pairing.
     */
    private readonly childStores: MenuAndOptionsListStores[];

    /**
     * Initializes a new instance of the MenusStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: MenusStoreDependencies) {
        this.dependencies = dependencies;

        this.childStores = this.createChildStores();
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): ClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Size of the bounding container.
     */
    public get containerSize(): AbsoluteSizeSchema {
        return this.dependencies.containerSize;
    }

    /**
     * Stores for each menu and options pairing.
     */
    public get menuAndOptionListStores(): MenuAndOptionsListStores[] {
        return this.childStores;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): Styles {
        return this.dependencies.styles;
    }

    /**
     * Creates stores for child menus and options.
     *
     * @returns Stores for child menus and options.
     */
    private createChildStores(): MenuAndOptionsListStores[] {
        const stores: MenuAndOptionsListStores[] = [];

        for (const menu of this.dependencies.menus) {
            const menuStore = new MenuStore({
                classNames: this.dependencies.classNames,
                styles: this.dependencies.styles,
                title: menu.title,
            });

            const optionsStore = new OptionsStore({
                classNames: this.dependencies.classNames,
                containerSize: this.dependencies.containerSize,
                onMouseLeave: menuStore.close,
                onTitleMouseEnter: menuStore.open,
                options: menu.options,
                styles: this.dependencies.styles,
                title: menu.title,
            });

            stores.push({
                menu: menuStore,
                options: optionsStore,
            });
        }

        return stores;
    }
}
