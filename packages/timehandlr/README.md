<!-- {{Top}} -->
# TimeHandlr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/TimeHandlr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/TimeHandlr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/TimeHandlr)
[![NPM version](https://badge.fury.io/js/timehandlr.svg)](http://badge.fury.io/js/timehandlr)

A flexible, pausable alternative to setTimeout and setInterval.
<!-- {{/Top}} -->

<!-- {{Development}} -->
## Development

```
git clone https://github.com/FullScreenShenanigans/TimeHandlr
cd TimeHandlr
npm run setup
npm run verify
```

* `npm run setup` creates a few auto-generated setup files locally.
* `npm run verify` builds, lints, and runs tests.

### Building

```shell
npm run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`npm run watch` will directly run the TypeScript compiler on source files in watch mode.
Use it in the background while developing to keep the compiled files up-to-date.

### Running Tests

```shell
npm run test
```

Test files are alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.ts?` file under `src/`, re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
