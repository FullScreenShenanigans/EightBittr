import { existsSync } from "fs";
import * as path from "path";

import { Command } from "./command.js";
import { NameTransformer } from "./nameTransformer.js";

/**
 * Searches for Command classes.
 */
export class CommandSearcher {
    /**
     * Directories to search within.
     */
    private readonly directories: string[];

    /**
     * Transforms dashed-case names to camelCase.
     */
    private readonly nameTransformer: NameTransformer;

    /**
     * Initializes a new instance of the CommandSearcher class.
     *
     * @param nameTransformer  Transforms dashed-case names to camelCase.
     * @param directories   Directories to search within.
     */
    public constructor(
        directories: string[],
        nameTransformer: NameTransformer = new NameTransformer()
    ) {
        this.nameTransformer = nameTransformer;
        this.directories = directories;
    }

    /**
     * Searches for a Command sub-class within the directories.
     *
     * @param name   Dashed-case name of the Command sub-class.
     * @template TCommand   Type of the command.
     * @returns A Promise for the Command sub-class, if it can be found.
     */
    public async search<TCommand extends Command>(name: string): Promise<TCommand | undefined> {
        const camelCaseName = this.nameTransformer.toCamelCase(name);

        for (const directory of this.directories) {
            const joinedPath = path.join(directory, `${camelCaseName}.js`);

            if (existsSync(joinedPath)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                return (await import(joinedPath))[this.nameTransformer.toPascalCase(name)];
            }
        }

        return undefined;
    }
}
