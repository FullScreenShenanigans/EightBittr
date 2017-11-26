import { IClassNames } from "../Bootstrapping/ClassNames";
import { IStyles } from "../Bootstrapping/Styles";

/**
 * Dependencies to initialize a new MenuTitleStore.
 */
export interface IMenuTitleStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Handler for the title being hovered over, if any.
     */
    onMouseEnter?: () => void;

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;

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
    private readonly dependencies: IMenuTitleStoreDependencies;

    /**
     * Initializes a new instance of the MenuTitleStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IMenuTitleStoreDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
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
    public get styles(): IStyles {
        return this.dependencies.styles;
    }

    /**
     * Menu title to display.
     */
    public get title(): string {
        return this.dependencies.title;
    }
}
