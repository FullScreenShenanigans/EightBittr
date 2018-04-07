#### Maps Tests

{{shenanigans.name}} includes automated tests in `src/Maps.test.ts` that loop over every map and location in the game.
That file is generated as part of `npm run setup`.
It creates a separate test group under `Maps` for each map, and a test for each of the map's locations.
