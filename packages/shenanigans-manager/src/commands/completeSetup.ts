import * as fs from "mz/fs";

import { Command, ICommandArgs } from "../command";
import { CloneAllRepositories } from "./cloneAllRepositories";
import { LinkToDependenciesInAll } from "./linkToDependenciesInAll";
import { RunGulpInAll } from "./runGulpInAll";

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

        await this.subroutine(
            CloneAllRepositories as any,
            {
                ...this.args,
                install: true
            });

        await this.subroutine(RunGulpInAll, this.args);
        await this.subroutine(LinkToDependenciesInAll, this.args);
    }
}
