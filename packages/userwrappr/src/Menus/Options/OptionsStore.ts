import { ClassNames } from "../../Bootstrapping/ClassNames";
import { Styles } from "../../Bootstrapping/Styles";
import { AbsoluteSizeSchema } from "../../Sizing";
import { MenuTitleStore } from "../MenuTitleStore";
import { ActionStore } from "./ActionStore";
import { OptionSchema, OptionType } from "./OptionSchemas";
import { OptionStoreDependencies } from "./OptionStore";
import { SaveableStore } from "./SaveableStore";

/**
 * Known option store types.
 */
export type OptionStore = ActionStore | SaveableStore;

/**
 * Option store classes, keyed by option type.
 */
type OptionStoreCreators = Record<string, OptionStoreCreator<OptionStore>>;

/**
 * Constructable option store class.
 *
 * @template TOptionStore   Type of the option store class.
 */
type OptionStoreCreator<TOptionStore extends OptionStore> = new (
    dependencies: OptionStoreDependencies
) => TOptionStore;

/**
 * Option store classes, keyed by option type.
 */
const optionStoreCreators: OptionStoreCreators = {
    [OptionType.Action]: ActionStore as OptionStoreCreator<ActionStore>,
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
const createOptionStore = (dependencies: OptionStoreDependencies): OptionStore => {
    return new optionStoreCreators[dependencies.schema.type](dependencies);
};

/**
 * Dependencies to initialize a new OptionsStore.
 */
export interface OptionsStoreDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Size of the bounding container.
     */
    containerSize: AbsoluteSizeSchema;

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
    options: OptionSchema[];

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
 * Stores a list of child options.
 */
export class OptionsStore {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: OptionsStoreDependencies;

    /**
     * Child options.
     */
    private readonly childStores: OptionStore[];

    /**
     * Store for the options' menu title.
     */
    private readonly menuTitleStore: MenuTitleStore;

    /**
     * Initializes a new instance of the OptionsStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: OptionsStoreDependencies) {
        this.dependencies = dependencies;
        this.childStores = dependencies.options.map((schema) =>
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
    public get children(): OptionStore[] {
        return this.childStores;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): ClassNames {
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
    public get containerSize(): AbsoluteSizeSchema {
        return this.dependencies.containerSize;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): Styles {
        return this.dependencies.styles;
    }

    /**
     * Store for the options' menu title.
     */
    public get titleStore(): MenuTitleStore {
        return this.menuTitleStore;
    }
}
