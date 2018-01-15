/**
 * Creates a basic implementation of the Storage API.
 *
 * @returns Basic Storage object.
 */
export const createStorage = (): Storage => {
    const output: Storage & { [i: string]: any } = {
        clear: (): void => {
            for (const i in output) {
                if ({}.hasOwnProperty.call(output, i)) {
                    delete output[i];
                }
            }
        },
        getItem: (key: string): any => output[key],
        key: (index: number): string => output.keys[index],
        get keys(): string[] {
            return Object.keys(output);
        },
        get length(): number {
            return output.keys.length;
        },
        removeItem: (key: string): void => {
            delete output[key];
        },
        setItem: (key: string, value: string): void => {
            output[key] = value;
        },
    };

    return output;
};
