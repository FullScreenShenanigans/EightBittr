import * as fs from "mz/fs";

import { Command, ICommandArgs } from "../command";
import { CloneRepository } from "./cloneRepository";
import { LinkToDependencies } from "./linkToDependencies";
import { RunGulp } from "./runGulp";

/**
 * Clones, links, installs, and builds all repositories locally.
 */
export class CompleteSetup extends Command<ICommandArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        if (!(await fs.exists(this.args.directory))) {
            await fs.mkdir(this.args.directory);
        }

        await this.subroutineInAll(
            CloneRepository,
            {
                ...this.args,
                install: true
            } as ICommandArgs);

        await this.subroutineInAll(RunGulp, this.args);
        await this.subroutineInAll(LinkToDependencies, this.args);
    }
}
