# Data Persistence

Players are gong to want to keep track of how long they were able to survive.
Let's give them points on an interval while they aren't removed from the game.

Create a new `Scoring` section at `src/sections/Scoring.ts`.
Give it a `start` member that sets up an interval to increment score as long a provided player isn't removed:

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
                if (!player.removed) {
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

# Text Displays

EightBittr can draw text onto a canvas using the `MenuGraphr` component.
It takes a few steps to set up:

1. Creating Text Thing definitions
2. Defining "menus" to place text within

Once those are all set up, we'll be able to tell the game to place text there on demand.

## Text Thing Definitions

`MenuGraphr` works by manipulating in-game Things under a `Text` group.
Go ahead and add that group to `src/sections/Groups.ts` (last, so text gets drawn on top of everything else):

```ts
public readonly groupNames = ["Player", "Squares", "Text"];
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

## Defining Menus

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
        game,
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

... todo fill out
