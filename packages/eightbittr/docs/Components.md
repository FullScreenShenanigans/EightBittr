# Components

EightBittr's core components work together to provide a bare-bones 2D game environment that can generally support the kinds of games you'd find on a Gameboy or NES.
The core modules are generally separated into the following categories:

## Actors

In-game objects are known as "Actors" (alternately referred to as "Entities" in other game engines).
Each Actor is categorized under a particular group that dictates how the core modules interact with it.

-   **[GroupHoldr](../../groupholdr/README.md)** stores Actors in an ordered array under each Group.
-   **[ObjectMakr](../../objectmakr/README.md)** creates Actors (and other objects) by name based on a POJO description of their property hierarchies.

## Audio

-   **[AudioPlayr](../../audioplayr/README.md)** loads `.mp3` files from disk and plays them on demand.
-   **[ItemsHoldr](../../itemsholdr/README.md)** stores whether sounds are muted and/or paused.

## Graphics

EightBittr stores sprite data completely separately from the "Actor" objects represented by them.
Actors define a series of "class names" similar to DOM classes used to retrieve their corresponding sprite.

-   **[PixelRendr](../../pixelrendr/README.md)** stores raw sprites under a nested tree structure and allows quick lookups of their parsed binary canvas data.
    -   **[StringFilr](../../stringfilr/README.md)** provides the string parsing and lookup structure for those sprites.
-   **[PixelDrawr](../pixeldrawr/README.md)** draws the retrieved sprite data onto sections of the game canvas representing in-game Actors.

## Inputs

-   **[InputWritr](../../inputwritr/README.md)** pipes raw DOM events to game callbacks.

    -   **[DeviceLayr](../../devicelayr/README.md)** pipes GamePad API device actions to InputWritr pipes.
    -   **[TouchPassr](../../touchpassr/README.md)** creates touchscreen GUIs that pipe inputs to InputWritr pipes.

## Physics

Each Actor takes up a rectangular shape primarily consisting of location, size, velocity, and visual offset.
Collision detection is run on a group-to-group basis -- groups may skip it or only run it against certain other groups.

-   **[QuadsKeepr](../../quadskeepr/README.md)** splits the screen into a grid and determines which grid section each Actor is in.
-   **[ActorHittr](../../actorhittr/README.md)** creates and caches group-to-group collision detection functions and runs them on Actors against other Actors that share quadrants with them.

## Maps

A game "map" consists of three groups of information stored as POJOs:

-   **Areas** consisting of a list of objects to place in that area upon creation
-   **Locations** for players to be spawned at within those areas
-   **Metadata** primitives such as name and default audio theme

The EightBittr runtime then keeps track of the current map, spawned location, and where in the map the screen is.
Map areas may border other map areas to be spawned next to them for seamless in-game transitions.

-   **[AreaSpawnr](../../areaspawnr/README.md)** spawns and un-spawns Actors from Areas as the game moves through them.
    -   **[MapsCreatr](../../mapscreatr/README.md)** stores those maps and loads them on demand.
-   **[MapScreenr](../../mapscreenr/README.md)** keeps track of the screen size and coordinates relative to its starting position.

## Timing

EightBittr runs on a "tick"-based interval: the game performs all Actor behavior, physics runtime, and graphics drawing all at once every few milliseconds.

-   **[FrameTickr](../../frametickr/README.md)** keeps callbacks ticking on an interval corresponding to the game's FPS.
-   **[TimeHandlr](../../timehandlr/README.md)** schedules one-of and repeating callbacks on the game's ticks.
