import * as fs from "fs";

import { Command, ICommandArgs } from "../command";
import { CreateAllRepositories } from "./createAllRepositories";
import { LinkAllRepositories } from "./linkAllRepositories";
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
        if (!fs.existsSync(this.args.directory)) {
            fs.mkdirSync(this.args.directory);
        }

        await this.subroutine(
            CreateAllRepositories as any,
            {
                ...this.args,
                install: true
            });

        await this.subroutine(LinkAllRepositories, this.args);
        await this.subroutine(RunGulpInAll, this.args);
    }
}
