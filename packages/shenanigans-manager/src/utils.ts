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
