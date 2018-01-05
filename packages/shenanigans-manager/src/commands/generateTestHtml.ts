import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { globAsync, parseFileJson } from "../utils";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Recursively gets the names of all a package's dependencies.
 *
 * @param basePackageLocation   Locatino of a package's package.json.
 * @returns Promise for the names of all the package's dependencies.
 */
const getDependencyNamesOfPackage = async (basePackageLocation: string): Promise<string[]> => {
    const { dependencies, shenanigans } = await parseFileJson<Partial<IShenanigansPackage>>(basePackageLocation);

    // Packages that have no dependencies or are not from FullScreenShenanigans can be ignored
    if (dependencies === undefined || shenanigans === undefined) {
        return [];
    }

    const dependencyNames = Object.keys(dependencies);

    for (const localDependency of Object.keys(dependencies)) {
        const modulePackageLocation = path.normalize(
            basePackageLocation.replace(
                "package.json",
                `node_modules/${localDependency}/package.json`));

        if (await fs.exists(modulePackageLocation)) {
            dependencyNames.push(...(await getDependencyNamesOfPackage(modulePackageLocation)));
        }
    }

    return Array.from(new Set(dependencyNames));
};

/**
 * Generates the HTML page for a repository's tests.
 */
export const GenerateTestHtml = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    await EnsureRepositoryExists(runtime, args);

    const basePackageLocation = path.join(args.directory, args.repository, "package.json");
    const basePackageContents = await parseFileJson<IShenanigansPackage>(basePackageLocation);

    const testTemplate = (await fs.readFile(path.resolve(__dirname, "../../setup/test.html"))).toString();
    const testPaths = (await globAsync(path.resolve(args.directory, args.repository, "src/**/*.test.ts*")))
        .map((testPath) => testPath.replace(/\.test\.(tsx|ts)/gi, ".test.js"))
        .map((testPath) => path.join("..", path.relative(path.join(args.directory, args.repository), testPath))
            .replace(/\\/g, "/"));

    const externalsRaw = basePackageContents.shenanigans.externals === undefined
        ? []
        : basePackageContents.shenanigans.externals;

    const externals = externalsRaw
        .map((external: IExternal): string =>
            `"${external.name}": "${external.js.dev}"`);

    const newTestContents = mustache.render(
        testTemplate,
        {
            ...basePackageContents,
            dependencyNames: (await getDependencyNamesOfPackage(basePackageLocation))
                .filter((dependencyName) => dependencyName !== "requirejs")
                .filter((dependencyName) => !externalsRaw.some((externalRaw) => externalRaw.name === dependencyName.toLowerCase())),
            externals,
            testPaths,
        });

    await fs.writeFile(
        path.join(args.directory, args.repository, "test/index.html"),
        newTestContents);
};
