import mkdirp from "mkdirp";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, RepositoryCommandArgs } from "../command";
import { Runtime } from "../runtime";
import { Hydrate } from "./hydrate";

/**
 * Args for a bootstrap-package command.
 */
export interface BootstrapPackageCommandArgs extends RepositoryCommandArgs {
    /**
     * Package description of the package.
     */
    description: string;

    /**
     * Whether to include the sheananigans.dist setting in package.json.
     */
    dist?: boolean;

    /**
     * Whether to include the sheananigans.game setting in package.json.
     */
    game?: boolean;

    /**
     * Whether the package is a standalone repository ('external') or part of the monorepo ('internal').
     */
    mode: "external" | "internal";

    /**
     * PascalCase name of the package.
     */
    name: string;

    /**
     * Whether to include the sheananigans.web setting in package.json.
     */
    web?: boolean;
}

/**
 * Creates a new package.
 */
export const BootstrapPackage = async (
    runtime: Runtime,
    args: BootstrapPackageCommandArgs
): Promise<any> => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "description", "mode", "name");

    const repo = args.mode === "external" ? args.name : "EightBittr";

    await mkdirp(path.join(args.directory, args.repository));
    await fs.writeFile(
        path.join(args.directory, args.repository, "package.json"),
        JSON.stringify(
            {
                bugs: {
                    url: `https://github.com/FullScreenShenanigans/${repo}/issues`,
                },
                description: args.description,
                license: "MIT",
                name: args.name.toLowerCase(),
                package: {
                    type: "git",
                    url: `ssh://git@github.com:FullScreenShenanigans/${repo}.git`,
                },
                shenanigans: {
                    ...(args.dist && { dist: true }),
                    ...(args.game && { game: true }),
                    ...(args.mode === "external" && { external: true }),
                    name: args.name,
                    ...(args.web && { web: true }),
                },
                version: "0.0.1",
            },
            null,
            4
        )
    );

    await Hydrate(runtime, {
        ...args,
        bootstrap: args.mode,
    });
};
