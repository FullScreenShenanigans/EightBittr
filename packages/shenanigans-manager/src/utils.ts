import chalk from "chalk";
import * as glob from "glob";
import * as fs from "mz/fs";
import * as path from "path";

import { IPackagePaths } from "package-build-order";
import { ILogger } from "./logger";

export const ensurePathExists = async (...pathComponents: string[]): Promise<string> => {
    let currentDirectory = "";

    for (const pathComponent of pathComponents) {
        currentDirectory = path.join(currentDirectory, pathComponent);

        if (!(await fs.exists(currentDirectory))) {
            await fs.mkdir(currentDirectory);
        }
    }

    return currentDirectory;
};

/**
 * Retrieves the dependencies for a repository.
 *
 * @param repository   Directory and repository to get dependencies from.
 * @param logger   Logs on important events.
 * @returns A Promise for the repository's dependencies.
 */
export const getDependencies = async (repository: string[], logger: ILogger): Promise<{ [i: string]: string }> => {
    const packagePath = path.join(...repository, "package.json");

    try {
        return JSON.parse((await fs.readFile(packagePath)).toString()).dependencies || {};
    } catch (error) {
        logger.log(chalk.red("Could not parse", packagePath));
        throw error;
    }
};

export const parseFileJson = async <TContents extends {}> (file: string): Promise<TContents> =>
    JSON.parse((await fs.readFile(file)).toString()) as TContents;

export const globAsync = async (source: string) =>
    new Promise<string[]>((resolve, reject) => {
        glob(source, (error: Error | null, matches: string[]) => {
            if (error !== null) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });

/**
 * Converts repository names to their package paths.
 *
 * @param repositoryNames   Names of local repositories.
 * @returns Repository names keyed to their package paths.
 */
export const resolvePackagePaths = (directory: string, repositoryNames: string[]): IPackagePaths => {
    const packagePaths: IPackagePaths = {};

    for (const repositoryName of repositoryNames) {
        packagePaths[repositoryName] = path.join(directory, repositoryName, "package.json");
    }

    return packagePaths;
};

export interface IDependencyNamesAndExternals {
    dependencyNames: string[];
    externals: string[];
}

/**
 * Recursively gets the names of all a package's dependencies.
 *
 * @param basePackageLocation   Locatino of a package's package.json.
 * @returns Promise for the names of all the package's dependencies.
 */
export const getDependencyNamesAndExternalsOfPackage = async (basePackageLocation: string): Promise<IDependencyNamesAndExternals> => {
    const { dependencies, shenanigans } = await parseFileJson<Partial<IShenanigansPackage>>(basePackageLocation);

    // Packages that have no dependencies or are not from FullScreenShenanigans can be ignored
    if (dependencies === undefined || shenanigans === undefined) {
        return {
            dependencyNames: [],
            externals: [],
        };
    }

    const externalsRaw = shenanigans.externals === undefined
        ? []
        : shenanigans.externals;

    const externals = externalsRaw
        .map((external: IExternal): string =>
            `"${external.name}": "${external.js.dev}"`);

    const allDependencyNames = Object.keys(dependencies);

    for (const localDependency of Object.keys(dependencies)) {
        const modulePackageLocation = path.normalize(
            basePackageLocation.replace(
                "package.json",
                `node_modules/${localDependency}/package.json`));

        if (await fs.exists(modulePackageLocation)) {
            allDependencyNames.push(...(await getDependencyNamesAndExternalsOfPackage(modulePackageLocation)).dependencyNames);
        }
    }

    const dependencyNames = Array.from(new Set(allDependencyNames))
        .filter((dependencyName) => dependencyName !== "requirejs")
        .filter((dependencyName) => !externalsRaw.some((externalRaw) => externalRaw.name === dependencyName.toLowerCase()));

    return { dependencyNames, externals };
};
