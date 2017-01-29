import * as fs from "fs";

import { Command } from "../command";
import { CreateAllRepositories } from "./createAllRepositories";
import { LinkAllRepositories } from "./linkAllRepositories";
import { RunGulpInAll } from "./runGulpInAll";

/**
 * Clones, links, installs, and builds all repositories locally.
 */
export class CompleteSetup extends Command<void, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        if (!fs.existsSync(this.settings.codeDir)) {
            fs.mkdirSync(this.settings.codeDir);
        }

        await this.subroutine(
            CreateAllRepositories,
            {
                install: true
            });

        await this.subroutine(LinkAllRepositories, {});
        await this.subroutine(RunGulpInAll, {});
    }
}
