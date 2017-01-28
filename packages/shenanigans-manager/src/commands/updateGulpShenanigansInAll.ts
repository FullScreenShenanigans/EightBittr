import { Command } from "../command";
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
     * @returns A Promise for executing the command.
     */
    public async execute(args: IUpdateGulpShenanigansInAllArgs): Promise<any> {
        return args.parallel ? this.executeInParallel() : this.executeInSeries();
    }

    /**
     * Executes the command in parallel.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for executing the command in parallel.
     */
    public async executeInParallel(): Promise<any> {
        await Promise.all(
            this.settings.allRepositories.map(
                async (repository: string): Promise<void> => {
                    await this.subroutine(
                        UpdateGulpShenanigansIn,
                        {
                            ...this.args,
                            repository
                        });
                }));
    }

    /**
     * Executes the command in series.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for executing the command in series.
     */
    public async executeInSeries(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                UpdateGulpShenanigansIn,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
