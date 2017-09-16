import { Command, ICommandArgs, ISubroutineInAllOverrides } from "../command";
import { ensurePathExists } from "../utils";
import { CloneRepository, ICloneRepositoryArgs } from "./cloneRepository";
import { CompleteBuild } from "./completeBuild";
import { Gulp } from "./gulp";
import { GulpSetup } from "./gulpSetup";
import { LinkRepository } from "./linkRepository";
import { NpmInstall } from "./npmInstall";

/**
 * Arguments for a CompleteRepository command.
 */
export interface ICompleteRepositoryArgs extends ICommandArgs {
    /**
     * "repository=organization" pairs of organization overrides.
     */
    forks?: string | string[];
}

/**
 * Parses forks settings into overrides for child repository clones.
 *
 * @param forks   "repository=organization" pairs of organization overrides.
 */
const parseForks = (forks: string | string[]): ISubroutineInAllOverrides<ICloneRepositoryArgs> => {
    if (typeof forks === "string") {
        forks = [forks];
    }

    const overrides: ISubroutineInAllOverrides<ICloneRepositoryArgs> = {};

    for (const pair of forks) {
        const [repository, fork] = pair.split("=");

        overrides[repository] = { fork };
    }

    return overrides;
};

/**
 * Clones, links, installs, and builds all repositories locally.
 */
export class CompleteSetup extends Command<ICompleteRepositoryArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory");
        await ensurePathExists(this.args.directory);

        await this.subroutine(
            CloneRepository,
            {
                directory: this.args.directory,
                repository: "gulp-shenanigans"
            });

        await this.subroutine(
            NpmInstall,
            {
                directory: this.args.directory,
                repository: "gulp-shenanigans"
            });

        await this.subroutine(
            Gulp,
            {
                directory: this.args.directory,
                repository: "gulp-shenanigans"
            });

        for (const repository of this.settings.allRepositories) {
            await ensurePathExists(this.args.directory, repository);
        }

        await this.subroutineInAll(
            CloneRepository,
            {
                directory: this.args.directory
            },
            parseForks(this.args.forks || []));

        await this.subroutineInAll(
            NpmInstall,
            {
                directory: this.args.directory
            });

        await this.subroutineInAll(
            LinkRepository,
            {
                directory: this.args.directory
            });

        await this.subroutineInAll(GulpSetup, this.args as ICommandArgs);
        await this.subroutine(CompleteBuild, this.args);
    }
}
