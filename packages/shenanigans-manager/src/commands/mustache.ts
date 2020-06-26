import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { getDependencyNamesOfPackage, globAsync } from "../utils";

/**
 * Args for a mustache command.
 */
export interface IMustacheCommandArgs extends IRepositoryCommandArgs {
    /**
     * Absolute input file path.
     */
    input: string;

    /**
     * Absolute output file path.
     */
    output: string;
}

/**
 * Copies a file with mustache logic from a repository's package.json.
 */
export const Mustache = async (_runtime: IRuntime, args: IMustacheCommandArgs): Promise<any> => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "input", "output");

    const basePackagePath = path.join(args.directory, args.repository, "package.json");
    const basePackageJson = JSON.parse(
        (await fs.readFile(basePackagePath)).toString()
    ) as IShenanigansPackage;

    const dependencyNames = await getDependencyNamesOfPackage(basePackagePath);
    const testPaths = (
        await globAsync(path.resolve(args.directory, args.repository, "src/**/*.test.ts*"))
    )
        .map((testPath) => testPath.replace(/\.test\.(tsx|ts)/gi, ".test.js"))
        .map((testPath) =>
            path
                .join("..", path.relative(path.join(args.directory, args.repository), testPath))
                .replace(/\\/g, "/")
        );

    const model = {
        ...basePackageJson,
        dependencyNames,
        devDependencyNames: Object.keys(basePackageJson.devDependencies || {}),
        testPaths,
    };

    const inputContents = (await fs.readFile(args.input)).toString();
    const outputContents = mustache.render(inputContents, model);

    await fs.writeFile(args.output, outputContents);
};
