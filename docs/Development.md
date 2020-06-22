# Development

> Requires [Node 12+](https://nodejs.org/en) and [Yarn](https://yarnpkg.com).

EightBittr development is managed using a few popular web technologies you'll want to be at least a little familiar with:

-   [Lerna](https://lerna.js.org): A tool for managing JavaScript projects with multiple packages.
-   [Mocha](https://mochajs.org): The simple, fun, flexible JavaScript testing framework.
-   [TypeScript](https://typescriptlang.org): Like JavaScript, but with glorious type declarations.
-   [Yarn](https://yarnpkg.com): A package manager with great performance and project linking.

## Setup

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo), you'll want to clone it, install dependencies, and prepare its packages for development:

```cmd
git clone https://github.com/<your-name>/EightBittr
cd EightBittr
yarn
yarn lerna bootstrap
yarn run hydrate
```

The following common commands from [`package.json`](../package.json) can be run from the repository root to work across all packages:

-   `compile`: Builds [TypeScript](https://typescriptlang.org) source files in `src/` into JavaScript files in `lib/`.
-   `format`: Runs [Prettier](https://prettier.io) to flag incorrectly formatted source files.
    -   `format:write`: Fixes those source files for you.
-   `lint`: Runs [ESLint](https://eslint.org) on source files to find linting complaints.
-   `test`: Rebuilds all packages' test infrastructures and runs their tests.
-   `verify`: Does all of the above.

### `shenanigans-manager`

You may notice some commands use the `shenanigans-manager` package, a utility package included in this monorepo.
It automates useful commands common to packages here, such as scaffolding package scripts and shared documentation.
See its docs in [packages/shenanigans-manager](../packages/shenanigans-manager/README.md).

## Local Linking

If you're developing a game that uses EightBittr and would like to use your local EightBittr monorepo for its npm packages, you can do so in two steps:

1. From this repository, make all packages globally available using [Yarn link](https://classic.yarnpkg.com/en/docs/cli/link) to set up [symlinks](https://en.wikipedia.org/wiki/Symbolic_link):

    ```cmd
    yarn run link
    ```

2. From the game's repository, point its `node_modules/` to those global symlinks using `shenanigans-manager`'s `link-packages` command:

    ```cmd
    yarn shenanigans-manager link-packages
    ```
