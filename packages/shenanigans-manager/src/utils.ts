import * as chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

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
