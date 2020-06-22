<!-- Top -->
# FlagSwappr

[![NPM version](https://badge.fury.io/js/flagswappr.svg)](http://badge.fury.io/js/flagswappr)

Gates feature flags behind generational gaps.
<!-- /Top -->

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
        },
    },
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
        },
    },
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
        },
    },
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
        },
    },
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
    },
});

const { eggs } = flagSwapper.flags; // true
```

### `setGeneration`

Parameters:

-   `generationName: string`: Generation for flag setting.

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
    },
});

flagSwapper.setGeneration("first");

const { eggs } = flagSwapper.flags; // false
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
