import * as fs from "mz/fs";
import * as path from "path";

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
