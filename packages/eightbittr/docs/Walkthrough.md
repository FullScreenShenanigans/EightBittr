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
5. [Collisions](#collisions)
6. [Intervals](#intervals)
7. [One Player](#one-player)
8. [Two Players](#two-players)
9. [Data Persistence](#data-persistence)
10. [Tests](#tests)

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
4. ...

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
