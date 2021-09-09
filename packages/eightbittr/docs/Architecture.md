# Architecture

Thanks for taking an interest in the EightBittr game engine architecture!

## Construction

Using EightBittr requires creating a game class that extends from the base `EightBittr` class in code.
Its constructor takes in settings for how to instantiate the game:

-   `components`: Any _(optional)_ overrides for settings later used to construct game components.
-   `height`: How many pixels tall the game area should be.
-   `width`: How many pixels wide the game area should be.

Those filled-out settings will later be available on the game instance under its `settings` member.

```ts
class MyGame extends EightBittr {
    // ...
}

const game = new MyGame({
    height: 160,
    width: 240,
});
```

### Game Canvas

Once created, the game will have three HTML DOM elements available that you can append to a page:

-   `background`: `<canvas>` element that will be drawn to whenever the background changes.
-   `foreground`: `<canvas>` element that will drawn to each tick.
-   `container`: `<div>` element containing:
    -   `children`: The `background` and `foreground`.
    -   `className`: `"EightBitter"`.
    -   `styles`: The same width and height as the game.

```ts
document.body.appendChild(game.container);
```

### Settings

Each member of the `components` settings object will typically be passed to a member of the EightBittr class during initialization.
Implementing consumers can override the default EightBittr module settings this way.

> Example: during tests, the default `frameTicker` settings later used to create the game's [TimeHandlr](../../timehandlr/README.md) are typically replaced with [@sinonjs/fake-timers](https://github.com/sinonjs/fake-timers).

## Components

The `EightBittr` class contains a plethora of **"component"** members that represent the various areas of game engine logic.
Those components are split into two forms:

-   **Modules**: Stateful npm modules created with [BabyIoc factories](../../babyioc/README.md#factories).
-   **Sections**: Stateless collections of game-specific functions created with [BabyIoc members](../../babyioc/README.md#usage).

Think of **modules** as part of the game's _engine_ and **sections** as the game's _high-level logic_.
The stock EightBittr comes with roughly thirty "core" (built-in) modules and sections.

### Modules

Each EightBittr module is generally its own npm package; the core ones are contained in this monorepo.

Module creation functions live under [./src/creators](./src/creators).
They take in the root EightBittr instance and return the newly created module.
Sections, other modules, and root settings may be accessed on that EightBittr instance; per BabyIoc component creation, sections and modules will be lazily instantiated as needed.

For example, the core `AreaSpawner` member is declared in the `EightBittr` class like:

```ts
/**
 * Loads EightBittr maps to spawn and unspawn areas on demand.
 */
@factory(createAreaSpawner)
public readonly areaSpawner: AreaSpawnr;
```

Its [`createAreaSpawner` function](../src/creators/createAreaSpawner.ts) creates a new `AreaSpawnr` instance using root settings and other components:

```ts
export const createAreaSpawner = (game: EightBittr): AreaSpawnr =>
    new AreaSpawnr({
        afterAdd: game.maps.addAfter,
        mapScreenr: game.mapScreener,
        mapsCreatr: game.mapsCreator,
        onSpawn: game.maps.addPreActor,
        screenAttributes: game.maps.screenAttributes,
        ...game.settings.components.areaSpawner,
    });
```

#### Conventions

Modules adhere to a strict structural convention:

-   Module class names are a noun followed by a verb, are exactly 10 characters long, end with an `r`, and omit the vowel before that `r`.
    -   Modules implement an interface with the same name prefixed with an `I`.
    -   Modules take in a single `settings` object in their constructor with a type name equal to their interface name plus `Settings`.
-   EightBittr module members have the full camelCase equivalent of their module class name with the pre-`r` vowel added back.
    -   Those module members are created with a factory whose name is the module class name prefixed with `create`.

> Fun fact: the game's `canvas` and `container` members are created with factories: [`createCanvas`](../src/creators/createCanvas.ts) and [`createContainer`](../src/creators/createContainer.ts), respectively.

### Sections

Section classes are members of the EightBittr class that are intended to purely contain game logic and values for module instantiation.
They each extend from the general [`Section` class](../src/sections/Section.ts), which gives them a `game` member variable pointing to the root EightBittr game instance.
That `game` is declared to be a `Game extends EightBittr` template type so that consuming classes can declare sections with their own game class as the type.

For example, the core `Groups` member is declared in the `EightBittr` class like:

```ts
/**
 * Collection settings for Actor group names.
 */
@member(Groups)
public readonly groups Groups<this>;
```

Its class declaration looks like:

```ts
export class Groups<Game extends EightBittr> extends Section<FullScreenSaver> {
    public readonly groupNames: string[] = [];
}
```

`groupNames` can then be referenced in the `createGroupHolder` factory:

```ts
import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

export const createGroupHolder = (game: EightBittr) =>
    new GroupHoldr<{ [i: string]: Actor }>({
        groupNames: game.groups.groupNames,
        ...game.settings.components.groupHolder,
    });
```

#### Inherited Sections

Consuming games will generally need to override members of the core sections to instruct the game engine.
For example, overriding the `groupNames` member of `Groups` is necessary to allow Actors in the game.

Consuming game classes will want to redeclare their `groups` member section to be their own `Groups` class extending from the core `Groups`.

```ts
import { Groups as GroupsBase } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

export class Groups<Game extends FullScreenSaver> extends GroupsBase<Game> {
    public readonly groupNames = ["Players", "Squares"];
}
```
