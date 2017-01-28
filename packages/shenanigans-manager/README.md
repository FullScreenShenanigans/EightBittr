# shenanigans-manager

Manages locally installed FullScreenShenanigans modules for development.

## Usage

Set the project up locally to be run via Gulp:

```cmd
npm install -g gulp
npm install
gulp
```

You'll then be able to run via `lib/cli.js`.
The CLI takes in `--command <command-name>` and arguments that will be parsed from `snake-case` to `camelCase`.
The full list of commands is in `src/commands`.

```cmd
node lib/cli --command run-gulp-in-all
```

## Configuration

For now, `src/settings.ts`/`lib/settings.js` stores the root directory and repository names that will be manipulated.
