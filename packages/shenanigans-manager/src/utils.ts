import chalk from "chalk";
import { existsSync, promises as fs } from "fs";
import glob from "glob";
import mkdirp from "mkdirp";
import * as path from "path";

import { RepositoryCommandArgs } from "./command.js";
import { packageDirName } from "./directories.js";
import { Logger } from "./logger.js";
import { ShenanigansPackage } from "./typings.js";

export const setupDir = path.join(packageDirName, "setup");

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
    logger: Logger
): Promise<Record<string, string>> => {
    const packagePath = path.join(...repository, "package.json");

    try {
        return (
            (JSON.parse((await fs.readFile(packagePath)).toString()) as ShenanigansPackage)
                .dependencies ?? {}
        );
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

export const getShenanigansPackageContents = async (args: RepositoryCommandArgs) => {
    const filePath = path.join(args.directory, args.repository, "package.json");
    const packageContentsBase = await fs.readFile(filePath);
    const packageContents: ShenanigansPackage = JSON.parse(packageContentsBase.toString());

    return packageContents;
};

export interface DependencyNamesAndExternals {
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
): Promise<DependencyNamesAndExternals> => {
    const { dependencies, shenanigans } = await parseFileJson<Partial<ShenanigansPackage>>(
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
    const externals = externalsRaw.map((external) => `"${external.name}": "${external.js.dev}"`);

    const allDependencyNames = Object.keys(dependencies);

    for (const localDependency of allDependencyNames) {
        const modulePackageLocation = path.normalize(
            basePackageLocation.replace(
                "package.json",
                `node_modules/${localDependency}/package.json`
            )
        );

        if (existsSync(modulePackageLocation)) {
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
