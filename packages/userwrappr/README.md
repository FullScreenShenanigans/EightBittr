<!-- {{Top}} -->
# UserWrappr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/UserWrappr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/UserWrappr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/UserWrappr)
[![NPM version](https://badge.fury.io/js/userwrappr.svg)](http://badge.fury.io/js/userwrappr)

Creates configurable HTML displays over flexible-sized contents.
<!-- {{/Top}} -->

UserWrappr adds two features for wrapping HTML contents:

1. Sizing of the content area within the available window space
2. Delayed creation of content menus from readable schemas

## Usage

```typescript
const userWrapper = new UserWrappr({
    createContents: (size: IAbsoluteSizeSchema) => {
        return YourContentCreationLogic(size).canvas;
    }
});

userWrapper.createDisplay(document.querySelector("#YourElementContainer"));
```

## Details

UserWrappr prioritizes creating the contents as soon as possible.
When you call `createDisplay`, the following happen in order:

1. View libraries (MobX+React) _start_ to load.
2. A visual approximation of your menus is placed at the bottom of the area.
3. Contents are created in the remaining usable area.
4. Once view libraries are loaded, real menus created using them to replace the fake menus.

### Menus

It's assumed that your menus will exist below your content.
Hovering over a menu title with a mouse will open the menu the content.

Each menu's schema must contain a `title: string` and `options: IOptionSchema[]`.
Options will be created in top-to-bottom order within their parent menu.
The allowed option types, as indicated by the `type` member of the option schemas, are:

* `"action"`: Simple triggerable action with an `action: () => void` callback.
* `"boolean"`: Stores an on/off value.
* `"multi-select"`: Stores multiple options within preset values. Needs:
    * `options: string[]`: Given preset values.
    * `selections: number`: How many of the preset options must be chosen at once.
* `"number"`: Stores a numeric value. May specify `max` and/or `min` values.
* `"select"`: Stores one of some preset `options: string[]`.
* `"string"`: Stores a string value.

All schema types except `"action"` store their `TValue` type and must also provide:

* `getInitialValue(): TValue`: returns an initial state for the value.
* `saveValue(newValue: TValue, oldValue: TValue): void`: saves a new state for the value.

See [`OptionSchemas.ts`](src/Menus/Options/OptionSchemas.ts) for the full definitions.

### Styles

UserWrappr will provide some default styles to its elements to position them.
You can override them by passing in a `styles` object keying preset identifiers to their CSS styles.
Although they're not used internally, you can also customize which class names are added to elements by passing a `classNames` object mapping preset identifiers to their class names.
Both `styles` and `classNames` will only override with provided values.

See [`ClassNames.ts`](src/Bootstrapping/ClassNames.ts) for default class names and [`Styles.ts`](src/Bootstrapping/Styles.ts) for preset identifiers and their default values.

## API

### Optional Parameters

* `classNames: IClassNames`: Class names to use for display elements.
* `createElement: (tagName: string, properties: IElementProperties)`: Creates a new HTML element.
* `defaultSize: IRelativeSizeSchema`: Initial size to create contents at _(by default, 100% x 100%)_.
* `getAvailableContainerHeight`: Gets how much height is available to hold contents _(by default, `window.innerHeight`)_.
* `menuInitializer: string`: RequireJS path to the menu initialization script.
* `menus: IMenuSchema[]`: Menus to create inside the menus area.
* `styles: IStyles`: Styles to use for display elements.
* `requirejs`: RequireJS (AMD) API to load scripts.

See [`IUserWrappr.ts`](src/IUserWrappr.ts) for specifications on the parameters.

### Examples

Giving each menu title a `.my-menu-title` class and `color: red` CSS style:

```typescript
const userWrapper = new UserWrappr({
    classNames: {
        menuTitle: "my-menu-title"
    },
    createContents: () => { /* ... */ },
    styles: {
        menuTitle: {
            color: "red"
        }
    }
})
```

Creating a menu with mute and volume inputs for a [GameStartr](https://github.com/FullScreenShenanigans/GameStartr)'s [AudioPlayr](https://github.com/FullScreenShenanigans/AudioPlayr):

```typescript
const game = new GameStartr(/* ... */);

const userWrapper = new UserWrappr({
    createContents: (size: IAbsoluteSizeSchema) => {
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
                    type: OptionType.Boolean
                },
                {
                    getInitialValue: (): number => Math.round(game.audioPlayer.getVolume() * 100),
                    maximum: 100,
                    minimum: 0,
                    saveValue: (value: number): void => {
                        game.audioPlayer.setVolume(value / 100);
                    },
                    title: "Volume",
                    type: OptionType.Number
                }
            ],
            title: "Sound"
        }
    ]
});
```

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/UserWrappr
cd UserWrappr
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
