<!-- {{Top}} -->
# FpsAnalyzr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/FpsAnalyzr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FpsAnalyzr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FpsAnalyzr)
[![NPM version](https://badge.fury.io/js/fpsanalyzr.svg)](http://badge.fury.io/js/fpsanalyzr)

Recording and analysis for framerate measurements.
<!-- {{/Top}} -->

## Usage

### Constructor

```typescript
import { FPSAnalyzr } from "fpsanalyzr";

const fpsAnalyzer = new FpsAnalyzr();

setInterval(fpsAnalyzer.tick, 1000 / 60);
```

#### `getTimestamp`

By default, `performance.now` is used to generate tick timestamps.
You can override it by passing in a `getTimestamp` method that returns a `number`.

```typescript
new FpsAnalyzr({
    getTimestamp: () => performance.now(),
})
```

#### `maximumKept`

By default, the past 250 tick times are kept.
You can override this by passing in a `maximumKept` number.

```typescript
new FpsAnalyzr({
    maximumKept: 50,
});
```

### `tick`

Records that a frame tick has happened.

```typescript
fpsAnalyzer.tick();
```

Unlike the other member functions, `tick` is stored as a bound arrow lambda.
You can use it without the parent FPSAnalyzr scope.

```typescript
setInterval(fpsAnalyzer.tick, 1000 / 60);
```

### `getAverage`

Returns: `number` for the computed average framerate among stored measurements.

```typescript
setInterval(fpsAnalyzer.tick, 1000 / 60);

setInterval(
    () => {
        const average = fpsAnalyzer.getAverage();
        console.log(`Average FPS this second: ${average}.`);
    },
    1000);
```

### `getExtremes`

Returns: `Object` with `.highest` and `.lowest` computed framerate among stored measurements.

```typescript
setInterval(fpsAnalyzer.tick, 1000 / 60);

setInterval(
    () => {
        const { highest, lowest } = fpsAnalyzer.getExtremes();
        console.log(`FPS this second: from ${lowest} to ${highest}.`);
    },
    1000);
```

### `getMedian`

Returns: `number` for the computed median framerate among stored measurements.

```typescript
setInterval(fpsAnalyzer.tick, 1000 / 60);

setInterval(
    () => {
        const median = fpsAnalyzer.getMedian();
        console.log(`Median FPS this second: ${median}.`);
    },
    1000);
```

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/FpsAnalyzr
cd FpsAnalyzr
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

### Running Tests

```shell
npm run test
```

Test files are alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test:run` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
