import { ClassNames } from "../../Bootstrapping/ClassNames";
import { Styles } from "../../Bootstrapping/Styles";
import { BasicSchema } from "./OptionSchemas";

/**
 * Dependencies to initialize a new OptionStore.
 */
export interface OptionStoreDependencies<TSchema extends BasicSchema = BasicSchema> {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Schema for the option.
     */
    schema: TSchema;

    /**
     * Styles to use for display elements.
     */
    styles: Styles;
}

/**
 * Store for an option schema.
 *
 * @template TSchema   Type of the schema.
 */
export abstract class OptionStore<TSchema extends BasicSchema = BasicSchema> {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: OptionStoreDependencies<TSchema>;

    /**
     * Initializes a new instance of the OptionStore class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: OptionStoreDependencies<TSchema>) {
        this.dependencies = dependencies;
    }

    /**
     * Class names to use for display elements.
     */
    public get classNames(): ClassNames {
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
    public get styles(): Styles {
        return this.dependencies.styles;
    }
}
