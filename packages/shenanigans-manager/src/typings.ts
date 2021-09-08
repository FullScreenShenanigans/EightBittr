interface Dictionary<TValue> {
    [i: string]: TValue;
}

interface NpmPackage {
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
    scripts: Dictionary<string>;
}

/**
 * Schema for package.json contents.
 */
interface ShenanigansPackage extends NpmPackage {
    /**
     * Shenanigans-specific settings for the project.
     */
    shenanigans: ShenanigansSchema;

    [i: string]: string | Dictionary<string> | ShenanigansSchema | undefined;
}

/**
 * Settings for a shenanigans project.
 */
interface ShenanigansSchema {
    /**
     * Whether to include a webpack-bundled dist/ directory.
     */
    dist?: boolean;

    /**
     * Whether to include dependencies to instantiate a EightBittr game.
     */
    game?: boolean;

    /**
     * Whether this is a shenanigans project outside of the EightBittr monorepo.
     */
    external?: boolean;

    /**
     * Customizations around loading the package in browser code.
     */
    loading?: PackageLoading;

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
interface PackageLoading {
    /**
     * Additional webpack entry points.
     */
    entries?: Entry[];

    /**
     * Any external script dependencies.
     */
    externals?: External[];
}

/**
 * Additional webpack entry point in a shenanigans schema.
 */
interface Entry {
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
interface External {
    /**
     * Scripts the dependency needs to bring in.
     */
    js: ExternalScripts;

    /**
     * Package name of the dependency.
     */
    name: string;
}

/**
 * Scripts a dependency needs to brig in.
 */
interface ExternalScripts {
    /**
     * Development version of the script.
     */
    dev: string;

    /**
     * Production version of the script, if used in production.
     */
    prod?: string;
}
