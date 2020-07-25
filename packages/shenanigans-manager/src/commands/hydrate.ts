import { Runtime } from "../runtime";
import { HydrateFiles, HydrateFilesCommandArgs } from "./hydrateFiles";
import { HydrateReadme } from "./hydrateReadme";
import { HydratePackageJson } from "./hydratePackageJson";

/**
 * Calls a repository's hydration commands.
 */
export const Hydrate = async (runtime: Runtime, args: HydrateFilesCommandArgs) => {
    await HydratePackageJson(runtime, args);
    await HydrateFiles(runtime, args);
    await HydrateReadme(runtime, args);
};
