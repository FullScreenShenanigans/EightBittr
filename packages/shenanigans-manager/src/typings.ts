interface IDictionary<TValue> {
    [i: string]: TValue;
}

interface INpmPackage {
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
}

/**
 * Schema for package.json contents.
 */
interface IShenanigansPackage extends INpmPackage {
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
     * Whether this is a shenanigans project outside of the EightBittr monorepo.
     */
    external?: boolean;

    /**
     * Customizations around loading the package in browser code.
     */
    loading?: IPackageLoading;

    /**
     * PascalCase name of the project.
     */
    name: string;

    /**
     * Whether to set the package up with an index.html file.
     */
    web?: boolean;
}

/**
 * Customizations around loading the package in browser code.
 */
interface IPackageLoading {
    /**
     * Additional webpack entry points.
     */
    entries?: IEntry[];

    /**
     * Any external script dependencies.
     */
    externals?: IExternal[];
}

/**
 * Additional webpack entry point in a shenanigans schema.
 */
interface IEntry {
    /**
     * Entry file point for webpack.
     */
    entry: string;

    /**
     * Friendly name of the entry point.
     */
    name: string;

    /**
     * Dependencies the generated bundle requires.
     */
    sources: string[];
}

/**
 * Description of an external dependency.
 */
interface IExternal {
    /**
     * Scripts the dependency needs to bring in.
     */
    js: IExternalScripts;

    /**
     * Package name of the dependency.
     */
    name: string;
}

/**
 * Scripts a dependency needs to brig in.
 */
interface IExternalScripts {
    /**
     * Development version of the script.
     */
    dev: string;

    /**
     * Production version of the script, if used in production.
     */
    prod?: string;
}
