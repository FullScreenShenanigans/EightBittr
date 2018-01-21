<!-- {{Top}} -->
# FlagSwappr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/FlagSwappr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FlagSwappr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FlagSwappr)
[![NPM version](https://badge.fury.io/js/flagswappr.svg)](http://badge.fury.io/js/flagswappr)

Gates feature flags behind generational gaps.
<!-- {{/Top}} -->

## Usage

FlagSwappr keeps track of whether features are enabled based on a current "generation".
It's based off the concept of game generations, such as Pokemon, where features are turned on or off in different releases.

### Constructor

```typescript
const flagSwapper = new FlagSwappr({
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        }
    }
});
```

#### `generation`

Starting generation to enable, if not the first from generationNames.

```typescript
const flagSwapper = new FlagSwappr({
    generation: "second",
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        }
    }
});

const { eggs } = flagSwapper.flags; // true
```

#### `generationNames`

Ordered names of the available generations, if not `Object.keys(generations)`.
The first key in this `string[]` is used as the starting `generation`.

```typescript
const flagSwapper = new FlagSwappr({
    generationNames: ["second", "first"],
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        }
    }
});

const { eggs } = flagSwapper.flags; // true
```

#### `generations`

Groups of feature settings, in order.
These represent the changes each generation made to the available feature flags.

#### Usage with TypeScript

`FlagSwappr` is templated across a `TFlags` type, where each of its `flags` are a `Partial` of that type.

The template is inferred from the constructor or can be specified manually.

```typescript
interface IFlags {
    eggs: boolean;
}

const flagSwapper = new FlagSwappr<IFlags>({
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        }
    }
});
```

---

### `flags`

Getter for the generation-variant flags.
When a new generation is set, the internal representation is reset to an object with flags for what the current generation's state is for that generation.
Each member flag is equal the most "recent" generation setting, as defined by the `generationNames` order.

```typescript
const flagSwapper = new FlagSwappr({
    generation: "third",
    generationNames: ["first", "second", "third"],
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        },
    }
});

const { eggs } = flagSwapper.flags; // true
```

### `setGeneration`

Parameters:

* `generationName: string`: Generation for flag setting.

Sets flags to a generation.

```typescript
const flagSwapper = new FlagSwappr({
    generation: "third",
    generationNames: ["first", "second", "third"],
    generations: {
        first: {
            eggs: false,
        },
        second: {
            eggs: true,
        },
    }
});

flagSwapper.setGeneration("first");

const { eggs } = flagSwapper.flags; // false
```

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/FlagSwappr
cd FlagSwappr
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
