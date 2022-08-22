<!-- Top -->

# UserWrappr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/userwrappr.svg)](http://badge.fury.io/js/userwrappr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Creates configurable HTML displays over flexible-sized contents.

<!-- /Top -->

UserWrappr adds two features for wrapping HTML contents:

1. Sizing of the content area within the available window space
2. Delayed creation of content menus from readable schemas

## Usage

```typescript
const userWrapper = new UserWrappr({
    createContents: (size: AbsoluteSizeSchema) => {
        return YourContentCreationLogic(size).canvas;
    },
});

userWrapper.createDisplay(document.querySelector("#YourElementContainer"));
```

## Details

UserWrappr prioritizes creating the contents as soon as possible.
When you call `createDisplay`, the following happen in order:

1. View libraries (i.e. Preact) _start_ to load.
2. A visual approximation of your menus is placed at the bottom of the area.
3. Contents are created in the remaining usable area.
4. Once view libraries are loaded, real menus created using them to replace the fake menus.

### Menus

It's assumed that your menus will exist below your content.
Clicking a menu title with a mouse will open the menu the content.

Each menu's schema must contain a `title: string` and `options: OptionSchema[]`.
Options will be created in top-to-bottom order within their parent menu.
The allowed option types, as indicated by the `type` member of the option schemas, are:

-   `"action"`: Simple triggerable action with an `action: () => void` callback.
-   `"boolean"`: Stores an on/off value.
-   `"multi-select"`: Stores multiple options within preset values. Needs:
    -   `options: string[]`: Given preset values.
    -   `selections: number`: How many of the preset options must be chosen at once.
-   `"number"`: Stores a numeric value. May specify `max` and/or `min` values.
-   `"select"`: Stores one of some preset `options: string[]`.
-   `"string"`: Stores a string value.

All schema types except `"action"` store their `TValue` type and must also provide:

-   `getInitialValue(): TValue`: returns an initial state for the value.
-   `saveValue(newValue: TValue, oldValue: TValue): void`: saves a new state for the value.

See [`OptionSchemas.ts`](src/Menus/Options/OptionSchemas.ts) for the full definitions.

### Styles

UserWrappr will provide some default styles to its elements to position them.
You can override them by passing in a `styles` object keying preset identifiers to their CSS styles.
Although they're not used internally, you can also customize which class names are added to elements by passing a `classNames` object mapping preset identifiers to their class names.
Both `styles` and `classNames` will only override with provided values.

See [`ClassNames.ts`](src/Bootstrapping/ClassNames.ts) for default class names and [`Styles.ts`](src/Bootstrapping/Styles.ts) for preset identifiers and their default values.

## API

### Optional Parameters

-   `classNames: ClassNames`: Class names to use for display elements.
-   `createElement: (tagName: string, properties: ElementProperties)`: Creates a new HTML element.
-   `defaultSize: RelativeSizeSchema`: initial size to create contents at _(by default, 100% x 100%)_.
-   `getAvailableContainerHeight`: Gets how much height is available to hold contents _(by default, `window.innerHeight`)_.
-   `menuInitializer: string`: RequireJS path to the menu initialization script.
-   `menus: MenuSchema[]`: Menus to create inside the menus area.
-   `styles: Styles`: Styles to use for display elements.
-   `requirejs`: RequireJS (AMD) API to load scripts.

See [`IUserWrappr.ts`](src/IUserWrappr.ts) for specifications on the parameters.

### Examples

Giving each menu title a `.my-menu-title` class and `color: red` CSS style:

```typescript
const userWrapper = new UserWrappr({
    classNames: {
        menuTitle: "my-menu-title",
    },
    createContents: () => {
        /* ... */
    },
    styles: {
        menuTitle: {
            color: "red",
        },
    },
});
```

Creating a menu with mute and volume inputs for a [EightBittr](https://github.com/FullScreenShenanigans/EightBittr)'s [AudioPlayr](https://github.com/FullScreenShenanigans/AudioPlayr):

```typescript
const game = new EightBittr(/* ... */);

const userWrapper = new UserWrappr({
    createContents: (size: AbsoluteSizeSchema) => {
        game.reset(size);
        return game.canvas;
    },
    menus: [
        {
            options: [
                {
                    getInitialValue: (): boolean => game.audioPlayer.getMuted(),
                    saveValue: (value: boolean): void => {
                        game.audioPlayer.setMuted(value);
                    },
                    title: "Mute",
                    type: OptionType.Boolean,
                },
                {
                    getInitialValue: () = > Math.round(game.audioPlayer.getVolume() * 100),
                    maximum: 100,
                    minimum: 0,
                    saveValue: (value: number): void => {
                        game.audioPlayer.setVolume(value / 100);
                    },
                    title: "Volume",
                    type: OptionType.Number,
                },
            ],
            title: "Sound",
        },
    ],
});
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
