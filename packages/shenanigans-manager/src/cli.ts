import * as minimist from "minimist";
import * as moment from "moment";
import * as path from "path";

import { ICommandArgs } from "./command";
import { CommandSearcher } from "./commandSearcher";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { NameTransformer } from "./nameTransformer";
import { Runner } from "./runner";
import { settings } from "./settings";

const startTime: moment.Moment = moment();

const argv: minimist.ParsedArgs = minimist(process.argv.slice(2));
const commandName: string = argv._[0] || "help";

const args: ICommandArgs = {
    commandName,
    directory: process.cwd(),
    ...argv
};

const main = async (): Promise<void> => {
    const runner: Runner = new Runner(
        new CommandSearcher(
            [path.join(__dirname, "commands")],
            new NameTransformer()));

    try {
        const result: boolean = await runner.run({
            all: argv.all,
            args,
            commandName,
            logger: new ConsoleLogger(),
            userSettings: settings
        });

        if (!result) {
            console.error(`Could not find command '${commandName}'...`);
            return;
        }
    } catch (error) {
        console.error(error.stack || error.message);
    }

    if (commandName !== "help") {
        const endTime: moment.Moment = moment();
        const duration: moment.Duration = moment.duration(endTime.diff(startTime));
        console.log(`\nshenanigans-manager ${commandName} took ${duration.humanize()}.`);
    }
};

// tslint:disable-next-line no-floating-promises
main().catch((error) => {
    console.error(error);
});
