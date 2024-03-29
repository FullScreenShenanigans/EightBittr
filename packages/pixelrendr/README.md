<!-- Top -->

# PixelRendr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/pixelrendr.svg)](http://badge.fury.io/js/pixelrendr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Extracts images from text blobs in real time with fast cached lookups.

<!-- /Top -->

## Summary

At its core, PixelRendr is a library. It takes in sprites and string keys to
store them under, and offers a fast lookup API. The internal folder structure
storing images is at its core a tree, where strings are nodes similar to CSS
classNames. See StringFilr for more information on storage, and ChangeLinr
for the processing framework.

### Sprites Format

To start, each PixelRendr keeps a global "palette" as an Array[]:

```javascript
[
    [0, 0, 0, 0],
    [255, 255, 255, 255],
    [0, 0, 0, 255],
];
```

Ignoring compression, sprites are stored as a Number[]. For example:

```javascript
"00000001112";
```

Using the above palette, this represents transparent pixels, three white pixels,
and a black pixel. Most images are much larger and more complex than this, so a
couple of compression techniques are applied:

#### 1. Palette Mapping

It is necessary to have a consistent number of digits in images, as 010
could be [0, 1, 0], [0, 10], or etc. So, for palettes with more than ten
colors, [1, 14, 1] would use ["01", "14", "01"]:

```javascript
"011401011401011401011401011401011401011401";
```

We can avoid this wasted character space by instructing a sprite to only use
a subset of the pre-defined palette:

```javascript
"p[1,14]010010010010010010010";
```

The 'p[0,14]' tells the renderer that this sprite only uses colors 0 and 14,
so the number 0 should refer to palette number 1, and the number 1 should
refer to palette number 14.

#### 2. Character Repetition

Take the following wasteful sprite:

```javascript
"p[0]0000000000000000000000000000000000000000000000000";
```

We know the 0 should be printed 35 times, so the following notation is used to indicate "Print ('x') 0 35 times (','))":

```javascript
"p[0]x035,";
```

#### 3. Filters

Many sprites are different versions of other sprites, often either identical or differently colored (the only two commands supported so far).
So, a library may declare the following filter:

```javascript
"Sample": [ "palette", { "00": "03" } ]
```

...along with a couple of sprites:

```javascript
"foo": "p[0,7,14]000111222000111222000111222",
"bar": [ "filter", ["foo"], "Sample"]
```

The "bar" sprite will be a filtered version of foo, using the Sample filter.
The Sample filter instructs the sprite to replace all instances of "00" with "03", so "bar" will be equivalent to:

```javascript
"bar": "p[3,7,14]000111222000111222000111222"
```

Another instruction you may use is "same", which is equivalent to directly
copying a sprite with no changes:

```javascript
"baz": [ "same", ["bar"] ]
```

#### 4. "Multiple" sprites

Sprites are oftentimes of variable height. Pipes in Mario, for example, have
a top opening and a shaft of potentially infinite height. Rather than use
two objects to represent the two parts, sprites may be directed to have one
sub-sprite for the top/bottom or left/right, with a single sub-sprite
filling in the middle. Pipes, then, would use a top and middle.

```javascript
[
    "multiple",
    "vertical",
    {
        top: "{upper image data}",
        bottom: "{repeated image data}",
    },
];
```

## Usage

Drawing a simple black square:

```typescript
import { memCopyU8, pixelRender } from "pixelrendr";

const pixelRender = new PixelRendr({
    paletteDefault: [[0, 0, 0, 255]],
    library: {
        BlackSquare: "x064,",
    },
});

const sizing = {
    spriteWidth: 8,
    spriteHeight: 8,
};

const sprite = PixelRender.decode("BlackSquare", sizing);
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = sizing.spriteWidth;
canvas.height = sizing.spriteHeight;

const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
PixelRender.memCopyU8(sprite, imageData.data);
context.putImageData(imageData, 0, 0);
```

Drawing a white square using the black square's sprite as reference for a filter:

```typescript
const PixelRender = new PixelRendr({
    paletteDefault: [
        [0, 0, 0, 255],
        [255, 255, 255, 255],
    ],
    library: {
        BlackSquare: "x064,",
        WhiteSquare: ["filter", ["BlackSquare"], "Invert"],
    },
    filters: {
        Invert: [
            "palette",
            {
                0: 1,
                1: 0,
            },
        ],
    },
});

const sizing = {
    spriteWidth: 8,
    spriteHeight: 8,
};

const sprite = PixelRender.decode("WhiteSquare", sizing);
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = sizing.spriteWidth;
canvas.height = sizing.spriteHeight;

const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
PixelRender.memCopyU8(sprite, imageData.data);
context.putImageData(imageData, 0, 0);
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
