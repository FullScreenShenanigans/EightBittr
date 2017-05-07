import * as fs from "mz/fs";

import { Command, ICommandArgs } from "../command";
import { CloneRepository } from "./cloneRepository";
import { Link } from "./link";
import { LinkToDependencies } from "./linkToDependencies";
import { RunGulp } from "./runGulp";
import { RunGulpSetup } from "./runGulpSetup";

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
        this.ensureArgsExist("directory");

        if (!(await fs.exists(this.args.directory))) {
            await fs.mkdir(this.args.directory);
        }

        await this.subroutineInAll(
            CloneRepository,
            {
                ...this.args,
                install: true
            } as ICommandArgs);

        await this.subroutineInAll(RunGulpSetup, this.args);
        await this.subroutineInAll(RunGulp, this.args);
        await this.subroutineInAll(Link, this.args);
        await this.subroutineInAll(LinkToDependencies, this.args);
    }
}
