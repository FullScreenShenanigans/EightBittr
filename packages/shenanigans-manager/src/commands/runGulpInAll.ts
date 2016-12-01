import { Command } from "../command";
import { allRepositories } from "../settings";
import { RunGulpIn } from "./runGulpIn";

/**
 * Arguments for an RunGulpInAll command.
 */
export interface IRunGulpInAllArgs {
    /**
     * Whether to run updates in parallel.
     */
    parallel?: boolean;
}

/**
 * Creates a repository locally.
 */
export class RunGulpInAll extends Command<IRunGulpInAllArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IRunGulpInAllArgs): Promise<any> {
        return args.parallel ? this.executeInParallel() : this.executeInSeries();
    }

    /**
     * Executes the command in parallel.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async executeInParallel(): Promise<any> {
        await Promise.all(
            allRepositories.map(
                (repository: string): Promise<void> => {
                    return Command.execute(this.logger, RunGulpIn, { repository });
                }));
    }

    /**
     * Executes the command in series.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async executeInSeries(): Promise<any> {
        for (const repository of allRepositories) {
            await Command.execute(this.logger, RunGulpIn, { repository });
        }
    }
}
