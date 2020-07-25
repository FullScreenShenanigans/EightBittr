import { action, observable } from "mobx";

import { ClassNames } from "../Bootstrapping/ClassNames";
import { Styles } from "../Bootstrapping/Styles";

import { MenuTitleStore } from "./MenuTitleStore";

/**
 * How a menu should visually behave.
 */
export enum VisualState {
    /**
     * The menu is closed.
     */
    Closed,

    /**
     * The menu open.
     */
    Open,
}

/**
 * Dependencies to initialize a new MenuStore.
 */
export interface MenuStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Styles to use for display elements.
     */
    styles: Styles;

    /**
     * Section title of the menu.
     */
    title: string;
}

/**
 * Backing store for a menu.
 */
export class MenuStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: MenuStoreDependencies;

    /**
     * Store for the menu title.
     */
    private readonly title: MenuTitleStore;

    /**
     * How the menu should visually behave.
     */
    @observable
    private state: VisualState = VisualState.Closed;

    /**
     * Initializes a new instance of the MenuStore class.
     *
     * @param dependencies   Dependencies used for initialization.
     */
    public constructor(dependencies: MenuStoreDependencies) {
        this.dependencies = dependencies;
        this.title = new MenuTitleStore({
            classNames: this.dependencies.classNames,
            onMouseEnter: this.open,
            styles: this.dependencies.styles,
            title: this.dependencies.title,
        });
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): ClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): Styles {
        return this.dependencies.styles;
    }

    /**
     * Store for the menu title.
     */
    public get titleStore(): MenuTitleStore {
        return this.title;
    }

    /**
     * How the menu should visually behave.
     */
    public get visualState(): VisualState {
        return this.state;
    }

    /**
     * Closes the menu if temporarily open.
     */
    @action
    public close = (): void => {
        if (this.state === VisualState.Open) {
            this.state = VisualState.Closed;
        }
    };

    /**
     * Opens the menu to a open state if closed.
     */
    @action
    public open = (): void => {
        if (this.state === VisualState.Closed) {
            this.state = VisualState.Open;
        }
    };
}
