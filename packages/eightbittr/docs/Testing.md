# Testing

EightBittr fully supports testing its inheriting classes.
You can use its `settings` constructor argument to pass in test-friendly settings for its modules.

From the core modules, you'll generally want to override:

-   **AudioPlayer**: Set `createSound` to `sinon.createStubInstance(AudioElementSound)` so that it doesn't slow or crash tests by creating `<audio>` elements.
-   **FrameTicker**: Set `timing` to clock values pointing to a [@sinonjs/fake-timers](https://github.com/sinonjs/fake-timers) clock, allowing tests to programmatically jump through time.
-   **ItemsHolder**: Set `storage` to ItemsHoldr's `createStorage` mock so each test has its own local storage.
-   **PixelDrawer**: Set `framerateSkip` to `Infinity` so that it doesn't slow tests down redrawing its canvas.

```ts
import { createClock } from "@sinonjs/fake-timers";
import { AudioElementSound } from "audioplayr";
import { createStorage } from "itemsholdr";
import { createStubInstance } from "sinon";

import { MyGame } from "./MyGame";

export const setupMyGame = () => {
    const storage = createStorage();
    const clock = createClock();
    const game = new MyGame({
        components: {
            audioPlayer: {
                createSound: () => createStubInstance(AudioElementSound),
            },
            frameTicker: {
                timing: {
                    cancelFrame: clock.clearTimeout,
                    getTimestamp: () => clock.now,
                    requestFrame: (callback) =>
                        clock.setTimeout(() => {
                            callback(clock.now);
                        }, 1),
                },
            },
            itemsHolder: { storage },
            pixelDrawer: { framerateSkip: Infinity },
        },
        height: 160,
        width: 240,
    });

    return { clock, game, storage };
};
```

You can then call methods on the game's modules and sections in your tests to trigger in-game logic:

```ts
const { game } = setupMyGame();

game.actors.add("Box", 16, 24);
```
