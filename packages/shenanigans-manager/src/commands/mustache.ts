import chalk from "chalk";
import { promises as fs } from "fs";
import mustache from "mustache";
import * as path from "path";

import { defaultPathArgs, ensureArgsExist, RepositoryCommandArgs } from "../command.js";
import { writeFilePretty } from "../prettier.js";
import { Runtime } from "../runtime.js";
import { ShenanigansPackage } from "../typings.js";
import {
    getDependencyNamesAndExternalsOfPackage,
    globAsync,
    mkdirpSafe,
    parseFileJson,
} from "../utils.js";

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
    const nodeModules = basePackageJson.shenanigans.external
        ? "../node_modules"
        : "../../../node_modules";

    const { externals, dependencyNames } = await getDependencyNamesAndExternalsOfPackage(
        basePackagePath,
        nodeModules,
        !!basePackageJson.shenanigans.game
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
        dependenciesBase: nodeModules,
        dependencyNames,
        devDependencyNames: Object.keys(basePackageJson.devDependencies ?? {}),
        externals,
        externalsBase: nodeModules,
        externalsRaw: (basePackageJson.shenanigans.loading?.externals ?? []).map((external) =>
            JSON.stringify(external, null, 4)
        ),
        nodeModules,
        resolveAliasBase: basePackageJson.shenanigans.example ? "../../packages" : nodeModules,
        shenanigansPackage: basePackageJson.shenanigans.example
            ? "../../../packages"
            : nodeModules,
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
