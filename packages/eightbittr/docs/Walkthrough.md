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
9. [Events](#events)
10. [Data Persistence](#data-persistence)
11. [Text Displays](#text-displays)
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
We'll need to set up a few components to define:

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
     * Names of known Thing groups, in drawing order.
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
    ];
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

    this.physics.setMid(square, this.mapScreener.height / 2, this.mapScreener.width / 2);
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
     * Maintains a general Thing for a tick.
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

Finally, add an `update` function in `Frames.ts` to call that `maintain` function on all Things:

```ts
/**
 * Function run at the start of each frame of the game.
 */
public update() {
    super.update();

    this.game.groupHolder.callOnAll(this.game.maintenance.maintain);
}
```

At this point, the white square should be moving diagonally up and to the right.

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

3. Define a new color (light green) and sprite data (a square) for the new type in `Graphics`, along with instructions to draw the new Player group:

    ```ts
    public readonly library = {
        Player: "x2024,",
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

this.game.physics.setMidObj(newPlayer, square);
this.game.physics.shiftBoth(
    newPlayer,
    (newPlayer.xvel * square.width) / speed + 1,
    (newPlayer.yvel * square.width) / speed + 1
);
```

Amazing: we can now control the player with key movements.
Players will spawn far enough from the squares that they won't immediately get hit.

Next, let's add collision detection for the players against squares to give the movements a purpose.

## Collisions

Our collision detection logic will have _player_ objects check for touching any _squares_ and kill off the player if so.
That will involve two areas of work:

1. _Selection_: Having Things know which Things they share quadrants with.
2. _Detection_: Determining whether a collision is happening.
3. _Handling_: Reacting to a collision taking place.

### Quadrant Selection

Add a call to initialize `QuadsKeepr` quadrants in the `FullScreenSaver` `constructor`, after the `super` call:

```ts
public constructor(settings: IEightBittrConstructorSettings) {
    super(settings);

    this.quadsKeeper.resetQuadrants();
```

That prepares screen quadrants to receive Things.

Next, add the following to the bottom of the `maintenance` function in `src/sections/Maintenance.ts`:

```ts
this.game.quadsKeeper.determineThingQuadrants(thing);
```

That will tell all Things -both players and solids- to figure out which quadrants they're in each tick.
Players in particular will also want to check for collisions, so add a specific `maintainPlayer` member function next in the class that does so for them:

```ts
/**
 * Maintains a player Thing for a tick.
 */
public readonly maintainPlayer = (player: IThing) => {
    this.maintain(player);
    this.game.thingHitter.checkHitsForThing(player);
}
```

Switch the `tick` logic in `src/sections/Frames.ts` to call the correct maintenance function for each group:

```ts
public readonly tick = (adjustedTimestamp: DOMHighResTimeStamp) => {
    this.game.fpsAnalyzer.tick(adjustedTimestamp);
    this.game.timeHandler.advance();

    this.game.groupHolder.callOnGroup("Solid", this.game.maintenance.maintain);
    this.game.groupHolder.callOnGroup("Player", this.game.maintenance.maintainPlayer);

    this.game.pixelDrawer.refillGlobalCanvas();
};
```

### Collision Detection

Create a new `src/sections/Collisions.ts` with an inheriting `Collisions` section.
Its first member should be a function that returns a function to check whether a player touches a solid:

```ts
/**
 * Function generator for whether a player is touching a solid.
 */
public readonly generateCheckPlayerSolid = () =>
    (player: IThing, solid: IThing) =>
        player.right >= solid.left
        && player.left <= solid.right
        && player.bottom >= solid.top
        && player.top <= solid.bottom;
```

Next, create a `hitCheckGenerators` member mapping from `Player` to `Solid` to that hit check generator.

```ts
/**
 * Function generators for checking whether two Things are colliding.
 */
public readonly hitCheckGenerators = {
    Player: {
        Solid: this.generateCheckPlayerSolid,
    },
};
```

The game will now know when a player is touching a solid, but it won't know what to do about it.

### Collision Handling

Add a `generateHitPlayerSolid` member function to `Collisions` that takes in a player and kills it:

```ts
/**
 * Function generator for a player touching a solid.
 */
public readonly generateHitPlayerSolid = () =>
    (player: IThing) => this.game.death.kill(player);
```

Register `generateHitPlayerSolid` with a new `hitCallbackGenerators` later in the class:

```ts
/**
 * Function generators for reacting to two Things colliding.
 */
public readonly hitCallbackGenerators = {
    Player: {
        Solid: this.generateHitPlayerSolid,
    },
};
```

Now, whenever a player touches a square, it'll be "killed" and removed from its group.

## Events

This game gets pretty boring with only one square bouncing around the screen.
Let's have the game square spawn another square every once in a while to spice things up a little.

We'll do this by adding a function called whenever a square is added to the game that schedules a new square to be added after a set number of game ticks.

### Squares Setup

Create a new standalone `Squares` section at `src/sections/Squares.ts` with an `addSquare` member function that takes in a coordinates and velocity to create a new square:

```ts
/**
 * Creates square Things in the game.
 */
export class Squares extends Section<FullScreenSaver> {
    /**
     * Creates a new square in the game.
     */
    public addSquare(midX: number, midY: number, xvel: number, yvel: number) {
        const square = this.game.things.add(["Square", { xvel, yvel }]);

        this.game.physics.setMid(square, midX, midY);
    }
}
```

After adding this section to the `FullScreenSaver` class, modify its constructor to also use this method to create its initial square:

```ts
public constructor(settings: IEightBittrConstructorSettings) {
    super(settings);

    this.quadsKeeper.resetQuadrants();

    this.squares.addSquare(
        this.mapScreener.height / 2,
        this.mapScreener.width / 2,
        2,
        -2,
    );
}
```

### Square Spawns

We'll want to only spawn squares if there aren't too many of them already on the screen.
Add this somewhat arbitrary value (it starts at about 8 on tiny screens and ranges up to around 16 on normal laptop screens) to the `Squares` class:

```ts
/**
 * Maximum number of squares to stop spawning after.
 */
private readonly maximumSquares = Math.sqrt(this.game.mapScreener.height * this.game.mapScreener.width / 3500) / 2 | 0;
```

Create a member variable function in the `Squares` class named `startAddingSquares` that takes in a square and sets a `TimeHandlr` timeout to create a new square with opposite velocity _if_ there aren't too many existing squares:

```ts
/**
 * Starts spawning new squares while it still can.
 */
public readonly startAddingSquares = () => {
   this.game.timeHandler.addEventInterval(
        () => {
            if (this.game.groupHolder.getGroup("Player").length === 0) {
                return true;
            }

            const solids = [...this.game.groupHolder.getGroup("Solid")];

            for (const square of solids) {
                if (solids.length >= this.maximumSquares) {
                    return true;
                }

                this.addSquare(
                    this.game.physics.getMidX(square),
                    this.game.physics.getMidY(square),
                    -square.xvel,
                    -square.yvel,
                );
            }

            return false;
        },
        150,
        Infinity,
};
```

That function sets an interval to duplicate squares frequently.
It'll stop itself when the player no longer exists or there are too many squares.

### Square Cleanups

Lastly, let's have all squares but the first be deleted whenever the player dies.
That'll roughly reset the game back to its normal state.

Back in `src/sections/Collisions.ts`, add a few lines to `generateHitPlayerSolid` to kill all squares but the first:

```ts
public readonly generateHitPlayerSolid = () =>
    (player: IThing) => {
        this.game.death.kill(player);

        for (const square of this.game.groupHolder.getGroup("Solid").slice(1)) {
            this.game.death.kill(square);
        }
    };
```

## Data Persistence

Players are gong to want to keep track of how long they were able to survive.
Let's give them points on an interval while they stay alive.

Create a new `Scoring` section at `src/sections/Scoring.ts`.
Give it a `start` member that sets up an interval to increment score as long a provided player is alive:

```ts
/**
 * Keeps track of points and high scores.
 */
export class Scoring extends Section<FullScreenSaver> {
    /**
     * Starts regularly increasing score for a player's run.
     */
    public start(player: IThing) {
        this.game.itemsHolder.setItem("score", 0);

        this.game.timeHandler.addEventInterval(
            () => {
                if (player.alive) {
                    this.game.itemsHolder.increase("score", 1);
                    return false;
                }

                const score = this.game.itemsHolder.getItem("score");
                const highScore = this.game.itemsHolder.getItem("highScore");

                if (!highScore || score > highScore) {
                    this.game.itemsHolder.setItem("highScore", score);
                    this.game.itemsHolder.saveItem("highScore");
                }

                return true;
            },
            50,
            Infinity
        );
    }
}
```

That will set a _temporary_ storage item under `"score"` for a player's current score and a _permanent_ storage item under `"highScore"` for the highest score they ever achieve.

Next, add the `Scoring` section as a member to `FullScreenSaver`, then call it when creating a new player in the `Players` section:

```ts
this.game.scoring.start(newPlayer);
this.game.squares.startAddingSquares(newPlayer);
```

Now, after a player dies, you'll be able to check the best high score for the game in your browser console:

```ts
FSS.itemsHolder.getItem("highScore");
```

Next up, let's get a display going so people can see their scores.

## Text Displays

EightBittr can draw text onto a canvas using the `MenuGraphr` component.
It takes a few steps to set up:

1. Creating Text Thing definitions
2. Defining "menus" to place text within

Once those are all set up, we'll be able to tell the game to place text there on demand.

### Text Thing Definitions

`MenuGraphr` works by manipulating in-game Things under a `Text` group.
Go ahead and add that group to `src/sections/Groups.ts` (last, so text gets drawn on top of everything else):

```ts
public readonly groupNames = ["Player", "Solid", "Text"];
```

Add a corresponding `Text` definition as a child of `Thing` in the `src/sections/Objects.ts` `inheritance`, along with character names such as `CharA` under it:

```ts
public readonly inheritance: IClassInheritance = {
    Thing: {
        Player: {},
        Square: {},
        Text: {
            Char0: {},
            Char1: {},
            Char2: {},
            Char3: {},
            Char4: {},
            Char5: {},
            Char6: {},
            Char7: {},
            Char8: {},
            Char9: {},
            CharA: {},
            CharB: {},
            CharC: {},
            CharD: {},
            CharE: {},
            CharF: {},
            CharG: {},
            CharH: {},
            CharI: {},
            CharJ: {},
            CharK: {},
            CharL: {},
            CharM: {},
            CharN: {},
            CharO: {},
            CharP: {},
            CharQ: {},
            CharR: {},
            CharS: {},
            CharT: {},
            CharU: {},
            CharV: {},
            CharW: {},
            CharX: {},
            CharY: {},
            CharZ: {},
        },
    },
};
```

...as well as a basic Thing definition in that file's `properties`:

```ts
Text: {
    groupType: "Text",
    height: 8,
    scale: 2,
    width: 8,
},
```

Finally, add sprite definitions in `src/sections/Graphics.ts` for each of the text characters:

```ts
public readonly library = {
    Player: "x21024,",
    Square: "x14096,",
    CharA: "x011,1x06,101x05,101000010001000x15,001x05,101x05,10",
    CharB: "x08,x15,0001000010010000100x16,001x05,101x05,10x16,00",
    CharC: "x010,111100010000101x07,1x07,1x08,100001000111100",
    CharD: "x08,x15,000100001001x05,101x05,101x05,1010000100x15,000",
    CharE: "x08,x17,01x07,1x07,x16,001x07,1x07,x17,0",
    CharF: "x08,x17,01x07,1x07,x16,001x07,1x07,1",
    CharG: "x010,111100010000101x07,100111101x05,100100001000111100",
    CharH: "x08,1x05,101x05,101x05,10x17,01x05,101x05,101x05,10",
    CharI: "x09,x15,x05,1x07,1x07,1x07,1x07,1x05,x15,00",
    CharJ: "x09,x16,x05,1x07,1x07,1000100010001000100001110000",
    CharK: "x08,1000010010001000100100001011000011001000100001001x05,10",
    CharL: "x08,1x07,1x07,1x07,1x07,1x07,1x07,x17,0",
    CharM: "x08,1x05,101100011010101010100100101x05,101x05,101x05,10",
    CharN: "x08,1x05,1011000010101000101001001010001010100001101x05,10",
    CharO: "x010,111000010001001x05,101x05,101x05,100100010000111000",
    CharP: "x08,x16,001x05,101x05,10x16,001x07,1x07,1",
    CharQ: "x010,111000010001001x05,101x05,10100010100100010000111010",
    CharR: "x08,x16,001x05,101x05,10x16,0010001000100001001x05,10",
    CharS: "x09,1111000100001001x08,x15,x08,101x05,100x15,00",
    CharT: "x08,x17,00001x07,1x07,1x07,1x07,1x07,10000",
    CharU: "x08,1x05,101x05,101x05,101x05,101x05,100100001000x15,0",
    CharV: "x08,1x05,101x05,10010001000100010000101x05,101x06,10000",
    CharW: "x08,1x05,1010010010101010101010101011000110110001101x05,10",
    CharX: "x08,110001100100010000101x06,1x06,1010000100010011000110",
    CharY: "x08,1x05,100100010000101x06,1x07,1x07,1x07,10000",
    CharZ: "x08,x17,x06,1x06,1x06,1x06,1x06,1x06,x17,0",
    Char0: "x018,1110000100110011000110110001100110010000111000",
    Char1: "x018,11x05,111x06,11x06,11x06,110000x16,00",
    Char2: "x017,x15,001100011x05,111001111000111x05,x17,0",
    Char3: "x017,x16,x05,110000111x08,110110001100x15,00",
    Char4: "x019,11100001111000110110011001100x17,x05,1100",
    Char5: "x016,x16,0011x06,x16,x07,110110001100x15,00",
    Char6: "x017,x15,0011x06,x16,0011000110110001100x15,00",
    Char7: "x016,x17,01100011x05,11x05,11x05,11x06,110000",
    Char8: "x017,x15,00110001100x15,0011000110110001100x15,00",
    Char9: "x017,x15,0011000110110001100x16,x06,1100x15,00",
};
```

Now, if you add a text Thing in your browser console, it should show up on the screen:

```ts
FSS.things.add("Char7");
```

### Defining Menus

`MenuGraphr` isn't one of the core modules configured with `EightBittr`.
You'll need to install it as a dependency and regenerate `lib/index.html` to be able to import it:

```ts
yarn add menugraphr
yarn run hydrate
```

To access it as a member of the game, you'll need to define its own creator in `src/creators/createMenuGrapher.ts`:

```ts
import { MenuGraphr } from "menugraphr";

import { FullScreenSaver } from "../FullScreenSaver";

export const createMenuGrapher = (game: FullScreenSaver): MenuGraphr =>
    new MenuGraphr({
        eightBitter: game,
        schemas: {
            Score: {
                height: 32,
                position: {
                    vertical: "bottom",
                },
                textPaddingX: 8,
            },
        },
    });
```

Add it as a factory component in the beginning of the `FullScreenSaver` class:

```ts
/**
 * Text-based menu and dialog management system.
 */
@factory(createMenuGrapher)
public readonly menuGrapher: MenuGraphr;
```
