<!-- Top -->

# WorldSeedr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/worldseedr.svg)](http://badge.fury.io/js/worldseedr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Schema-driven pseudorandom recursive generation of possibilities.

<!-- /Top -->

## Usage

WorldSeedr allows generating descriptions of objects in a two-dimensional space based on probabilities in input schemas.
Think random map generation for video games, particularly rogue-likes.

```ts
const worldSeeder = new WorldSeedr({
    possibilities: {
        Stage: {
            children: [
                {
                    probability: 80,
                    value: {
                        size: 3,
                        title: "GoodActor",
                        type: "Result",
                    },
                },
                {
                    probability: 20,
                    value: {
                        size: 3,
                        title: "GreatActor",
                        type: "Result",
                    },
                },
            ],
            direction: "right",
            repeat: Infinity,
            size: {
                height: 8,
                width: 6,
            },
        },
    },
    random: ((values) => {
        let index = -1;
        return () => values[(index = (index + 1) % values.length)];
    })([0.1, 0.9]),
});

worldSeeder.generate("Stage", { bottom: 0, left: 0, top: 8, right: 12 });
```

```ts
// Randomized results may look something like:
[
    { area: { left: 0, right: 3, bottom: 0, top: 8 }, title: "GoodActor" },
    { area: { left: 3, right: 6, bottom: 0, top: 8 }, title: "GreatActor" },
];
```

WorldSeedr's constructor takes in an object that may have two properties:

-   `possibilities` _(required)_: Object mapping names of possibilities to their details
-   `random` _(optional)_: A replacement for `Math.random`

### `possibilities`

Each Possibility represents a set of instructions for placing children along a line.
Each of the following properties of the `possibilities` object may be provided either as a single value or as an array of objects with a `probability` number between 0 and 100 and `value`.
Probability arrays will be chosen from at random, with weighting based on the probability.

For example, the `children` in this `Obstacle` Possibility have an 60% change of placing nothing, a 30% chance of placing two `"Enemy"`s, and a 10% chance of placing a `"DifficultEnemy"`:

```ts
new WorldSeedr({
    possibilities: {
        Obstacle: {
            children: [
                {
                    probability: 60,
                    value: [],
                },
                {
                    probability: 30,
                    value: [
                        {
                            size: 2,
                            title: "Enemy",
                            type: "Result",
                        },
                        {
                            size: 2,
                            title: "Enemy",
                            type: "Result",
                        },
                    ],
                },
                {
                    probability: 10,
                    value: {
                        size: 4,
                        title: "DifficultEnemy",
                        type: "Result",
                    },
                },
            ],
            direction: "right",
            size: {
                height: 4,
                width: 4,
            },
        },
    },
});
```

#### `children`

An ordered array of descendants to place in the output space.
These each have a `type` property equal to either:

-   `"Possibility"`: Indicating to recurse on another Possibility
-   `"Result"`: Indicating the child should be directly returned as results

Both types of children must have a `title` property indicating the name of their specified output.

##### Possibility Children

It's common for Possibilities to recursively include other Possibilities, or even themselves.
WorldSeedr will call `.generate` on the nested Possibility within the space allocated for the child.

For example, given this WorldSeedr that defines a `"Dungeon"` Possibility as having a 50-50 chance of either recursing into a `"HappySpace"` Possibility or an `"UnhappyPlace"` Possibility:

```ts
const worldSeeder = new WorldSeedr({
    possibilities: {
        Dungeon: {
            children: [
                {
                    probability: 50,
                    value: {
                        size: 10,
                        title: "HappySpace",
                        type: "Possibility",
                    },
                },
                {
                    probability: 50,
                    value: {
                        size: 10,
                        title: "UnhappySpace",
                        type: "Possibility",
                    },
                },
            ],
            direction: "right",
            repeat: 2,
            size: {
                height: 10,
                width: 20,
            },
        },
        HappySpace: {
            children: [
                {
                    probability: 70,
                    value: [],
                },
                {
                    probability: 30,
                    value: {
                        size: 10,
                        title: "Item",
                        type: "Result",
                    },
                },
            ],
            direction: "right",
            size: {
                height: 10,
                width: 10,
            },
        },
        UnhappySpace: {
            children: [
                {
                    probability: 80,
                    value: {
                        size: 10,
                        title: "EasyEnemy",
                        type: "Result",
                    },
                },
                {
                    probability: 20,
                    value: {
                        size: 10,
                        title: "HardEnemy",
                        type: "Result",
                    },
                },
            ],
            direction: "right",
            size: {
                height: 10,
                width: 10,
            },
        },
    },
});
```

...generated output might look something like:

```ts
[
    {
        // area: { ... }
        title: "HardEnemy",
    },
    {
        // area: { ... }
        title: "Item",
    },
];
```

##### Result Children

Result children may optionally include a `properties` object to be added to the results

For example, given this `children.value` that only adds `properties` to one of its two results:

```ts
[
    {
        // size: ...
        title: "Scenery",
        type: "Result",
    },
    {
        // size: ...
        properties: {
            dialog: "Roar!",
        },
        title: "Enemy",
        type: "Result",
    },
];
```

...generated output might look something like:

```ts
[
    {
        // area: { ... },
        title: "Scenery",
    },
    {
        // area: { ... },
        properties: {
            dialog: "Roar!",
        },
        title: "Enemy",
    },
];
```

Note that results children, like other properties, can come in three forms:

-   Direct value: like `children: { ... }`
-   Array of values: like `children: [ { ... }, { ... } ]`
-   Array of value probabilities: like `children: [ { probability: 100, value: { ... }]`

#### `align`

Possibility children won't always take up all the space to their side (perpendicular to their direction).
By default, they align to `"stretch"`: taking up all available space to their side.
They can alternately be given an `align` property set to one of the directions to align to.

For example, given this Possibility snippet that aligns one result to the default `"stretch"`, one to `"bottom"`, and one to `"top"`:

```ts
{
    children: [
        {
            size: {
                height: 5,
                width: 5,
            },
            title: "First",
            type: "Result",
        },
        {
            align: "bottom",
            size: {
                height: 5,
                width: 5,
            },
            title: "Second",
            type: "Result",
        },
        {
            align: "top",
            size: {
                height: 5,
                width: 5,
            },
            title: "Third",
            type: "Result",
        },
    ],
    direction: "right",
    size: {
        height: 15,
        width: 15,
    }
}
```

...generated output in a 15x15 space might look like:

```ts
[
    {
        area: {
            left: 0,
            right: 5,
            bottom: 0,
            top: 15,
        },
        title: "First",
    },
    {
        area: {
            left: 5,
            right: 10,
            bottom: 0,
            top: 15,
        },
        title: "Second",
    },
    {
        area: {
            left: 10,
            right: 15,
            bottom: 0,
            top: 15,
        },
        title: "Third",
    },
];
```

#### `direction`

Possibility children are placed along one of the cardinal directions.
The `direction` property may be one of:

-   `"bottom"`: Start at the top edge of the available space, and go downwards
-   `"left"`: Start at the right edge of the available space, and go to the left
-   `"right"`: Start at the left edge of the available space, and go to the right
-   `"top"`: Start at the bottom edge of the available space, and go upwards

#### `repeat`

How many times the children should be repeated.
It defaults to `1`, for only placing the children value(s) once.

> Tip: use `Infinity` to continuously repeat children as many times as allowed.

#### `size`

How much space this takes up, as an object containing `height` and `width`.

#### `spacing`

How much space should be between children.
It defaults to `0`, for no space between them.
The `spacing` property may be one of:

-   A number: always use much space between children
-   An object describing a range of random numbers:
    -   `max`: Maximum amount for the spacing
    -   `min`: Minimum amount for the spacing
    -   `roundTo`: Number unit to round to, if not 1 (no rounding)
-   An array of objects containing `probability` and `value` numbers, where the values are the objects describing a range of random numbers

### `random`

Applications that use deterministic seeds to generate maps generally need to use their own random number generator instead of `Math.random()`.
See [NumberMakr](../numbermakr/README.md) for the recommended EightBittr package.

```ts
const numberMaker = new NumberMakr();

const worldSeeder = new WorldSeedr({
    possibilities: {
        /* ... */
    },
    random: () => numberMaker.random(),
});
```

### `generate`

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
