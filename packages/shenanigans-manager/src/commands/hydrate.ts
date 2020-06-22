
import { IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { HydrateReadme } from "./hydrateReadme";
import { HydratePackageJson } from "./hydratePackageJson";

/**
 * Calls a repository's hydration commands.
 */
export const Hydrate = async (
    runtime: IRuntime,
    args: IRepositoryCommandArgs
) => {
    await HydratePackageJson(runtime, args);
    await HydrateReadme(runtime, args);
};
