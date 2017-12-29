# shenanigans-manager

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/shenanigans-manager.svg)](https://greenkeeper.io/)

Manages locally installed FullScreenShenanigans modules for development.

## Usage

```cmd
npm install -g shenanigans-manager

shenanigans-manager --help
```

Use `npm run src` to completely rebuild.
* `npm run src:tsc` (`tsc -p .`) rebuilds TypeScript files.
* `npm run watch` (`tsc -p . -watch`) rebuilds in watch mode.

The full list of commands is in `src/Commands`.

### Configuration

For now, `src/settings.ts`/`src/settings.js` stores the default directory and repository names that will be manipulated.


## Development

Fork the repository on GitHub, clone it, and install dependencies:

```cmd
git clone https://github.com/<your-name>/shenanigans-manager
cd shenanigans-manager
npm install
```

You can then use `npm run watch` to continuously rebuild on file changes.
`npm run src` builds and lints.
