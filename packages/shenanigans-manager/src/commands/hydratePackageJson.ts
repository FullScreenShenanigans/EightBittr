import chalk from "chalk";
import { promises as fs } from "fs";
import stringify from "json-stable-stringify";
import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command.js";
import { Runtime } from "../runtime.js";
import { ShenanigansPackage } from "../typings.js";
import { parseFileJson, setupDir } from "../utils.js";

const mergeOnPackageTemplate = (
    target: Partial<ShenanigansPackage>,
    source: Partial<ShenanigansPackage>
) => {
    for (const key in source) {
        target[key] = { ...(target[key] ?? ({} as any)), ...(source[key] ?? ({} as any)) };
    }
};

const getPackageTemplate = async (
    basePackageContents: ShenanigansPackage
): Promise<ShenanigansPackage> => {
    const packageTemplate = await parseFileJson<ShenanigansPackage>(
        path.join(setupDir, "package.json")
    );
    const { shenanigans } = basePackageContents;

    if (shenanigans.dist) {
        mergeOnPackageTemplate(
            packageTemplate,
            await parseFileJson<ShenanigansPackage>(path.join(setupDir, "package-dist.json"))
        );
    }

    if (shenanigans.external) {
        mergeOnPackageTemplate(
            packageTemplate,
            await parseFileJson<ShenanigansPackage>(path.join(setupDir, "package-external.json"))
        );
    }

    if (shenanigans.game) {
        mergeOnPackageTemplate(
            packageTemplate,
            await parseFileJson<ShenanigansPackage>(path.join(setupDir, "package-game.json"))
        );
    }

    if (shenanigans.web) {
        mergeOnPackageTemplate(
            packageTemplate,
            await parseFileJson<ShenanigansPackage>(path.join(setupDir, "package-web.json"))
        );
    }

    mergeOnPackageTemplate(
        packageTemplate,
        await parseFileJson<ShenanigansPackage>(
            path.join(setupDir, `package-${shenanigans.external ? "external" : "internal"}.json`)
        )
    );

    return packageTemplate;
};

/**
 * Updates a repository's package.json.
 */
export const HydratePackageJson = async (runtime: Runtime, args: RepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const basePackageLocation = path.join(args.directory, args.repository, "package.json");
    const basePackageContents = await parseFileJson<ShenanigansPackage>(basePackageLocation);
    runtime.logger.log(chalk.grey(`Hydrating ${basePackageLocation}`));

    const packageTemplate = await getPackageTemplate(basePackageContents);

    for (const i in packageTemplate) {
        if (i in basePackageContents) {
            const baseContent = basePackageContents[i];
            if (typeof baseContent === "object") {
                basePackageContents[i] = {
                    ...baseContent,
                    ...(packageTemplate[i] as typeof baseContent),
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
