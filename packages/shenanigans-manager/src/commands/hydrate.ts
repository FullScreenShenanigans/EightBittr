import { IRuntime } from "../runtime";
import { HydrateFiles, IHydrateFilesCommandArgs } from "./hydrateFiles";
import { HydrateReadme } from "./hydrateReadme";
import { HydratePackageJson } from "./hydratePackageJson";

/**
 * Calls a repository's hydration commands.
 */
export const Hydrate = async (runtime: IRuntime, args: IHydrateFilesCommandArgs) => {
    await HydratePackageJson(runtime, args);
    await HydrateFiles(runtime, args);
    await HydrateReadme(runtime, args);
};
