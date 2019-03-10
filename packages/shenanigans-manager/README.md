# shenanigans-manager

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/shenanigans-manager.svg)](https://greenkeeper.io/)

Manages locally installed FullScreenShenanigans modules for development.

`shenanigans-manager` is a development dependency of all FullScreenShenanigans modules.
It sets up files that are kept standard across the repositories, such as GitHub templates, `README.md`s, and test infrastructure.

It can also be used as a CLI while developing those modules locally.

## CLI

```cmd
npm install -g shenanigans-manager

shenanigans-manager --help
```

The `shenanigans-manager` CLI provides commands that are often useful for developing multiple modules.
The full list of commands is in `src/Commands`.
Each command may take in some parameters, while all commands can also be extended with:

* `--directory`: Sets a different root directory to search for repositories under.
* `--all`: Run the command on all repositories _(overrides any `--repository` CLL flags)_.

### `complete-setup`

The `complete-setup` command will create a directory with all repositories `npm link`ed to each other in the current directory:

```shell
shenanigans-manager complete-setup
```

This is particularly useful if you'd like to develop multiple modules at once.

> Note: this will take many, many minutes.

> Note: if you see npm errors, check [npm's instructions here](https://github.com/npm/npm/issues/17444#issuecomment-393761515).

### Examples

Opening a repository's page on GitHub:

```shell
shenanigans-manager open-on-github --repository EightBittr
```

Running TSLint in `--fix` mode across all repositories under `C:/Code/Shenanigans`:

```shell
shenanigans-manager tslint-fix --all --directory C:/Code/Shenanigans
```

#### `exec`

Consider using a cmd or batch script instead of `--exec` with `--all`:

* Mac/Linux: `for d in ./*/ ; do (cd "$d" && command); done`
* Windows: `for /d %i in (C:\Code\Shenanigans\*) do ( cd "%i" & command )`

For example, to completely remove and update `node_modules/` and `package-lock.json` from each repository on Windows:

```shell
for /d %i in (C:\Code\Shenanigans\*) do ( cd "%i" & rmdir node_modules /s /q & del package-lock.json & ncu -u && npm i && npm audit fix )
```

### Configuration

For now, `src/settings.ts`/`src/settings.js` stores the default directory and repository names that will be manipulated.

## Development

Fork the repository on GitHub, clone it, and install dependencies:

```cmd
git clone https://github.com/<your-name>/shenanigans-manager
cd shenanigans-manager
npm install
```

Use `npm run src` to completely rebuild.

* `npm run src:tsc` (`tsc -p .`) rebuilds TypeScript files.
* `npm run watch` (`tsc -p . -watch`) rebuilds in watch mode.
