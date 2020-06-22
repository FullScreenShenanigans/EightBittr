<!-- Top -->

# FpsAnalyzr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/FpsAnalyzr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FpsAnalyzr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FpsAnalyzr)
[![NPM version](https://badge.fury.io/js/fpsanalyzr.svg)](http://badge.fury.io/js/fpsanalyzr)

Recording and analysis for framerate measurements.

<!-- /Top -->

## Usage

### Constructor

```typescript
import { FPSAnalyzr } from "fpsanalyzr";

const fpsAnalyzer = new FpsAnalyzr();

setInterval(() => fpsAnalyzer.tick(performance.now()), 1000 / 60);
```

#### `maximumKept`

By default, the past 250 tick times are kept.
You can override this by passing in a `maximumKept` number.

```typescript
new FpsAnalyzr({
    maximumKept: 50,
});
```

---

### `tick`

Records that a frame tick has happened.

Receives: `number` representing the current timestamp, in milliseconds.

```typescript
fpsAnalyzer.tick(performance.now());
```

### `getAverage`

Returns: `number` for the computed average framerate among stored measurements.

```typescript
setInterval(() => fpsAnalyzer.tick(performance.now()), 1000 / 60);

setInterval(() => {
    const average = fpsAnalyzer.getAverage();
    console.log(`Average FPS this second: ${average}.`);
}, 1000);
```

### `getExtremes`

Returns: `Object` with `.highest` and `.lowest` computed framerate among stored measurements.

```typescript
setInterval(() => fpsAnalyzer.tick(performance.now()), 1000 / 60);

setInterval(() => {
    const { highest, lowest } = fpsAnalyzer.getExtremes();
    console.log(`FPS this second: from ${lowest} to ${highest}.`);
}, 1000);
```

### `getMedian`

Returns: `number` for the computed median framerate among stored measurements.

```typescript
setInterval(() => fpsAnalyzer.tick(performance.now()), 1000 / 60);

setInterval(() => {
    const median = fpsAnalyzer.getMedian();
    console.log(`Median FPS this second: ${median}.`);
}, 1000);
```

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/FpsAnalyzr
cd FpsAnalyzr
npm install
yarn run setup
yarn run verify
```

-   `yarn run setup` creates a few auto-generated setup files locally.
-   `yarn run verify` builds, lints, and runs tests.

### Building

```shell
yarn run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`yarn run watch` will directly run the TypeScript compiler on source files in watch mode.
Use it in the background while developing to keep the compiled files up-to-date.

#### Running Tests

```shell
yarn run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `yarn run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
