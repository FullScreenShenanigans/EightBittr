import * as path from "path";
import * as url from "url";

export const filesDirName = url.fileURLToPath(new URL(".", import.meta.url));

export const packageDirName = path.join(filesDirName, "..");

export const packagesDirName = path.join(packageDirName, "..");

export const setupDirName = path.join(packageDirName, "setup");
