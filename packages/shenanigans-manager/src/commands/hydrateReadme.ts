import chalk from "chalk";
import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as os from "os";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

const templateDir = "./node_modules/shenanigans-manager/setup/readme/";

const getReadmeSections = (packageContents: IShenanigansPackage): string[] => {
    const sections = ["Top", "Development"];

    if (packageContents.shenanigans.maps) {
        sections.push("Maps");
    }

    return sections;
};

export const replaceBetween = async (readmeContents: string, section: string, settings: {}): Promise<string> => {
    const starter = `<!-- ${section} -->`;
    const ender = `<!-- /${section} -->`;

    const start = readmeContents.indexOf(starter) + starter.length;
    const end = readmeContents.indexOf(ender);

    const templateLocation = path.join(templateDir, `${section}.md`);
    const template = (await fs.readFile(templateLocation)).toString().trim();

    let rendered = mustache.render(template, settings).trim();
    if (rendered.length !== 0) {
        rendered = `${os.EOL}${rendered}${os.EOL}`;
    }

    return [
        readmeContents.substring(0, start).trim(),
        rendered,
        readmeContents.substring(end).trim(),
    ].join("").trim() + os.EOL;
};

/**
 * Updates a repository's README.md.
 */
export const HydrateReadme = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const readmeLocation = path.join(args.directory, args.repository, "README.md");
    runtime.logger.log(chalk.grey(`Hydrating ${readmeLocation}`));

    if (!(await fs.exists(readmeLocation))) {
        await fs.writeFile(readmeLocation, "");
    }

    const [packageContentsBase, readmeContentsBase] = await Promise.all([
        fs.readFile("package.json"),
        fs.readFile(readmeLocation),
    ]);
    const packageContents: IShenanigansPackage = JSON.parse(packageContentsBase.toString());
    const sections = getReadmeSections(packageContents);
    let readmeContents = readmeContentsBase.toString();

    for (const section of sections) {
        readmeContents = await replaceBetween(readmeContents, section, packageContents);
    }

    await fs.writeFile(readmeLocation, readmeContents);
};
