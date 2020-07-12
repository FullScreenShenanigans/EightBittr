## Development

{{ #shenanigans.external }}
After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo):

```
git clone https://github.com/<your-name-here>/{{ shenanigans.name }}
cd {{ shenanigans.name }}
yarn
yarn run hydrate
yarn run compile
```

-   `yarn run hydrate` creates a few auto-generated setup files locally.
-   `yarn run compile` builds source code with TypeScript
{{ /shenanigans.external }}
{{ ^shenanigans.external }}
This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its [docs/Development.md](../../docs/Development.md) for details on how to get started. 💖
{{ /shenanigans.external }}

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
