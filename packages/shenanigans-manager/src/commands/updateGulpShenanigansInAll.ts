import { Command } from "../command";
import { allRepositories } from "../settings";
import { UpdateGulpShenanigansIn } from "./updateGulpShenanigansIn";

/**
 * Arguments for an UpdateGulpShenanigansInAll command.
 */
export interface IUpdateGulpShenanigansInAllArgs {
    /**
     * Whether to run updates in parallel.
     */
    parallel?: boolean;
}

/**
 * Creates a repository locally.
 */
export class UpdateGulpShenanigansInAll extends Command<IUpdateGulpShenanigansInAllArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IUpdateGulpShenanigansInAllArgs): Promise<any> {
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
                    return Command.execute(this.logger, UpdateGulpShenanigansIn, { repository });
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
            await Command.execute(this.logger, UpdateGulpShenanigansIn, { repository });
        }
    }
}
