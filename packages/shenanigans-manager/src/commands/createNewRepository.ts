import * as mustache from "mustache";
import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";

/**
 * Arguments for a CreateNewRepository command.
 */
export interface ICreateNewRepositoryArgs extends ICommandArgs {
    /**
     * Description of the repository.
     */
    description: string;

    /**
     * What to name the repository.
     */
    name: string;
}

/**
 * Clones a repository locally.
 */
export class CreateNewRepository extends Command<ICreateNewRepositoryArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "name");

        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.args.directory)
            .execute(`mkdir ${this.args.name}`);

        await Promise.all([
            this.copyTemplateFile("gulpfile.js"),
            this.copyTemplateFile("package.json"),
            this.copyTemplateFile("shenanigans.json")
        ]);

        await shell
            .setCwd(this.args.directory, this.args.name)
            .execute("npm install");

        await shell.execute("gulp setup");
        await shell.execute("mkdir src");
    }

    /**
     * Copies a template file into a new respository.
     *
     * @param fileName   Name of the file.
     * @returns A Promise for copying the file.
     */
    private async copyTemplateFile(fileName: string): Promise<void> {
        const template: string = (await fs.readFile(path.join(__dirname, `../../setup/${fileName}`))).toString();
        const packageContents: string = mustache.render(template, this.args);
        await fs.writeFile(path.join(this.args.directory, this.args.name, fileName), packageContents);
    }
}
