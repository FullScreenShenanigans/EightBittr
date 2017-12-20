# shenanigans-manager

Manages locally installed FullScreenShenanigans modules for development.

## Usage

```cmd
npm install -g shenanigans-manager

shenanigans-manager --help
```

See [Documentation/Development](https://github.com/FullScreenShenanigans/Documentation/blob/master/Development.md) for usage.

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
