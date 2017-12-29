import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as os from "os";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

const templateDir = "./node_modules/shenanigans-manager/setup/readme/";

export const replaceBetween = async (readmeContents: string, sectionFile: string, settings: {}): Promise<string> => {
    const section = sectionFile.replace(".md", "");
    const starter = `<!-- {{${section}}} -->`;
    const ender = `<!-- {{/${section}}} -->`;

    const start = readmeContents.indexOf(starter) + starter.length;
    const end = readmeContents.indexOf(ender);

    const templateLocation = path.join(templateDir, sectionFile);
    const template = (await fs.readFile(templateLocation)).toString().trim();

    return [
        readmeContents.substring(0, start),
        mustache.render(template, settings),
        readmeContents.substring(end),
    ].join(os.EOL);
};

/**
 * Updates a repository's README.md.
 */
export const HydrateReadme = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const [sections, packageContentsBase, readmeContentsBase] = await Promise.all([
        fs.readdir(templateDir),
        fs.readFile("package.json"),
        fs.readFile("README.md"),
    ]);
    const packageContents = JSON.parse(packageContentsBase.toString());
    let readmeContents = readmeContentsBase.toString();

    for (const section of sections) {
        readmeContents = await replaceBetween(readmeContents, section, packageContents);
    }

    await fs.writeFile("README.md", readmeContents);
};
