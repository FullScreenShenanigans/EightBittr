import chalk from "chalk";
import glob from "glob";
import mkdirp from "mkdirp";
import * as fs from "mz/fs";
import * as path from "path";

import { IRepositoryCommandArgs } from "./command";
import { ILogger } from "./logger";

export const setupDir = path.join(__dirname, "../setup");

export const mkdirpSafe = async (dir: string) => {
    try {
        await mkdirp(dir);
    } catch {
        // Ignore errors: it's fine for the folder to already exist
    }
};

/**
 * Retrieves the dependencies for a repository.
 *
 * @param repository   Directory and repository to get dependencies from.
 * @param logger   Logs on important events.
 * @returns A Promise for the repository's dependencies.
 */
export const getDependencies = async (
    repository: string[],
    logger: ILogger
): Promise<{ [i: string]: string }> => {
    const packagePath = path.join(...repository, "package.json");

    try {
        return JSON.parse((await fs.readFile(packagePath)).toString()).dependencies || {};
    } catch (error) {
        logger.log(chalk.red("Could not parse", packagePath));
        throw error;
    }
};

export const parseFileJson = async <TContents extends {}>(file: string): Promise<TContents> =>
    JSON.parse((await fs.readFile(file)).toString()) as TContents;

export const globAsync = async (source: string) =>
    new Promise<string[]>((resolve, reject) => {
        glob(source, { dot: true }, (error: Error | null, matches: string[]) => {
            if (error !== null) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });

export const getShenanigansPackageContents = async (args: IRepositoryCommandArgs) => {
    const filePath = path.join(args.directory, args.repository, "package.json");
    const packageContentsBase = await fs.readFile(filePath);
    const packageContents: IShenanigansPackage = JSON.parse(packageContentsBase.toString());

    return packageContents;
};

export interface IDependencyNamesAndExternals {
    /**
     * Unique names of dependencies of the package.
     */
    dependencyNames: string[];

    /**
     * Required external files that must exist at runtime.
     */
    externals: string[];
}

/**
 * Recursively gets the names of all a package's dependencies.
 *
 * @param basePackageLocation   Location of a package's package.json.
 * @returns Promise for the names of all the package's dependencies.
 */
export const getDependencyNamesAndExternalsOfPackage = async (
    basePackageLocation: string
): Promise<IDependencyNamesAndExternals> => {
    const { dependencies, shenanigans } = await parseFileJson<Partial<IShenanigansPackage>>(
        basePackageLocation
    );

    // Packages that have no dependencies or are not from FullScreenShenanigans can be ignored
    if (dependencies === undefined || shenanigans === undefined) {
        return {
            dependencyNames: [],
            externals: [],
        };
    }

    const externalsRaw = shenanigans.loading?.externals ?? [];
    const externals = externalsRaw.map(
        (external: IExternal): string => `"${external.name}": "${external.js.dev}"`
    );

    const allDependencyNames = Object.keys(dependencies);

    for (let i = 0; i < allDependencyNames.length; i += 1) {
        const localDependency = allDependencyNames[i];
        const modulePackageLocation = path.normalize(
            basePackageLocation.replace(
                "package.json",
                `node_modules/${localDependency}/package.json`
            )
        );

        if (await fs.exists(modulePackageLocation)) {
            allDependencyNames.push(
                ...(await getDependencyNamesAndExternalsOfPackage(modulePackageLocation))
                    .dependencyNames
            );
        }
    }

    const dependencyNames = Array.from(new Set(allDependencyNames))
        .filter((dependencyName) => dependencyName !== "requirejs")
        .filter(
            (dependencyName) =>
                !externalsRaw.some(
                    (externalRaw) => externalRaw.name === dependencyName.toLowerCase()
                )
        );

    return { dependencyNames, externals };
};
