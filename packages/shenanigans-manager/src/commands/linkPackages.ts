import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command";
import { Runtime } from "../runtime";
import { globAsync } from "../utils";
import { Shell } from "../shell";

/**
 * Links a repository to all packages in the EightBittr monorepo.
 */
export const LinkPackages = async (runtime: Runtime, args: RepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const packageNames = (
        await globAsync(path.join(__dirname, "../../../*"))
    ).map((packageName) => packageName.slice(packageName.lastIndexOf("/") + 1));
    const shell = new Shell(runtime.logger);

    for (const packageName of packageNames) {
        await shell.execute(`yarn link ${packageName}`);
    }
};
