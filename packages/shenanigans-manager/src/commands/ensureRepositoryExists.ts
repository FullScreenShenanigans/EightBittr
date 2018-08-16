import { IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { CloneRepository } from "./cloneRepository";
import { DoesRepositoryExist } from "./doesRepositoryExist";

/**
 * Clones a repository locally if it doesn't yet exist.
 */
export const EnsureRepositoryExists = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    if (!(await DoesRepositoryExist(args))) {
        await CloneRepository(runtime, args);
    }
};
