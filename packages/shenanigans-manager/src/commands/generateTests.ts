import * as chokidar from "chokidar";

import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { copyTemplatesRecursive } from "../copyTemplatesRecursive";
import { IRuntime } from "../runtime";
import { EnsureDirsExist } from "./ensureDirsExist";

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
    await copyTemplatesRecursive(runtime, args, "test");

    if (!args.watch) {
        return;
    }

    let running = false;
    const stop = () => (running = false);

    chokidar.watch("./src/**/*.test.ts").on("all", () => {
        if (!running) {
            copyTemplatesRecursive(runtime, args, "test").then(stop).catch(stop);
        }
    });

    await new Promise(() => {
        runtime.logger.log(`Watching for test file changes in ${args.repository}...`);
    });
};
