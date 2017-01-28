/**
 * Sanitizes shell logs to remove unnecessary strings.
 */
export class Sanitizer {
    /**
     * Data prefixes that indicate a string should be ignored.
     */
    private static readonly ignoredPrefixes: string[] = [
        "deprecated",
        "graceful-fs@",
        "lodash@",
        "minimatch@",
        "not compatible with your operating system or architecture: fsevents@",
        "npm",
        "prefer global",
        "optional Skipping failed optional dependency",
        "Cloning into",
        "WARN"
    ];

    /**
     * Sanitizes data by trimming it and removing content if necessary.
     * 
     * @param data   Incoming data object.
     * @returns Trimmed and sanitized equivalent of the data.
     */
    public sanitize(data: string | Buffer): string {
        data = data.toString().trim();

        for (const prefix of Sanitizer.ignoredPrefixes) {
            if (this.hasPrefix(data, prefix)) {
                return "";
            }
        }

        return data;
    }

     /**
      * @param data Incoming data string.
      * @param prefix   Prefix to check for on the data string.
      * @returns Whether data starts with the prefix.
      */
      private hasPrefix(data: string, prefix: string): boolean {
            const index: number = data.indexOf(prefix);
            return index >= 0 && index <= 3;
      }
}
