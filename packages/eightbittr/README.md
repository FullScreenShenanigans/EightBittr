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

❌ ⚠ _EightBittr isn't production ready or well-supported - you're probably better off using a more standard game engine._ ⚠ ❌

### Documentation

<!-- Development -->

## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its [docs/Development.md](../../docs/Development.md) for details on how to get started. 💖

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
