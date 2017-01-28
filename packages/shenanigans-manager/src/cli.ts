import * as minimist from "minimist";
import * as path from "path";

import { CommandSearcher } from "./commandSearcher";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { NameTransformer } from "./nameTransformer";
import { Runner } from "./runner";

/**
 * Parsed args from the CLI.
 */
interface IParsedArgs extends minimist.ParsedArgs {
    /**
     * Command to be run.
     */
    command: string;
}

const args: IParsedArgs = minimist(process.argv.slice(2)) as IParsedArgs;
if (!args.command) {
    throw new Error("Requires --command.");
}

(async (): Promise<void> => {
    const runner: Runner = new Runner(
        new CommandSearcher(
            [path.join(__dirname, "commands")],
            new NameTransformer()));

    try {
        const result: boolean = await runner.run({
            args,
            command: args.command,
            logger: new ConsoleLogger()
        });

        if (!result) {
            console.error(`Could not find command '${args.command}'...`);
            return;
        }

        console.log("Success?");
    } catch (error) {
        console.error(error.stack || error.message);
    }
})();
