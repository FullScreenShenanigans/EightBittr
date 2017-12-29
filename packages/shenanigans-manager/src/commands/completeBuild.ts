import chalk from "chalk";
import { buildOrder } from "package-build-order";

import { ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { resolvePackagePaths } from "../utils";
import { Exec, IExecArgs } from "./exec";

/**
 * Args for a CompleteBuild command.
 */
export interface ICompleteBuildArgs extends ICommandArgs {
    /**
     * Offset or repository name to start building in order at.
     */
    start?: number | string;
}

const factorOrderStart = (fullOrder: string[], start: number | string | undefined): string[] => {
    if (start === undefined) {
        return fullOrder;
    }

    if (typeof start === "string") {
        start = fullOrder.indexOf(start);
    }

    return fullOrder.slice(start);
};

/**
 * Builds all repositories locally.
 */
export const CompleteBuild = async (runtime: IRuntime, args: ICompleteBuildArgs) => {
    const fullOrder = await buildOrder({
        paths: resolvePackagePaths(args.directory, runtime.settings.allRepositories),
    });
    const order = factorOrderStart(fullOrder, args.start);

    runtime.logger.log([
        chalk.grey.italic("Building in order:"),
        chalk.green(fullOrder.join(" ")),
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
