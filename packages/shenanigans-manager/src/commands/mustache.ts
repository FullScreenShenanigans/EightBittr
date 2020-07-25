import chalk from "chalk";
import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, RepositoryCommandArgs } from "../command";
import { writeFilePretty } from "../prettier";
import { Runtime } from "../runtime";
import {
    getDependencyNamesAndExternalsOfPackage,
    globAsync,
    mkdirpSafe,
    parseFileJson,
} from "../utils";

/**
 * Args for a mustache command.
 */
export interface MustacheCommandArgs extends RepositoryCommandArgs {
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
export const Mustache = async (runtime: Runtime, args: MustacheCommandArgs): Promise<any> => {
    defaultPathArgs(args, "directory", "repository");
    ensureArgsExist(args, "input", "output");

    const basePackagePath = path.join(args.directory, args.repository, "package.json");
    const basePackageJson = await parseFileJson<ShenanigansPackage>(basePackagePath);

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
        shorthand: [...basePackageJson.shenanigans.name]
            .filter((c) => c.toUpperCase() === c)
            .join(""),
        testPaths,
    };

    const inputContents = (await fs.readFile(args.input)).toString();
    const outputContents = mustache.render(inputContents, model);
    const outputFileName = mustache.render(args.output, model);

    if (!outputContents.trim()) {
        return;
    }

    runtime.logger.log(chalk.grey(`Hydrating ${outputFileName}`));

    await mkdirpSafe(path.dirname(outputFileName));
    await writeFilePretty(outputFileName, outputContents);
};
