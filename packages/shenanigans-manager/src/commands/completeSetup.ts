import { Command } from "../command";
import { CreateAllRepositories } from "./createAllRepositories";
import { UpdateGulpShenanigansInAll } from "./updateGulpShenanigansInAll";
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
        await this.subroutine(
            CreateAllRepositories,
            {
                install: true,
                link: true
            });

        await this.subroutine(UpdateGulpShenanigansInAll, {});
        await this.subroutine(RunGulpInAll, {});
    }
}
