import chalk from "chalk";
import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { writeFilePretty } from "../prettier";
import { IRuntime } from "../runtime";
import { getDependencyNamesAndExternalsOfPackage, globAsync } from "../utils";
import mkdirp from "mkdirp";

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
export const Mustache = async (runtime: IRuntime, args: IMustacheCommandArgs): Promise<any> => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "input", "output");

    const basePackagePath = path.join(args.directory, args.repository, "package.json");
    const basePackageJson = JSON.parse(
        (await fs.readFile(basePackagePath)).toString()
    ) as IShenanigansPackage;

    const { externals, dependencyNames } = await getDependencyNamesAndExternalsOfPackage(
        basePackagePath
    );
    const testPaths = (
        await globAsync(path.resolve(args.directory, args.repository, "lib/**/*.test.js"))
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
        externals,
        externalsRaw: (basePackageJson.shenanigans.loading?.externals || []).map((external) =>
            JSON.stringify(external, null, 4)
        ),
        nodeModules: basePackageJson.shenanigans.external
            ? "../node_modules"
            : "../../../node_modules",
        testPaths,
    };

    const inputContents = (await fs.readFile(args.input)).toString();
    const outputContents = mustache.render(inputContents, model);
    const outputFileName = mustache.render(args.output, model);

    if (!outputContents.trim()) {
        return;
    }

    runtime.logger.log(chalk.grey(`Hydrating ${outputFileName}`));

    try {
        await mkdirp(path.dirname(outputFileName));
    } catch {
        // Ignore errors: it's fine for the folder to already exist
    }

    await writeFilePretty(outputFileName, outputContents);
};
