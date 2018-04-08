import * as fs from "mz/fs";
import * as path from "path";

import { ICommand } from "./command";
import { NameTransformer } from "./nameTransformer";

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
    public constructor(directories: string[], nameTransformer: NameTransformer = new NameTransformer()) {
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
    public async search<TCommand extends ICommand>(
        name: string,
    ): Promise<TCommand | undefined> {
        const camelCaseName: string = this.nameTransformer.toCamelCase(name);

        for (const directory of this.directories) {
            const joinedPath: string = path.join(directory, `${camelCaseName}.js`);

            if (await fs.exists(joinedPath)) {
                // tslint:disable-next-line:no-require-imports
                return require(joinedPath)[this.nameTransformer.toPascalCase(name)];
            }
        }

        return undefined;
    }
}
