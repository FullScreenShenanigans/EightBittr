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
        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.args.directory)
            .execute(`mkdir ${this.args.name}`);

        const template: string = (await fs.readFile(path.join(__dirname, "../../setup/package.json"))).toString();
        const packageContents: string = mustache.render(template, this.args);
        await fs.writeFile(path.join(this.args.directory, this.args.name, "package.json"), packageContents);

        await shell
            .setCwd(this.args.directory, this.args.name)
            .execute("npm install");
    }
}
