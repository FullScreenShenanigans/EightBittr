# Walkthrough

This page will guide you through the steps to create a new game using the EightBittr game engine.
The game will feature a player avoiding boxes bouncing around a screen like an old screensaver and include a basic suite of tests.

> Make sure you've read through the other documentation pages listed in the [EightBittr README.md](../../README.md) before reading this one!

## Preface

This guide has a lot of copy & paste for a lot of repetitive steps!
EightBittr is still undergoing active pre-1.0 development.
These steps will become easier over time...

## Table of Contents

1. [Package Setup](#package-setup)
2. [Things](#things)
3. [Instantiation](#instantation)
4. [Maintenance](#maintenance)
5. [Inputs](#inputs)
6. [One Player](#one-player)
7. [Player Movements](#player-movements)
8. [Collisions](#collisions)
9. [Intervals](#intervals)
10. [Two Players](#two-players)
11. [Data Persistence](#data-persistence)
12. [Tests](#tests)

## Package Setup

Our game will be set up in its own directory as an npm package.
Create a new empty directory on your computer named `FullScreenSaver` and set up that package using `shenanigans-manager bootstrap-package`:

```shell
npx shenanigans-manager bootstrap-package --description "My new fancy game." --dist --mode "external" --name FullScreenSaver --web
```

-   `--description "My new fancy game."`: Description to go in `package.json` and code comments describing the new game class.
-   `--dist`: Whether to include a minified `dist/` version of the game during builds.`
-   `--game`: The package's code should be set up as a game consuming EightBittr.
-   `--mode "external"`: This package will exist on its own, outside the EightBittr repository monorepo.
-   `--name "FullScreenSaver"`: Name of the npm package and new game class.
-   `--web`: The package should be set up with a `lib/index.html` to play the game.

Your `FullScreenSaver` directory will now be set up with basic files to start you coding.
Open your favorite IDE _(recommended: VS Code)_ in that directory.
Prepare it for development by installing packages with `yarn` and starting the TypeScript compiler in watch mode:

```shell
code .
yarn
yarn compile -w
```

At this point we'll now be able to open a generated `lib/index.html` file in your favorite web browser.
It'll contain a heading with the _FullScreenSaver_ title, a big black area where the game renders, and an _Options_ menu on the bottom.
Hooray, it works! 🙌

Let's get started filling out that game.

## Things

In-game objects are known as "Things" (alternately referred to as "Actors" in other game engines).
We'll need to set up a few components to define...

1. `Objects`: Object inheritance map and default properties.
2. `Groups`: Storage of groups of Things.
3. `Graphics`: Visual sprites for Things.

### Objects

This will be the first component we'll create as part of this guide.
It will inherit from the core `Objects` class and extend it with your own game's object data.
Create a new `Objects` class at `src/sections/Objects.ts` defining a root `Thing` object and a `Square` extending from it:

```ts
import { Objects as EightBittrObjects } from "eightbittr";
import { IClassInheritance, IClassProperties } from "objectmakr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Raw ObjectMakr factory settings.
 */
export class Objects<TEightBittr extends FullScreenSaver> extends EightBittrObjects<TEightBittr> {
    /**
     * A tree representing class inheritances, where keys are class names.
     */
    public readonly inheritance: IClassInheritance = {
        Thing: {
            Square: {},
        },
    };

    /**
     * Member name for a function on Thing instances to be called upon creation.
     */
    public readonly onMake = "onMake";

    /**
     * Properties for each class.
     */
    public readonly properties: IClassProperties = {
        Square: {
            height: 64,
            groupType: "Solid",
            width: 64,
        },
        Thing: {
            offsetX: 0,
            offsetY: 0,
            onMake: this.game.things.process.bind(this.game.things),
            scale: 1,
            tolBottom: 0,
            tolLeft: 0,
            tolRight: 0,
            tolTop: 0,
        },
    };
}
```

Then import that class in `src/FullScreenSaver.ts` and declare it as a `@member` of `FullScreenSaver`:

```ts
import { member } from "babyioc";
import { EightBittr } from "eightbittr";

import { Objects } from "./sections/Objects";

/**
 * My new fancy game.
 */
export class FullScreenSaver extends EightBittr {
    /**
     * Raw ObjectMakr factory settings.
     */
    @member(Objects)
    public readonly objects: Objects<this>;
}
```

Your game can now theoretically _create_ `Square` Things, but it'll need to be informed of how to handle them.

### Groups

Create another new game section, `Groups`, at `src/sections/Groups.ts` to define a single group named `Solid`:

```ts
import { Groups as EightBittrGroups } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Collection settings for Thing group names.
 */
export class Groups<TEightBittr extends FullScreenSaver> extends EightBittrGroups<TEightBittr> {
    /**
     * Names of known Thing groups.
     */
    public readonly groupNames = ["Solid"];
}
```

Add this new section as a member to your `FullScreenSaver` class:

```ts
/**
 * Collection settings for Thing group names.
 */
@member(Groups)
public readonly groups: Groups<this>;
```

Now the game can create a new `Square` without crashing.
In your browser developer tools console, test it out by accessing the `FSS` global member:

```ts
FSS.things.add("Square");
```

That command should have printed a few properties a new Thing to the console.
You can also find that new Thing in the game's `GroupHoldr`:

```ts
FSS.groupHolder.groups.Solid[0];
```

Now that the `Square` _exists_, we'll want to give it some sprite info to be _rendered_.

### Graphics

Create a new `Graphics` section in `src/sections/Graphics.ts` with sprite palette colors, default scaling settings, and screen drawing settings.

```ts
import { Graphics as EightBittrGraphics } from "eightbittr";
import { IPalette } from "pixelrendr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Stores the visual appearance of Things.
 */
export class Graphics<TEightBittr extends FullScreenSaver> extends EightBittrGraphics<
    TEightBittr
> {
    /**
     * Initial background to set.
     */
    public readonly background = "black";

    /**
     * Nested library of Thing sprites.
     */
    public readonly library = {
        Square: "x14096,",
    };

    /**
     * The default palette of colors to use for sprites.
     */
    public readonly paletteDefault: IPalette = [
        [0, 0, 0, 0],
        [255, 255, 255, 255],
        [0, 0, 0, 255],
    ];

    /**
     * What key in attributions should contain sprite heights.
     */
    public readonly spriteHeight = "spriteheight";

    /**
     * What key in attributions should contain sprite widths.
     */
    public readonly spriteWidth = "spritewidth";

    /**
     * Arrays of Thing[]s that are to be drawn in each refill.
     */
    public readonly thingArrays = [this.game.groupHolder.getGroup("Solid")];
}
```

Create a `Frames` section under `src/sections/Frames.ts` as well that instructs the game to redraw the global canvas on each tick at 60 frames per second.

```ts
import { Frames as EightBittrFrames } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * How to advance each frame of the game.
 */
export class Frames<TEightBittr extends FullScreenSaver> extends EightBittrFrames<TEightBittr> {
    /**
     * How many milliseconds should be between each game tick.
     */
    public readonly interval = 1000 / 60;

    /**
     * Function run each frame of the game, on the interval.
     *
     * @param adjustedTimestamp   Current millisecond timestamp.
     */
    public readonly tick = (adjustedTimestamp: DOMHighResTimeStamp) => {
        this.game.fpsAnalyzer.tick(adjustedTimestamp);
        this.game.timeHandler.advance();
        this.game.pixelDrawer.refillGlobalCanvas();
    };
}
```

Add both sections to your `FullScreenSaver` class as well.

Now, when you add a new `Square` in your browser console, it should show up as a 64x64 white box:

```ts
game.things.add("Square");
```

Next up, we'll want to place that square in the center of the screen.

## Instantiation

For the sake of this game, let's say we want to immediately create a square at the center of the screen.
We'll add a `constructor` to the `FullScreenSaver` class that does so using:

-   `this.things.add` to create a new Square
-   `this.mapScreener` to retrieve the (x,y) center of the screen
-   `this.physics.setMid` to place the Square aligned on that (x,y) center

```ts
import { EightBittr, IEightBittrConstructorSettings } from "eightbittr";
```

```ts
public constructor(settings: IEightBittrConstructorSettings) {
    super(settings);

    const square = this.things.add("Square");
    const midX = this.mapScreener.height / 2;
    const midY = this.mapScreener.width / 2;

    this.physics.setMid(square, midX, midY);
}
```

Now, upon refreshing the screen, there should be a horizontally and vertically centered white square in the center of the screen.
Very artistic.

Next up, we'll get that square bouncing around the screen.

## Maintenance

Moving the square around the screen will involve shifting it by its velocity every game tick.

That involves:

-   Giving the square some initial velocity in the constructor
-   Adding code in the `tick` method to move the square by its velocity
-   Bouncing the square off the screen walls when it hits them

```ts
this.game.groupHolder.callOnAll();
```

### Initial Velocity

Change the constructor statement creating the `square` variable to give it velocity properties:

```ts
const square = this.things.add([
    "Square",
    {
        xvel: 2,
        yvel: -2,
    },
]);
```

### Moving By Velocity

Create a new `Maintenance` class in `src/sections/Maintenance.ts` containing a `maintain` member variable and add it as a member of `FullScreenSaver`.
That `maintain` member should be a function that takes in a `thing: IThing` and call `this.game.physics.shiftCharacter` on it:

```ts
/**
 * Maintenance logic for Things in game ticks.
 */
export class Maintenance extends Section<FullScreenSaver> {
    /**
     * Shifts a Thing according to its xvel and yvel.
     *
     * @param thing   Thing to shift.
     */
    public readonly maintain = (thing: IThing) => {
        this.game.physics.shiftBoth(thing, thing.xvel, thing.yvel);
    };
}
```

Add this class as a member to `FullScreenPokemon`.
Unlike the prior sections, because this is a new class not extending from a core section, it doesn't need a `<this>` template type.

```ts
/**
 * Raw ObjectMakr factory settings.
 */
@member(Maintenance)
public readonly maintenance: Maintenance;
```

Finally, add a line in the `tick` function _after_ the `timeHandler.advance` and _before_ the `pixelDrawer.refillGlobalCanvas` to call that `maintain` function on all Things:

```ts
public readonly tick = (adjustedTimestamp: DOMHighResTimeStamp) => {
    this.game.fpsAnalyzer.tick(adjustedTimestamp);
    this.game.timeHandler.advance();
    this.game.groupHolder.callOnAll(this.game.maintenance.maintain);
    this.game.pixelDrawer.refillGlobalCanvas();
};
```

At this point, white square is moving diagonally up and to the right.

### Wall Bouncing

We can check on each square's maintenance tick whether it's passed any of the screen walls and reverse its velocity if so.
Add the following code to the `maintain` function to do so:

```ts
if (thing.top < 0) {
    thing.yvel *= -1;
    this.game.physics.setTop(thing, -thing.top);
}

if (thing.bottom > this.game.mapScreener.height) {
    thing.yvel *= -1;
    this.game.physics.shiftVert(thing, this.game.mapScreener.height - thing.bottom);
}

if (thing.left < 0) {
    thing.xvel *= -1;
    this.game.physics.setLeft(thing, -thing.left);
}

if (thing.right > this.game.mapScreener.width) {
    thing.xvel *= -1;
    this.game.physics.shiftHoriz(thing, this.game.mapScreener.width - thing.right);
}
```

At last, we've achieved the promise of the game: a moving white square that bounces off the sides of the screen.

## Inputs

We're going to add console logging whenever the user presses the _left_ key.

Create a new `Inputs` section in `src/sections/Inputs` with `aliases` to bind arrow keys to their named equivalents and a `triggers` map pointing from those aliases to functions:

```ts
/**
 * User input filtering and handling.
 */
export class Inputs<TEightBittr extends FullScreenSaver> extends EightBittrInputs<TEightBittr> {
    /**
     * Known, allowed aliases for input event triggers.
     */
    public readonly aliases = {
        left: [37],
    };

    /**
     * Mapping of events to their key codes, to their callbacks.
     */
    public readonly triggers: ITriggerContainer = {
        onkeydown: {
            left: (event) => {
                event?.preventDefault();
                console.log("Left!");
            },
        },
    };
}
```

Add piping to `InterfaceSettings`'s `initializePipes` function to transmit global key events to the game:

```ts
const initializePipes = (): void => {
    gameWindow.addEventListener("keydown", game.inputWriter.makePipe("onkeydown", "keyCode"));

    gameWindow.document.addEventListener("visibilitychange", handleVisibilityChange);
};
```

At this point, the game should be logging `"Left!"` whenever the left key is initially pressed down.

## One Player

Let's add a way to create players in the game who can move around the screen when given input by the player.
We'll create a player when the left key is pressed for the first time.

### Thing Definition

Creating the player Thing definition follows similar steps to the squares:

1. Create a new object declaration in `Objects`

    ```ts
    public readonly inheritance: IClassInheritance = {
        Thing: {
            Player: {},
            Square: {},
        },
    };
    ```

    ```ts
    public readonly properties: IClassProperties = {
        Player: {
            height: 32,
            groupType: "Player",
            width: 32,
        }
    ```

2. Create a group for the players in `Groups`

    ```ts
    public readonly groupNames = ["Player", "Solid"];
    ```

3. Define a new color (light green) and sprite data (a circle) for the new type in `Graphics`, along with instructions to draw the new Player group:

    ```ts
    public readonly library = {
        Player: "p[0,2]x012,x18,x021,x114,x016,x118,x013,x120,x011,x122,x09,x124,x07,x126,x05,x128,0000x128,000x130,00x130,00x130,0x1256,0x130,00x130,00x130,000x128,0000x128,x05,x126,x07,x124,x09,x122,x011,x120,x013,x118,x016,x114,x021,x18,x012,",
        Square: "x14096,",
    };
    ```

    ```ts
    public readonly paletteDefault: IPalette = [
        [0, 0, 0, 0],
        [255, 255, 255, 255],
        [35, 255, 70, 255],
    ];
    ```

    ```ts
    public readonly thingArrays = [
        this.game.groupHolder.getGroup("Player"),
        this.game.groupHolder.getGroup("Solid")
    ];
    ```

### Player Creation

Instead of the console log in your `left` handler in `Inputs`, add a call to a new `Players` section's `requestPlayer` method:

```ts
left: (event) => {
    event?.preventDefault();
    this.game.players.requestPlayer();
},
```

That `requestPlayer` method will, if no player yet exists, create a new one with a strong horizontal velocity and place it just to the left of the bouncing square.

```ts
/**
 * Creates a new Player, if there wasn't one already.
 */
private requestPlayer() {
    const existingPlayer = this.game.groupHolder.getThing("player1");
    if (existingPlayer) {
        return;
    }

    const velocities = directionVelocities[direction];
    const square = this.game.groupHolder.getGroup("Solid")[0];
    const newPlayer = this.game.things.add(["Player", {
        id: "player1",
        xvel: -5,
        yvel: 0,
    }]);

    this.game.physics.setMidYObj(newPlayer, square);
    this.game.physics.setRight(newPlayer, square.left - newPlayer.xvel);
}
```

Now, when you press left in the game, that player should seem to shoot out from the left of the square.
The player will have a unique id of `"player1"` so they can be quickly retrieved later.

Next up: giving players control of the player's movements.

## Player Movements

This will involve two parts:

1. Creating a `Direction` enum to represent one of the four directions
2. Creating `Inputs` logic for all four directions
3. Signaling to `Players` which direction is created

### `Direction` Enum

Create a new file at `src/sections/Direction.ts` and export a `Direction` enum from it with four members:

```ts
export enum Direction {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3,
}
```

We'll use this `Direction` enum elsewhere in code to signal which direction an input is facing.

### Directional `Inputs`

Add `aliases` for the remaining three arrow keys:

```ts
public readonly aliases = {
    bottom: [40],
    left: [37],
    right: [39],
    top: [38],
};
```

...and corresponding `triggers` for each of them that also pass their respective `Direction` value:

```ts
public readonly triggers: ITriggerContainer = {
    onkeydown: {
        bottom: (event) => {
            event?.preventDefault();
            this.game.players.requestPlayer(Direction.Down);
        },
        left: (event) => {
            event?.preventDefault();
            this.game.players.requestPlayer(Direction.Left);
        },
        right: (event) => {
            event?.preventDefault();
            this.game.players.requestPlayer(Direction.Right);
        },
        top: (event) => {
            event?.preventDefault();
            this.game.players.requestPlayer(Direction.Up);
        },
    },
};
```

You'll need to `import { Direction } from './Direction';` at the top of the file.

TypeScript should also now be complaining that `requestPlayer` doesn't take in a direction argument.
Let's fix that.

### Directional `Players`

We'll need to define the the horizontal and vertical speed for each potential direction.
Do so with a standalone object in the `Players.ts` file:

```ts
/**
 * Raw speed player velocities will be based off of.
 */
const speed = 5;

/**
 * Horizontal and vertical player speeds for each possible direction.
 */
const directionVelocities = {
    [Direction.Top]: {
        xvel: 0,
        yvel: -speed,
    },
    [Direction.Right]: {
        xvel: speed,
        yvel: 0,
    },
    [Direction.Bottom]: {
        xvel: 0,
        yvel: speed,
    },
    [Direction.Left]: {
        xvel: -speed,
        yvel: 0,
    },
};
```

Next, add a `direction` parameter of type `Direction` to `requestPlayer`:

```ts
/**
 * Creates a new player, if there wasn't one already.
 */
public requestPlayer(direction: Direction) {
```

You can now set the player's velocity on that direction whenever the key is pressed -- both for an _existing_ player:

```ts
const existingPlayer = this.game.groupHolder.getThing("player1");
const velocities = directionVelocities[direction];

if (existingPlayer) {
    Object.assign(existingPlayer, velocities);
    return;
}
```

...and for a _new_ player:

```ts
const newPlayer = this.game.things.add([
    "Player",
    {
        id: "player1",
        ...directionVelocities[direction],
    },
]);
```

Amazing: we can now control the player with key movements.
Next, let's add collision detection for the players against squares to give the movements a purpose.

## Collisions
