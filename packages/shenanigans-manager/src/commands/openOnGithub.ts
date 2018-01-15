import { ensureArgsExist } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";

/**
 * Arguments for an OpenOnGithub command.
 */
export interface IOpenOnGithubArgs {
    /**
     * Name of the repository.
     */
    repository: string;

    /**
     * Suffix to append to the URL.
     */
    suffix?: string;
}

/**
 * Opens a repository's page on GitHub.
 */
export const OpenOnGithub = async (runtime: IRuntime, args: IOpenOnGithubArgs) => {
    ensureArgsExist(args, "repository");

    const url = [
        "https://github.com",
        runtime.settings.organization,
        args.repository,
        args.suffix === undefined
            ? ""
            : args.suffix,
    ].join("/");

    const shell = new Shell(runtime.logger);

    await shell.execute(`chrome.exe ${url}`);
};
