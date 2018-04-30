<!-- Top -->
# ModAttachr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/ModAttachr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/ModAttachr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/ModAttachr)
[![NPM version](https://badge.fury.io/js/modattachr.svg)](http://badge.fury.io/js/modattachr)

Hookups for extensible triggered mod events.
<!-- /Top -->

ModAttachr allows host applications to send messages to "mods", or collections of callbacks linked to string event names.
Mods may be individually enabled or disabled.

## Usage

### Events

Each mod may attach callbacks to named calls fired by the host application to act on application events.
Event names are shared across mods.

Two event names are defined by default:

* `"onModEnable"`: Called when a mod is enabled, including when a new `ModAttachr` instance is created.
* `"onModDisable"`: Called when a mod is disabled after previously being enabled.

Mods default to disabled unless provided with an `enabled: true`.

#### `enableMod`

Enables a mod if it wasn't already enabled.

```typescript
// "Enabled Two!"
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModEnable: () => console.log("Enabled One!"),
                onStart: () => console.log("Starting One!"),
            },
            name: "One",
        },
        {
            enabled: true,
            events: {
                onModEnable: () => console.log("Enabled Two!"),
            },
            name: "Two",
        },
    ],
});

// "Enabled One!"
// "Enabled Two!"
modAttacher.fireModEvent("onModEnable");

// "Starting One!"
modAttacher.fireModEvent("onStart");
```

#### `disableMod`

Disables a mod if it was previously enabled.

```typescript
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModDisable: () => console.log("Disabled One!"),
                onStart: () => console.log("Starting One!"),
            },
            name: "One",
        },
        {
            enabled: true,
            events: {
                onModDisable: () => console.log("Disabled Two!"),
            },
            name: "Two",
        },
    ],
});

// "Disabled Two!"
modAttacher.fireModEvent("onModDisable");

modAttacher.fireModEvent("onStart");
```

#### `fireEvent`

Fires a named event to be received by any enabled subscribing mod.
Any parameters passed to the event are directly passed to mods.

```typescript
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onPoints: (player, points) => console.log(`${player} scored ${points}!`),
            },
            name: "Sample",
        },
    ],
});

// "You scored 7!"
modAttacher.fireModEvent("onPoints", "You", 7);
```

#### `eventNames`

It's common to use a class extending from the module's exported `ModEventNames` to store common event names.
Pass it as a `eventNames` to the `ModAttachr` constructor and use it instead of string literals for event names:

```typescript
import { ModAttachr, ModEventNames } from "modattachr";

class SampleModEventNames extends ModEventNames {
    onStart = "onStart",
}

const modEventNames = new SampleModEventNames();

// "Starting!"
const modAttacher = new ModAttachr({
    mods: [
        {
            enabled: true,
            eventNames: modEventNames,
            events: {
                [modEventNames.onModEnable]: () => console.log("Enabled!"),
                [modEventNames.onStart]: () => console.log("Starting!"),
            },
            name: "Sample",
        },
    ],
});

// "Starting!"
modAttacher.fireEvent(modEventNames.onStart);
```

### `ItemsHoldr`

It's common in persistent applications to store whether mods are enabled or disabled in a cache such as `localStorage`.
Pass an [`ItemsHoldr`](https://github.com/FullScreenShenanigans/ItemsHoldr) as `itemsHolder` to a `ModAttachr` to have it store whether each mod is enabled there.

```typescript
new ModAttachr({
    itemsHolder: new ItemsHoldr(),
    mods: [],
})
```

Mod toggle booleans are stored directly under mod names by default.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("One", true);

// "Enabled One!"
const modAttacher = new ModAttachr({
    itemsHolder,
    mods: [
        {
            events: {
                onModEnable: () => console.log("Enabled One!"),
            },
            name: "One",
        },
    ],
});
```

#### `transformModName`

Pass a lambda that converts a string name to another string if you need to customize which keys are used for mods in storage.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("MyMods::One", true);

// "Enabled One!"
const modAttacher = new ModAttachr({
    itemsHolder,
    mods: [
        {
            events: {
                onModEnable: () => console.log("Enabled One!"),
            },
            name: "One",
        },
    ],
    transformModName: (modName) => `MyMods::${modName}`,
});
```

<!-- Development -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/ModAttachr
cd ModAttachr
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

#### Running Tests

```shell
npm run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using  alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
