# Runtime

The core EightBittr engine works on a "tick" interval: every few milliseconds, a standardized series of game actions take place.
Game logic for ticks is defined by the member functions the [`Frames` section](../src/sections/Frames.ts), and are run in order:

1. **`advance`**: Any scheduled TimeHandlr events are fired
2. **`maintain`**: Groups are updated for velocities and pruned.
3. **`setQuadrants`**: Actors in each Quadrant are recalculated for their new positions
4. **`runCollisions`**: Collision detection is run with the fresh Quadrant data
5. **`updateCanvas`**: Updated visuals are drawn to the canvas

## Adding Runtime Logic

Inheriting classes can extend these functions per normal section semantics.
For example, a class may want to add `maintain` logic for its players on each tick.

```ts
export class Frames<Game extends MyGame> extends EightBittrFrames<FullScreenSaver> {
    // 2. Groups are updated for velocities and pruned.
    public maintain() {
        super.maintain();
        this.game.players.forEach(this.game.maintenance.maintainPlayer);
    }
}
```
