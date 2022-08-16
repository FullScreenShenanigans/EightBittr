import { promises as fs } from "fs";
import * as path from "path";
import prettier from "prettier";

import { setupDirName } from "./directories";

const supportInfo = prettier.getSupportInfo();
let prettierOptions: prettier.Options | undefined;

const prettifyIfPossible = async (fileName: string, contents: string) => {
    if (
        !supportInfo.languages.some((language) =>
            language.extensions?.some((extension) => fileName.endsWith(extension))
        )
    ) {
        return contents;
    }

    if (!prettierOptions) {
        const rawPrettierOptions = await fs.readFile(
            path.join(setupDirName, "external/.prettierrc")
        );
        prettierOptions = await JSON.parse(rawPrettierOptions.toString());
    }

    return prettier.format(contents, { ...prettierOptions, filepath: fileName });
};

export const writeFilePretty = async (fileName: string, contents: string) => {
    await fs.writeFile(fileName, await prettifyIfPossible(fileName, contents));
};
