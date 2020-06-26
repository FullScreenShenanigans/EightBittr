import chalk from "chalk";
import stringify from "json-stable-stringify";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { parseFileJson, setupDir } from "../utils";

const mergeOnPackageTemplate = (
    target: IShenanigansPackage,
    source: Partial<IShenanigansPackage>
) => {
    if (source.devDependencies !== undefined) {
        target.devDependencies =
            target.devDependencies === undefined
                ? source.devDependencies
                : {
                      ...target.devDependencies,
                      ...source.devDependencies,
                  };
    }

    Object.assign(target.scripts, source.scripts);
};

const getPackageTemplate = async (
    basePackageContents: IShenanigansPackage
): Promise<IShenanigansPackage> => {
    const packageTemplate = await parseFileJson<IShenanigansPackage>(
        path.join(setupDir, "package.json")
    );
    const { shenanigans } = basePackageContents;

    if (shenanigans?.dist) {
        mergeOnPackageTemplate(
            packageTemplate,
            await parseFileJson<IShenanigansPackage>(path.join(setupDir, "package-dist.json"))
        );
    }

    mergeOnPackageTemplate(
        packageTemplate,
        await parseFileJson<IShenanigansPackage>(
            path.join(setupDir, `package-${shenanigans.external ? "external" : "internal"}.json`)
        )
    );

    return packageTemplate;
};

/**
 * Updates a repository's package.json.
 */
export const HydratePackageJson = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const basePackageLocation = path.join(args.directory, args.repository, "package.json");
    const basePackageContents: IShenanigansPackage & IDictionary<any> = await parseFileJson<
        IShenanigansPackage
    >(basePackageLocation);
    runtime.logger.log(chalk.grey(`Hydrating ${basePackageLocation}`));

    const packageTemplate: IShenanigansPackage & IDictionary<any> = await getPackageTemplate(
        basePackageContents
    );

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
        })
    );
};
