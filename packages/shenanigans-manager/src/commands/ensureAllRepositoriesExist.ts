import { Command } from "../command";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for an EnsureAllRepositoriesExist command.
 */
export interface IEnsureAllRepositoriesExistArgs {
    /**
     * Whether to run installs in parallel.
     */
    parallel?: boolean;

    /**
     * Whether to also install the repository's dependencies.
     */
    install?: boolean;
}

/**
 * Ensures all repositories exist.
 */
export class EnsureAllRepositoriesExist extends Command<IEnsureAllRepositoriesExistArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IEnsureAllRepositoriesExistArgs): Promise<any> {
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
            this.settings.allRepositories.map(
                async (repository: string): Promise<void> => {
                    await this.subroutine(
                        EnsureRepositoryExists,
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
     * @returns A Promise for ensuring the repository exists.
     */
    public async executeInSeries(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                EnsureRepositoryExists,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
