<!-- {{Top}} -->
# ModAttachr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/ModAttachr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/ModAttachr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/ModAttachr)
[![NPM version](https://badge.fury.io/js/modattachr.svg)](http://badge.fury.io/js/modattachr)

Hookups for extensible triggered mod events.
<!-- {{/Top}} -->

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

## Usage

### Constructor

```typescript
import { ModAttachr } from "modattachr";

const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModDisable() {
                    console.log("Disabled...");
                },
                onModEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
});
```

#### `eventNames`

Event names for mods.
This object needs to contain `string`s under `onModDisable` and `onModEnable`.
It defaults to a `new` instance of the exported `EventNames` class.

These will be used to look up the respective keys under mods' `events`.
You can override this behavior if you must.

```typescript
const modAttacher = new ModAttachr({
    eventNames: {
        onModDisable: "onDisable",
        onModEnable: "onEnable",
    },
    mods: [
        {
            events: {
                onDisable() {
                    console.log("Disabled...");
                },
                onEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
});
```

#### `mods`

Mods that may be enabled or disabled.
These must satisfy the `IMod` interface, which contains:

* `enabled: boolean` _(optional)_: Whether the mod is immediately enabled (by default, false).
* `events: Object`: Event callbacks, keyed by event name.
* `name: string`: User-readable name of the mod.

```typescript
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
});
```

Any mods with `enabled` set to `true` will be immediately enabled.

```typescript
// Enabled!
const modAttacher = new ModAttachr({
    mods: [
        {
            enabled: true,
            events: {
                onModEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
});
```

#### `storage`

An optional `ItemsHoldr` to store whether mods are enabled.
This will store mod status across user sessions.

By default, mod statuses are directly stored under the mods' names.
You can override this behavior with `transformModName`.

```typescript
import { ItemsHoldr } from "itemsholdr";
import { modAttacher } from "modattachr";

const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("Sample", true);

// Enabled!
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
    storage: itemsHolder,
});
```

> Values from `storage` will override a mods' own `enabled` values.


#### `transformModName`

Transforms mod names to `storage` keys.
Used when `storage` is provided to get or set whether mods are enabled.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("Mods::Sample", true);

// Enabled!
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModEnable() {
                    console.log("Enabled!");
                },
            },
            name: "Sample",
        },
    ],
    storage: itemsHolder,
    transformModName: (name) => `Mod::${name}`,
});
```

---

### `enableMod`

Parameters:

* `name: string`: Name of a mod to enable.

Enables a mod and calls its `onModEnable` event, if it exists.

Enabling a mod means that whenever an event the mod has a callback for is fired, the mod's callback will run.

```typescript
const modAttacher = new ModAttachr({
    mods: [
        {
            events: {
                onModEnable() {
                    console.log("Enabled!");
                },
                onTest() {
                    console.log("Testing.");
                }
            },
            name: "Sample",
        },
    ],
});

// Enabled!
modAttacher.enableMod("Sample");

// Testing.
modAttacher.fireEvent("onTest");
```

> If the mod wasn't already enabled, this does nothing.


### `disableMod`

Parameters:

* `name: string`: Name of a mod to disable.

Enables a mod and calls its `onModDisable` event, if it exists.

Disable a mod means that whenever an event the mod has a callback for is fired, the mod's callback will not run.

```typescript
// Enabled!
const modAttacher = new ModAttachr({
    mods: [
        {
            enabled: true,
            events: {
                onModDisable() {
                    console.log("Disabling...");
                },
                onModEnable() {
                    console.log("Enabled!");
                },
                onTest() {
                    console.log("Testing.");
                }
            },
            name: "Sample",
        },
    ],
});

// Disabling...
modAttacher.disableMod("Sample");

modAttacher.fireEvent("onTest");
```

> If the mod wasn't already disabled, this does nothing.

### `fireEvent`

Parameters:

* `eventName: string`: Name of an event to fire.
* `args: ...any[]`: Any additional arguments to pass to event callbacks.

Fires an event, which calls all callbacks of mods listed for that event.

```typescript
const modAttacher = new ModAttachr({
    mods: [
        {
            enabled: true,
            events: {
                onTest() {
                    console.log("Testing.");
                }
            },
            name: "Sample",
        },
    ],
});

// Testing.
modAttacher.fireEvent("onTest");
```

<!-- {{Development}} -->
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

### Running Tests

```shell
npm run test
```

Test files are alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.ts?` file under `src/`, re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
