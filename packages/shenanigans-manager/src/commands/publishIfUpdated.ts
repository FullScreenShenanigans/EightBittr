import * as cp from "mz/child_process";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";
import { parseFileJson } from "../utils";

/**
 * Publishes a package if its version doesn't match the npm registry's
 */
export const PublishIfUpdated = async (
    runtime: IRuntime,
    args: IRepositoryCommandArgs
) => {
    defaultPathArgs(args, "directory", "repository");

    const cwd = path.join(args.directory, args.repository);
    const { version: localVersion } = await parseFileJson<IShenanigansPackage>(path.join(cwd, "package.json"));
    const registryVersion = (await cp.exec("npm show . version", { cwd })).filter(Boolean).join("").trim();

    if (localVersion === registryVersion) {
        runtime.logger.log(`Local ${args.repository} version matches registry; skipping publish.`)
        return;
    }

    await new Shell(runtime.logger).setCwd(cwd).execute("npm publish");
};
