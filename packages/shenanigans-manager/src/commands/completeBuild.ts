import chalk from "chalk";
import { buildOrder } from "package-build-order";

import { ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { resolvePackagePaths } from "../utils";
import { Exec, IExecArgs } from "./exec";

/**
 * Builds all repositories locally.
 */
export const CompleteBuild = async (runtime: IRuntime, args: ICommandArgs) => {
    const order = await buildOrder({
        paths: resolvePackagePaths(args.directory, runtime.settings.allRepositories),
    });

    runtime.logger.log([
        chalk.grey.italic("Building in order:"),
        chalk.green(order.join(" ")),
        "\n",
    ].join(" "));

    for (const packageToBuild of order) {
        const subArgs: IExecArgs = {
            directory: args.directory,
            spawn: "npm run setup && npm run verify",
            repository: packageToBuild,
        };

        const code = await Exec(runtime, subArgs);

        if (code !== 0) {
            runtime.logger.log(`\n${chalk.red("Aborting build.")}`);
            return;
        }
    }
};
