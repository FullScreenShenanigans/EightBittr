import minimist from "minimist";
import * as path from "path";

import { CommandArgs } from "./command.js";
import { CommandSearcher } from "./commandSearcher.js";
import { filesDirName } from "./directories.js";
import { ConsoleLogger } from "./loggers/consoleLogger.js";
import { NameTransformer } from "./nameTransformer.js";
import { Runner } from "./runner.js";

const argv = minimist(process.argv.slice(2));
const commandName = argv._[0] || "help";

/**
 * @remarks
 * If a command is being run by a package in a Lerna monorepo, default to allowing it as the repository.
 */
const parseArgsLocation = () => {
    const cwd = process.cwd();
    const match = /(^.*packages)(\/|\\)(.+)$/.exec(cwd);
    if (!match) {
        return { directory: cwd };
    }

    return {
        directory: match[1],
        repository: match[3],
    };
};

const main = async (): Promise<void> => {
    const args = {
        commandName,
        ...parseArgsLocation(),
        ...argv,
    };

    const runner = new Runner(
        new CommandSearcher([path.join(filesDirName, "commands")], new NameTransformer())
    );

    try {
        const result = await runner.run({
            args: args as CommandArgs,
            commandName,
            logger: new ConsoleLogger(process.stderr, process.stdout),
        });

        if (!result) {
            console.error(`Could not find command '${commandName}'...`);
            return;
        }
    } catch (error) {
        console.error("shenanigans-manager error:", error);
        return;
    }
};

main().catch((error) => {
    console.error("Oh no!", error);
});
