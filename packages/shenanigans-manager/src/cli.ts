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
const command: string = argv._[0] || "help";

const args: ICommandArgs = {
    command: command,
    directory: process.cwd(),
    ...argv
};

(async (): Promise<void> => {
    const runner: Runner = new Runner(
        new CommandSearcher(
            [path.join(__dirname, "commands")],
            new NameTransformer()));

    try {
        const result: boolean = await runner.run({
            args,
            command,
            logger: new ConsoleLogger(),
            userSettings: settings
        });

        if (!result) {
            console.error(`Could not find command '${command}'...`);
            return;
        }
    } catch (error) {
        console.error(error.stack || error.message);
    }

    const endTime: moment.Moment = moment();
    const duration: moment.Duration = moment.duration(endTime.diff(startTime));
    console.log(`\nshenanigans-manager took ${duration.humanize()}.`);
})();
