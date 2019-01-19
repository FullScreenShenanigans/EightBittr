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
     * Additional webpack entry points.
     */
    entries?: IEntry[];

    /**
     * Any external script dependencies.
     */
    externals?: IExternal[];

    /**
     * PascalCase name of the project.
     */
    name: string;

    /**
     * Whether to include the maps task group.
     */
    maps?: true;

    /**
     * Settings for the web task group, if included.
     */
    web?: IWebTaskGroup;
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

/**
 * Settings for the web task group.
 */
interface IWebTaskGroup {
    /**
     * Public URL for the project site.
     */
    url: string;

    /**
     * Paragraphs of text below the game.
     */
    sections: {
        /**
         * Credits to owners and community contributors to the original game.
         */
        credits: string[];

        /**
         * Brief explanation of this project.
         */
        explanation: string[];

        /**
         * Legal disclosure about project ownership.
         */
        legal: string;
    };
}
