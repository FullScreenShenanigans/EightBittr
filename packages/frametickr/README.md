<!-- Top -->
# FrameTickr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/FrameTickr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FrameTickr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FrameTickr)
[![NPM version](https://badge.fury.io/js/frametickr.svg)](http://badge.fury.io/js/frametickr)

Runs a series of callbacks on a timed interval.
<!-- /Top -->

<!-- Development -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/FrameTickr
cd FrameTickr
npm install
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

#### Running Tests

```shell
npm run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using  alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
