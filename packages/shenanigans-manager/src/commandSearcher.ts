import * as fs from "mz/fs";
import * as path from "path";

import { ICommandClass } from "./command";
import { NameTransformer } from "./nameTransformer";

/**
 * Searches for Command classes.
 */
export interface ICommandSearcher {
    /**
     * Searches for a Command sub-class within the directories.
     * 
     * @param name   Dashed-case name of the Command sub-class.
     * @type TCommandClass   Type of the command.
     * @returns The Command sub-class, if it can be found.
     */
    search<TCommandClass extends ICommandClass<any, any>>(name: string): TCommandClass | undefined;
}

/**
 * Searches for Command classes.
 */
export class CommandSearcher implements ICommandSearcher {
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
     * @type TCommandClass   Type of the command.
     * @returns A Promise for the Command sub-class, if it can be found.
     */
    public async search<TCommandClass extends ICommandClass<any, any>>(name: string): Promise<TCommandClass | undefined> {
        const camelCaseName: string = this.nameTransformer.toCamelCase(name);

        for (const directory of this.directories) {
            const joinedPath: string = path.join(directory, camelCaseName + ".js");

            if (await fs.exists(joinedPath)) {
                return require(joinedPath)[this.nameTransformer.toPascalCase(name)];
            }
        }

        return undefined;
    }
}
