import { IClassNames } from "../../Bootstrapping/ClassNames";
import { IStyles } from "../../Bootstrapping/Styles";
import { IBasicSchema } from "./OptionSchemas";

/**
 * Dependencies to initialize a new OptionStore.
 */
export interface IOptionStoreDependencies<TSchema extends IBasicSchema = IBasicSchema> {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Schema for the option.
     */
    schema: TSchema;

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;
}

/**
 * Store for an option schema.
 *
 * @template TSchema   Type of the schema.
 */
export abstract class OptionStore<TSchema extends IBasicSchema = IBasicSchema> {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IOptionStoreDependencies<TSchema>;

    /**
     * Initializes a new instance of the OptionStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IOptionStoreDependencies<TSchema>) {
        this.dependencies = dependencies;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): IClassNames {
        return this.dependencies.classNames;
    }

    /**
     * Stored option schema.
     */
    public get schema(): Readonly<TSchema> {
        return this.dependencies.schema;
    }

    /**
     * Styles to use for display elements.
     */
    public get styles(): IStyles {
        return this.dependencies.styles;
    }
}
