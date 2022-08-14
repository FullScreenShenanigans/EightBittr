export interface NpmPackage {
    /**
     * Package dependencies to run in production.
     */
    dependencies?: Record<string, string>;

    /**
     * Package dependencies to run in development.
     */
    devDependencies?: Record<string, string>;

    /**
     * Lowercase name of the project.
     */
    name: string;

    /**
     * `npm run`-capable scripts in the project.
     */
    scripts: Record<string, string>;
}

/**
 * Schema for package.json contents.
 */
export interface ShenanigansPackage extends NpmPackage {
    /**
     * Shenanigans-specific settings for the project.
     */
    shenanigans: ShenanigansSchema;

    [i: string]: string | Record<string, string> | ShenanigansSchema | undefined;
}

/**
 * Settings for a shenanigans project.
 */
export interface ShenanigansSchema {
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
export interface PackageLoading {
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
export interface Entry {
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
export interface External {
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
export interface ExternalScripts {
    /**
     * Development version of the script.
     */
    dev: string;

    /**
     * Production version of the script, if used in production.
     */
    prod?: string;
}
