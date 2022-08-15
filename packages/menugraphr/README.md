<!-- Top -->

# MenuGraphr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/menugraphr.svg)](http://badge.fury.io/js/menugraphr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

In-game menu and dialog creation and management for EightBittr.

<!-- /Top -->

MenuGraphr automates creating in-game menus containing paragraphs or scrolling lists of text.
Each menu has a unique name by which its globally identified as well as a rectangular position relative to its parent.
Menus can be positioned as children of the root game's MapScreenr viewport or of each other.

## Usage

MenuGraphr instances take in, at the very least, a EightBittr game to create Actors within.
The game should have have a `"Menu"` Actor defined.

### Constructor

```typescript
const game = new EightBittr({ ... });
const menuGrapher = new MenuGraphr({ game });
```

#### `game`

The parent EightBittr managing Actors.
This is the only mandatory settings field.

#### `aliases`

Alternate Actor titles for characters, such as `" "` for `"Space"`.
Normally, Actors used as menu text have titles equal to `"Text"` plus the name of the character.
These will replace the name of the character in that computation.

```typescript
// Uses "TextSpace" instead of "Text "
new MenuGraphr({
    aliases: {
        " ": "Space",
    },
    game,
});
```

#### `sounds`

Sounds that should be played for certain menu actions.
So far, this is only `onInteraction`, which is whenever a menu is interacted with
(usually off the A or B buttons being pressed).
These are played with the EightBittr's AudioPlayr.

```typescript
new MenuGraphr({
    game,
    sounds: {
        onInteraction: "Bloop",
    },
});
```

#### `replacements`

Programmatic replacements for delineated words.
Allows texts in menus to contain dynamic values using predetermined strings.

These can be hardcoded strings or functions to generate them.

```typescript
new MenuGraphr({
    game,
    replacements: {
        DYNAMIC: () => game.itemsHolder.get("dynamic-value"),
        STATIC: "My name here!",
    },
});
```

Menu dialogs and lists will directly replace the values of replacements between the menu's `replacerKey` (see below):

```typescript
menuGrapher.addMenuDialog("GeneralText", [
    // Inserts the value of game.itemsHolder.get("dynamic-value")
    "Dynamic value: %%%%%%%DYNAMIC%%%%%%%",

    // Inserts "My name here!"
    "Static value: %%%%%%%STATIC%%%%%%%",
]);
```

#### `replacerKey`

Separator for words to replace using `replacements`.
Defaults to `"%%%%%%%"`.

```typescript
new MenuGraphr({
    game,
    replacements: {
        STATIC: "My name here!",
    },
    replacerKey: "|",
});
```

```typescript
menuGrapher.addMenuDialog("GeneralText", [
    // Inserts "My name here!"
    "Static value: |STATIC|",
]);
```

#### `schemas`

Known menu schemas, keyed by name.
Those properties are defined on `MenuSchema`.
See [`docs/schemas.md`](./docs/schemas.md).

```typescript
new MenuGraphr({
    game,
    schemas: {
        GeneralText: {
            size: {
                height: 96,
                width: 320,
            },
        },
    },
});
```

### `createMenu`

Menus are created with `createMenu`, which takes in the string name of the menu and any additional schema properties.
See [`docs/schemas.md`](./docs/schemas.md).

```typescript
menuGrapher.createMenu("GeneralText", {
    /* ... */
});
```

Each menu is identified by a unique string name.
When `createMenu` creates a menu, any existing menu under that name is disposed of.

### `setActiveMenu`

Sets a menu to appear to have user focus.
For dialogs, this allows the user to "A" through them.
For lists, this visualizes the selected index with an "Arrow" Actor.

Only one menu may be active at any time.
There does not need to be an active menu, and menus are not active by default.

```typescript
menuGrapher.createMenu("GeneralText");
menuGrapher.addMenuDialog("GeneralText", "Hello world!");
menuGrapher.setActiveMenu("GeneralText");
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
