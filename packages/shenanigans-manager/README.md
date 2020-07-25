# shenanigans-manager

[![NPM version](https://badge.fury.io/js/shenanigans-manager.svg)](http://badge.fury.io/js/shenanigans-manager)

Manages locally installed FullScreenShenanigans modules for development.

`shenanigans-manager` is a development dependency of all FullScreenShenanigans modules.
It sets up files that are kept standard across the repositories, such as GitHub templates, `README.md`s, and test infrastructure.

It can also be used as a CLI while developing those modules locally.

## CLI

```cmd
npm install -g shenanigans-manager

shenanigans-manager --help
```

The `shenanigans-manager` CLI provides commands that are often useful for developing multiple modules.
The full list of commands is in `src/Commands`; the common ones are:

-   `generate-tests`: Creates test setup and HTML files for a repository to allow it to run unit tests, which necessitates reading for all `.test.ts?` files in its `src/` directory.
    -   If `--watch` is provided, it'll stay in a watcher mode and continuously recreate those files whenever they're changed on disk.
-   `hydrate`: Creates the shared file segments common to all EightBittr monorepo packages:
    -   `hydrate-package-json`: Copies a few common portions of `package.json`, including its `scripts`.
    -   `hydrate-readme`: Copies the top and bottom portions of `README.md`.
-   `link-packages`: Runs `yarn link` for each package in this monorepo.
-   `publish-if-updated`: Runs `npm publish` _if and only if_ a package's version is different from the newest published version in the npm registry.

### Package Settings

Modules should declare a `"shenanigans"` section in their `package.json`.
It may contain the following keys, out of which only `name` is required:

-   `name`: PascalCase name of the package, such as `"EightBittr"`.
-   `dist`: Whether the package should also include a `dist` command that generates a Webpack-bundled `dist/` directory.
-   `game`: Whether the package's code should be structured as a game inheriting from `EightBittr`.
-   `external`: Whether the package is a standalone repository outside of the EightBittr monorepo.
-   `loading`: Settings for how to prepare the package for browser usage.
    -   `entries`: Any additional Webpack entry points for creating output files.
    -   `externals`: Non-EightBittr dependencies this will need to load before running.
-   `mode`: Either an `"external"` package that exists on its own or an `"internal"` member of this monorepo.
-   `web`: Whether to create a `lib/index.html` file to view the package as an EightBittr game.

See `ShenanigansSchema` in [`src/typings.ts`](./src/typings.ts) for details.
