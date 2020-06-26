<!-- Top -->

# FpsAnalyzr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/fpsanalyzr.svg)](http://badge.fury.io/js/fpsanalyzr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
