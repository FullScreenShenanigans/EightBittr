import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";

/**
 * Arguments for a DoesRepositoryExist command.
 */
export interface IDoesRepositoryExistArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Checks if a repository exists locally.
 */
export class DoesRepositoryExist extends Command<IDoesRepositoryExistArgs, void> {
    /**
     * Executes the command.
     *
     * @param args   Arguments for the command.
     * @returns A Promise for whether the repository exists.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        return await fs.exists(path.join(this.args.directory, this.args.repository));
    }
}
