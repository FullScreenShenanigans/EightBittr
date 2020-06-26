import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Hydrate } from "./hydrate";

/**
 * Args for a bootstrap-package command.
 */
export interface IBootstrapPackageCommandArgs extends IRepositoryCommandArgs {
    /**
     * Package description of the package.
     */
    description: string;

    /**
     * Whether to include the shenanigans dist setting.
     */
    dist?: boolean;

    /**
     * PascalCase name of the package.
     */
    name: string;

    /**
     * Whether the package is a standalone repository ('external') or part of the monorepo ('internal').
     */
    mode: "external" | "internal";
}

/**
 * Creates a new package.
 */
export const BootstrapPackage = async (
    runtime: IRuntime,
    args: IBootstrapPackageCommandArgs
): Promise<any> => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "description", "mode", "name");

    const repo = args.mode === "external" ? args.name : "EightBittr";

    await fs.writeFile(
        path.join(args.directory, args.repository, "package.json"),
        JSON.stringify(
            {
                author: {
                    email: "me@joshuakgoldberg.com",
                    name: "Josh Goldberg",
                },
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
                    ...(args.mode === "external" && { external: true }),
                    name: args.name,
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
