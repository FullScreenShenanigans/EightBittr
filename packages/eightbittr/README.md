<!-- Top -->

# EightBittr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/eightbittr.svg)](http://badge.fury.io/js/eightbittr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Bare-bones, highly modular game engine for 2D 8-bit games.

<!-- /Top -->

EightBittr is an in-progress experimental game engine targeted to 8-bit retro 2D games.
It's got some great features built-in, such as:

-   ⚡ **Blazingly fast** start times:
    -   Lazily-instantiated and -loaded components
    -   Lazily-instantiated actor classes with inline POJO sprite declarations
    -   <150KB minified / <30KB gzipped TTFI game components
-   🔧 **Easy scaffolding** for extensible mods, level editors, and random map generation
-   🖐 **Touch UI** support with [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) and [TouchPassr](https://github.com/FullScreenShenanigans/TouchPassr)
-   💉 **Full testability** with dependency-injectable, swappable APIs for data storage and time management

❌ ⚠ _EightBittr isn't production ready or well-supported - you're probably better off using a more standard game engine._ ⚠ ❌

### Documentation

Interested in learning more?
See:

-   **[docs/Architecture](./docs/Architecture.md)** for a rundown of how EightBittr sets up its members.
-   **[docs/Components](./docs/Components.md)** for descriptions of how each of EightBittr's pieces work together.
-   **[docs/Consumption](./docs/Consumption.md)** for how to set up a game using EightBittr.
-   **[docs/Testing](./docs/Testing.md)** for how to test a game set up with EightBittr.
-   **[docs/Runtime](./docs/Runtime.md)** for a detailed play-by-play of what happens each game frame.
-   **[docs/Walkthrough](./docs/walkthrough/README.md)** for step-by-step instructions on how to set up a game with EightBittr.
-   **[docs/FAQs](./docs/FAQs.md)**

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
