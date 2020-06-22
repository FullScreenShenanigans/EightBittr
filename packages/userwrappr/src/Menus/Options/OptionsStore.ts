import { IClassNames } from "../../Bootstrapping/ClassNames";
import { IStyles } from "../../Bootstrapping/Styles";
import { IAbsoluteSizeSchema } from "../../Sizing";
import { MenuTitleStore } from "../MenuTitleStore";

import { ActionStore } from "./ActionStore";
import { IOptionSchema, OptionType } from "./OptionSchemas";
import { IOptionStoreDependencies } from "./OptionStore";
import { SaveableStore } from "./SaveableStore";

/**
 * Known option store types.
 */
export type IOptionStore = ActionStore | SaveableStore;

/**
 * Option store classes, keyed by option type.
 */
interface IOptionStoreCreators {
    [i: string /* OptionType */]: IOptionStoreCreator<IOptionStore>;
}

/**
 * Constructable option store class.
 *
 * @template TOptionStore   Type of the option store class.
 */
type IOptionStoreCreator<TOptionStore extends IOptionStore> = new (
    dependencies: IOptionStoreDependencies
) => TOptionStore;

/**
 * Option store classes, keyed by option type.
 */
const optionStoreCreators: IOptionStoreCreators = {
    [OptionType.Action]: ActionStore as IOptionStoreCreator<ActionStore>,
    [OptionType.Boolean]: SaveableStore,
    [OptionType.MultiSelect]: SaveableStore,
    [OptionType.Number]: SaveableStore,
    [OptionType.Select]: SaveableStore,
    [OptionType.String]: SaveableStore,
};

/**
 * Creates an option store for its schema.
 *
 * @param dependencies   Dependencies for the option store.
 * @returns Store for the option.
 */
const createOptionStore = (
    dependencies: IOptionStoreDependencies
): IOptionStore => {
    const { schema } = dependencies;
    const creator: IOptionStoreCreator<IOptionStore> | undefined =
        optionStoreCreators[schema.type];

    if (creator === undefined) {
        throw new Error(`Unknown option type: ${schema.type}`);
    }

    return new optionStoreCreators[schema.type](dependencies);
};

/**
 * Dependencies to initialize a new OptionsStore.
 */
export interface IOptionsStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Size of the bounding container.
     */
    containerSize: IAbsoluteSizeSchema;

    /**
     * Handler for the mouse moving out of the menu.
     */
    onMouseLeave(): void;

    /**
     * Handler for the mouse moving onto the menu title.
     */
    onTitleMouseEnter(): void;

    /**
     * Schemas for each option.
     */
    options: IOptionSchema[];

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
 * Stores a list of child options.
 */
export class OptionsStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IOptionsStoreDependencies;

    /**
     * Child options.
     */
    private readonly childStores: IOptionStore[];

    /**
     * Store for the options' menu title.
     */
    private readonly menuTitleStore: MenuTitleStore;

    /**
     * Initializes a new instance of the OptionsStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IOptionsStoreDependencies) {
        this.dependencies = dependencies;
        this.childStores = dependencies.options.map(
            (schema: IOptionSchema): IOptionStore =>
                createOptionStore({
                    classNames: this.dependencies.classNames,
                    schema,
                    styles: this.dependencies.styles,
                })
        );
        this.menuTitleStore = new MenuTitleStore({
            classNames: this.dependencies.classNames,
            onMouseEnter: this.dependencies.onTitleMouseEnter,
            styles: this.dependencies.styles,
            title: this.dependencies.title,
        });
    }

    /**
     * Child options.
     */
    public get children(): IOptionStore[] {
        return this.childStores;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Handler for the menu title being no longer hovered over.
     */
    public get onMouseLeave(): () => void {
        return this.dependencies.onMouseLeave;
    }

    /**
     * Size of the bounding container.
     */
    public get containerSize(): IAbsoluteSizeSchema {
        return this.dependencies.containerSize;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): IStyles {
        return this.dependencies.styles;
    }

    /**
     * Store for the options' menu title.
     */
    public get titleStore(): MenuTitleStore {
        return this.menuTitleStore;
    }
}
