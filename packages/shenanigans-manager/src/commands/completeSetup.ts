import { Command, ICommandArgs } from "../command";
import { ensurePathExists } from "../utils";
import { CloneRepository, ICloneRepositoryArgs } from "./cloneRepository";
import { CompleteBuild } from "./completeBuild";
import { Gulp } from "./gulp";
import { GulpSetup } from "./gulpSetup";
import { Link } from "./link";
import { LinkToDependencies } from "./linkToDependencies";
import { NpmInstall } from "./npmInstall";

/**
 * Arguments for a CompleteRepository command.
 */
export interface ICompleteRepositoryArgs extends ICommandArgs {
    /**
     * "repository=organization" pairs of organization overrides.
     */
    fork?: string | string[];
}

/**
 * Parses forks settings into overrides for child repository clones.
 *
 * @param forks   "repository=organization" pairs of organization overrides.
 * @returns An object keying repositories to organization overrides.
 */
const parseForks = (forks: string | string[]): { [i: string]: string } => {
    if (typeof forks === "string") {
        forks = [forks];
    }

    const overrides: { [i: string]: string } = {};

    for (const pair of forks) {
        const [repository, fork] = pair.split("=");

        overrides[repository.toLowerCase()] = fork;
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

        for (const command of [CloneRepository, NpmInstall, Gulp, Link]) {
            await this.subroutine(
                command,
                {
                    directory: this.args.directory,
                    repository: "gulp-shenanigans"
                });
        }

        for (const repository of this.settings.allRepositories) {
            await ensurePathExists(this.args.directory, repository);
        }

        const forks = parseForks(this.args.fork || []);

        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                CloneRepository,
                {
                    directory: this.args.directory,
                    fork: forks[repository] || this.settings.organization,
                    repository
                } as ICloneRepositoryArgs);
        }

        for (const command of [NpmInstall, Link, LinkToDependencies]) {
            await this.subroutineInAll(
                command,
                {
                    directory: this.args.directory
                });
        }

        await this.subroutineInAll(GulpSetup, this.args as ICommandArgs);
        await this.subroutine(CompleteBuild, this.args);
    }
}
