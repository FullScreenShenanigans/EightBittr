import * as stringify from "json-stable-stringify";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { parseFileJson } from "../utils";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

const mergeOnPackageTemplate = (target: IShenanigansPackage, source: Partial<IShenanigansPackage>) => {
    if (source.devDependencies !== undefined) {
        target.devDependencies = target.devDependencies === undefined
            ? source.devDependencies
            : {
                ...target.devDependencies,
                ...source.devDependencies,
            };
    }

    if (source.scripts !== undefined) {
        for (const i in source.scripts) {
            if (i in target.scripts) {
                target.scripts[i] += ` && ${source.scripts[i]}`;
            } else {
                target.scripts[i] = source.scripts[i];
            }
        }
    }
};

const getPackageTemplate = async (basePackageContents: IShenanigansPackage): Promise<IShenanigansPackage> => {
    const packageTemplate = await parseFileJson<IShenanigansPackage>(
        path.join(__dirname, "../../setup/package.json"));

    if (basePackageContents.shenanigans.maps) {
        mergeOnPackageTemplate(
            packageTemplate,
            (await parseFileJson<IShenanigansPackage>(path.join(__dirname, "../../setup/package-maps.json"))));
    }

    if (basePackageContents.shenanigans.web !== undefined) {
        mergeOnPackageTemplate(
            packageTemplate,
            (await parseFileJson<IShenanigansPackage>(path.join(__dirname, "../../setup/package-web.json"))));
    }

    return packageTemplate;
};

/**
 * Updates a repository's package.json.
 */
export const HydratePackageJson = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    await EnsureRepositoryExists(runtime, args);

    const basePackageLocation = path.join(args.directory, args.repository, "package.json");
    const basePackageContents: IShenanigansPackage & IDictionary<any> = await parseFileJson<IShenanigansPackage>(basePackageLocation);

    const packageTemplate: IShenanigansPackage & IDictionary<any> = await getPackageTemplate(basePackageContents);

    for (const i in packageTemplate) {
        if (i in basePackageContents) {
            if (typeof basePackageContents[i] === "object") {
                basePackageContents[i] = {
                    ...basePackageContents[i],
                    ...packageTemplate[i],
                };
            }
        } else {
            basePackageContents[i] = packageTemplate[i];
        }
    }

    await fs.writeFile(
        basePackageLocation,
        stringify(basePackageContents, {
            space: 4,
        }));
};
