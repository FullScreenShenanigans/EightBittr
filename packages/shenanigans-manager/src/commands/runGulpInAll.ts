import { Command } from "../command";
import { RunGulpIn } from "./runGulpIn";

/**
 * Arguments for a RunGulpInAll command.
 */
export interface IRunGulpInAllArgs {
    /**
     * Whether to run updates in parallel.
     */
    parallel?: boolean;
}

/**
 * Runs Gulp in multiple repositories.
 */
export class RunGulpInAll extends Command<IRunGulpInAllArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        return this.args.parallel
            ? this.executeInParallel()
            : this.executeInSeries();
    }

    /**
     * Executes the command in parallel.
     * 
     * @returns A Promise for running the command in parallel.
     */
    public async executeInParallel(): Promise<any> {
        await Promise.all(
            this.settings.allRepositories.map(
                async (repository: string): Promise<void> => {
                    await this.subroutine(
                        RunGulpIn,
                        {
                            ...this.args,
                            repository
                        });
                }));
    }

    /**
     * Executes the command in series.
     * 
     * @returns A Promise for running the command in series.
     */
    public async executeInSeries(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                RunGulpIn,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
