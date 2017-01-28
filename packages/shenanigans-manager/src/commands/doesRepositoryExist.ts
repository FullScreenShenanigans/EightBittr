import * as fs from "fs";
import * as path from "path";

import { Command } from "../command";

/**
 * Arguments for a DoesRepositoryExist command.
 */
export interface IDoesRepositoryExistArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Creates a repository locally.
 */
export class DoesRepositoryExist extends Command<IDoesRepositoryExistArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for whether the repository exists.
     */
    public async execute(args: IDoesRepositoryExistArgs): Promise<any> {
        return new Promise<boolean>((resolve): void => {
            fs.exists(path.join(this.settings.codeDir, args.repository), (exists: boolean): void => {
                resolve(exists);
            });
        });
    }
}
