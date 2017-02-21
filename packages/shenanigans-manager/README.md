# shenanigans-manager

Manages locally installed FullScreenShenanigans modules for development.

## Usage

```cmd
npm install -g shenanigans-manager

shenanigans-manager --help
```
 
The full list of commands is in `src/commands`.

### Configuration

For now, `src/settings.ts`/`lib/settings.js` stores the default directory and repository names that will be manipulated.


## Development

Set the project up locally to be run via Gulp:

```cmd
npm install -g gulp
npm install
gulp
```
