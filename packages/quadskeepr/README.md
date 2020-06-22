<!-- Top -->
# QuadsKeepr

[![NPM version](https://badge.fury.io/js/quadskeepr.svg)](http://badge.fury.io/js/quadskeepr)

Adjustable quadrant-based collision detection.
<!-- /Top -->

<!-- Development -->
## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its README.md for details on how to get started. 💖

### Building

If you'd like to develop on QuadsKeepr in particular, `cd` to its directory and start the watcher command to compile files as you edit them:

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
