interface IDictionary<TValue> {
    [i: string]: TValue;
}

/**
 * Schema for package.json contents.
 */
interface IShenanigansPackage {
    /**
     * Package dependencies to run in production.
     */
    dependencies?: { [i: string]: string };

    /**
     * Package dependencies to run in development.
     */
    devDependencies?: { [i: string]: string };

    /**
     * Lowercase name of the project.
     */
    name: string;

    /**
     * `npm run`-capable scripts in the project.
     */
    scripts: IDictionary<string>;

    /**
     * Shenanigans-specific settings for the project.
     */
    shenanigans: IShenanigansSchema;

    [i: string]: string | IDictionary<string> | IShenanigansSchema | undefined;
}

/**
 * Settings for a shenanigans project.
 */
interface IShenanigansSchema {
    /**
     * Whether to include a webpack-bundled dist/ directory.
     */
    dist?: boolean;

    /**
     * PascalCase name of the project.
     */
    name: string;
}
