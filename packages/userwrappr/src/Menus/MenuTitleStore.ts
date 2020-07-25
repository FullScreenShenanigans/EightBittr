import { ClassNames } from "../Bootstrapping/ClassNames";
import { Styles } from "../Bootstrapping/Styles";

/**
 * Handler for a title being hovered over.
 */
export type OnMenuTitleMouseEnter = () => void;

/**
 * Dependencies to initialize a new MenuTitleStore.
 */
export interface MenuTitleStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Handler for the title being hovered over, if any.
     */
    onMouseEnter?: OnMenuTitleMouseEnter;

    /**
     * Styles to use for display elements.
     */
    styles: Styles;

    /**
     * Menu title to display.
     */
    title: string;
}

/**
 * Store for a menu title.
 */
export class MenuTitleStore {
    /**
     * Dependencies to be used for initialization.
     */
    private readonly dependencies: MenuTitleStoreDependencies;

    /**
     * Initializes a new instance of the MenuTitleStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: MenuTitleStoreDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): ClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Handler for the title being hovered over, if any.
     */
    public get onMouseEnter(): (() => void) | undefined {
        return this.dependencies.onMouseEnter;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): Styles {
        return this.dependencies.styles;
    }

    /**
     * Menu title to display.
     */
    public get title(): string {
        return this.dependencies.title;
    }
}
