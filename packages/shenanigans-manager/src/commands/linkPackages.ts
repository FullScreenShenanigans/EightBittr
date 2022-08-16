import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command.js";
import { packagesDirName } from "../directories.js";
import { Runtime } from "../runtime.js";
import { Shell } from "../shell.js";
import { globAsync } from "../utils.js";

/**
 * Links a repository to all packages in the EightBittr monorepo.
 */
export const LinkPackages = async (runtime: Runtime, args: RepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const packageNames = (await globAsync(path.join(packagesDirName, "*"))).map((packageName) =>
        packageName.slice(packageName.lastIndexOf("/") + 1)
    );
    console.log({ packageNames });
    const shell = new Shell(runtime.logger);

    for (const packageName of packageNames) {
        await shell.execute(`yarn link ${packageName}`);
    }
};
