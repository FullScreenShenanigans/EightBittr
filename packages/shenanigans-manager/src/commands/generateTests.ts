import * as chokidar from "chokidar";
import * as path from "path";

import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { globAsync } from "../utils";
import { EnsureDirsExist } from "./ensureDirsExist";
import { Mustache } from "./mustache";

export interface IGenerateTestsArgs extends IRepositoryCommandArgs {
    /**
     * Whether to watch tests files and recreate HTML on change.
     */
    watch?: boolean;
}

/**
 * Creates test setup and HTML files, and optionally watches test files to recreate HTML files.
 */
export const GenerateTests = async (
    runtime: IRuntime,
    args: IGenerateTestsArgs
): Promise<void> => {
    ensureArgsExist(args, "repository");
    await EnsureDirsExist(runtime, args);

    const generate = async () => {
        const setupFiles = await globAsync(path.resolve(__dirname, "../../setup/test/*"));

        await Promise.all([
            setupFiles.map(async (setupFile) => {
                await Mustache(runtime, {
                    ...args,
                    input: setupFile,
                    output: `./test/${setupFile.slice(setupFile.lastIndexOf("/") + 1)}`,
                });
            }),
        ]);
    };

    await generate();

    if (!args.watch) {
        return;
    }

    let running = false;
    const stop = () => (running = false);

    chokidar.watch("./src/**/*.test.ts").on("all", () => {
        if (!running) {
            generate().then(stop).catch(stop);
        }
    });

    await new Promise(() => {
        runtime.logger.log(`Watching for test file changes in ${args.repository}...`);
    });
};
