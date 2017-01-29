import { Command } from "../command";
import { Shell } from "../shell";

/**
 * Links all repositories locally.
 */
export class LinkAllRepositories extends Command<{}, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        const shell: Shell = new Shell(this.logger);

        for (const target of this.settings.allRepositories) {
            for (const external of this.settings.allRepositories) {
                if (target === external) {
                    continue;
                }

                await shell
                    .setCwd(this.settings.codeDir, target)
                    .execute(`npm link ${external}`);
            }
        }
    }
}
