import { defaultPathArgs, ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";

const getNpmInstallNames = (packageJson: IShenanigansPackage, key: "dependencies" | "devDependencies"): string[] => {
    const versions = packageJson[key];
    if (versions === undefined) {
        return [];
    }

    return Object.keys(versions)
        .map((value: string) => `${value}@${versions[value]}`);
};

/**
 * Installs the global dependencies for shenanigans-manager.
 */
export const InstallGlobalDependencies = async (runtime: IRuntime, args: ICommandArgs) => {
    defaultPathArgs(args, "directory");

    // tslint:disable-next-line:no-require-imports
    const packageJson = require("../../package.json");
    const installs = [
        ...getNpmInstallNames(packageJson, "dependencies"),
        ...getNpmInstallNames(packageJson, "devDependencies"),
    ];

    await new Shell(runtime.logger)
        .execute(`npm i -g ${installs.join(" ")}`);
};
