import chalk from "chalk";
import { existsSync, promises as fs } from "fs";
import mustache from "mustache";
import * as os from "os";
import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command.js";
import { setupDirName } from "../directories.js";
import { Runtime } from "../runtime.js";
import { getShenanigansPackageContents } from "../utils.js";

const templateDir = path.join(setupDirName, "readme/");

export const replaceBetween = async (
    readmeContents: string,
    section: string,
    settings: {}
): Promise<string> => {
    const starter = `<!-- ${section} -->`;
    const ender = `<!-- /${section} -->`;

    const start = readmeContents.indexOf(starter) + starter.length;
    const end = readmeContents.indexOf(ender);

    const templateLocation = path.join(templateDir, `${section}.md`);
    const template = (await fs.readFile(templateLocation)).toString().trim();

    let rendered = mustache.render(template, settings).trim();
    if (rendered.length !== 0) {
        rendered = `${os.EOL.repeat(2)}${rendered}${os.EOL.repeat(2)}`;
    }

    return (
        [
            readmeContents.substring(0, start).trim(),
            rendered,
            readmeContents.substring(end).trim(),
        ]
            .join("")
            .trim() + os.EOL
    );
};

/**
 * Updates a repository's README.md.
 */
export const HydrateReadme = async (runtime: Runtime, args: RepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const readmeLocation = path.join(args.directory, args.repository, "README.md");
    runtime.logger.log(chalk.grey(`Hydrating ${readmeLocation}`));

    if (!existsSync(readmeLocation)) {
        await fs.writeFile(readmeLocation, "");
    }

    const [packageContents, readmeContentsBase] = await Promise.all([
        getShenanigansPackageContents(args),
        fs.readFile(readmeLocation),
    ]);

    let readmeContents = readmeContentsBase.toString();

    for (const section of ["Top", "Development"]) {
        readmeContents = await replaceBetween(readmeContents, section, packageContents);
    }

    await fs.writeFile(readmeLocation, readmeContents);
};
