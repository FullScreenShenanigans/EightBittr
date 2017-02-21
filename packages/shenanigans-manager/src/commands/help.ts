import "colors";
import * as fs from "fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { NameTransformer } from "../nameTransformer";

/**
 * Displays help info.
 */
export class Help extends Command<ICommandArgs, void> {
    /**
     * Transforms names between cases.
     */
    private readonly nameTransformer: NameTransformer = new NameTransformer();

    /**
     * Executes the command.
     * 
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        this.logger.log(
            "shenanigans-manager".bold.cyan,
            "manages locally installed FullScreenShenanigans modules for development.");

        this.logger.log("Available commands:");

        await new Promise<void>((resolve, reject) => {
            fs.readdir(path.join(__dirname, "../../src/commands"), (error: any, files: string[]): void => {
                if (error) {
                    return reject(error);
                }

                const commands: string[] = files
                    .filter((fileName: string): boolean => {
                        return fileName.indexOf(".ts") !== -1;
                    })
                    .map((fileName: string): string => {
                        return fileName.substring(0, fileName.length - ".ts".length);
                    });

                for (const file of commands) {
                    this.logger.log(`    ${this.nameTransformer.toDashedCase(file)}`);
                }

                resolve();
            });
        });
    }
}
