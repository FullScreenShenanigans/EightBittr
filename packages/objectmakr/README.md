<!-- Top -->
# ObjectMakr

[![NPM version](https://badge.fury.io/js/objectmakr.svg)](http://badge.fury.io/js/objectmakr)

An abstract factory for dynamic attribute-based classes.
<!-- /Top -->

## Usage

ObjectMakr lazily creates classes based on `inheritance` trees with additional `properties`.
You can then `make` new instances of those classes at runtime.

The system works almost identically to traditional classes that `extend` each other, with the added benefit of lazy instantiation from plain old JavaScript objects.

### Constructor

```typescript
import { ObjectMakr } from "objectmakr";

const objectMaker = new ObjectMakr({
    inheritance: {
        Solid: {
            Block: {},
        },
    },
    properties: {
        Block: {
            photo: "Question Mark",
        },
        Solid: {
            size: 8,
        },
    },
});

const block = objectMaker.make("Block");

block.photo; // "Question Mark"
block.size; // 8
```

### `inheritance`

A tree representing class inheritances, where keys are class names.
The sub-objects under each class name key are classes inheriting from that class.

The root object is always `Object`, as with normal JavaScript classes.

### `properties`

Flat mapping of class names to any properties added to that class' prototype.

### `indexMap`

How properties can be mapped from an array to indices on created members.
If this is passed in, class properties will be allowed to be specified as arrays.

```typescript
const objectMaker = new ObjectMakr({
    indexMap: ["photo", "contents"],
    inheritance: {
        Solid: {
            Block: ["Question Mark", "Coin"],
            Brick: ["Bricks"],
        },
    },
    properties: {
        Block: ["Question Mark"],
        Solid: {
            size: 8,
        },
    },
});

const block = objectMaker.make("Block");

block.photo; // "Question Mark"
block.contents; // "Coin"

const brick = objectMaker.make("Brick");

brick.photo; // "Bricks"
brick.contents; // undefined
```

### `onMake`

Member name for a function on instances to be called upon creation.
If this is provided, any class instance with a member under this name will call that member as a function when made with `make`.

The function is called with the member as its scope, and takes in the member and the class name.

```typescript
const calledOnMake = console.log.bind(console, "Creating:");
const objectMaker = new ObjectMakr({
    inheritance: {
        Solid: {
            Block: {},
        },
    },
    onMake: "creator",
    properties: {
        Solid: {
            creator: calledOnMake,
        },
    },
});

// Creating: class_1 {} Block
objectMaker.make("Block");
```

## `make`

Creates a new instance of a class.
If the class doesn't yet exist in-memory, it's created based on its `inheritance` and `properties`.

```typescript
const block = objectMaker.make("Block");

block.photo; // "Question Mark"
block.size; // 8
```

`make` also accepts an additional `settings` parameter with any settings overrides to be shallow-copied onto the object.

```typescript
const bigBlock = objectMaker.make("Block", {
    size: 16,
});

block.photo; // "Question Mark"
bigBlock.size; // 16
```

<!-- Development -->
## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its README.md for details on how to get started. 💖

### Building

If you'd like to develop on ObjectMakr in particular, `cd` to its directory and start the watcher command to compile files as you edit them:

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
