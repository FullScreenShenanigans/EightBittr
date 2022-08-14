import { Runtime } from "../runtime.js";
import { HydrateFiles, HydrateFilesCommandArgs } from "./hydrateFiles.js";
import { HydratePackageJson } from "./hydratePackageJson.js";
import { HydrateReadme } from "./hydrateReadme.js";

/**
 * Calls a repository's hydration commands.
 */
export const Hydrate = async (runtime: Runtime, args: HydrateFilesCommandArgs) => {
    await HydratePackageJson(runtime, args);
    await HydrateFiles(runtime, args);
    await HydrateReadme(runtime, args);
};
