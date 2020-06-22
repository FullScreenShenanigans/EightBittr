<!-- Top -->
# EightBittr

[![NPM version](https://badge.fury.io/js/eightbittr.svg)](http://badge.fury.io/js/eightbittr)

Bare-bones, highly modular game engine for 2D 8-bit games.
<!-- /Top -->

EightBittr is an in-progress experimental game engine targeted to 8-bit retro 2D games.
It's got some great features built-in, such as:

-   ⚡ **Blazingly fast** start times:
    -   Lazily-instantiated and -loaded components
    -   Lazily-instantiated actor classes with inline POJO sprite declarations
    -   <150KB minified / <25KB gzipped TTFI game components
-   🔧 **Easy scaffolding** for extensible mods, level editors, and random map generation
-   🖐 **Touch UI** support with [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) and [TouchPassr](https://github.com/FullScreenShenanigans/TouchPassr)
-   💉 **Full testability** with dependency-injectable, swappable APIs for data storage and time management

:x: :warning: _EightBittr isn't production ready or well-supported - you're better off using a more standard game engine._ :warning: :x:

### Documentation

More docs are comming soon™️!

In the meantime, check the list of dependencies under `package.json` and read their `README.md`s.

<!-- Development -->
## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its README.md for details on how to get started. 💖

### Building

If you'd like to develop on EightBittr in particular, `cd` to its directory and start the watcher command to compile files as you edit them:

```shell
yarn run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`yarn run watch` will directly run the TypeScript compiler on source files in watch mode.

### Running Tests

```shell
yarn run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `yarn run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests, or run `yarn test:run` to run them in headless Chrome.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
