import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { getDependencyNamesAndExternalsOfPackage } from "../utils";

/**
 * Args for a mustache command.
 */
export interface IMustacheCommandArgs extends IRepositoryCommandArgs {
    /**
     * Relative input file path.
     */
    input: string;

    /**
     * Relative output file path.
     */
    output: string;
}

/**
 * Copies a file with mustache logic from a repository's package.json.
 */
export const Mustache = async (_runtime: IRuntime, args: IMustacheCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "input", "output");

    const basePackagePath = path.join(args.directory, args.repository, "package.json");
    const basePackageJson = JSON.parse((await fs.readFile(basePackagePath)).toString()) as IShenanigansPackage;

    const inputPath = path.join(args.directory, args.repository, args.input);
    const outputPath = path.join(args.directory, args.repository, args.output);

    const { dependencyNames } = await getDependencyNamesAndExternalsOfPackage(basePackagePath);

    const view = {
        ...basePackageJson,
        dependencyNames,
        devDependencyNames: Object.keys(basePackageJson.devDependencies || {}),
        externalsRaw: (basePackageJson.shenanigans.externals || [])
            .map((external) => JSON.stringify(external)),
    };

    const inputContents = (await fs.readFile(inputPath)).toString();
    const outputContents = mustache.render(inputContents, view);

    await fs.writeFile(outputPath, outputContents);
};
