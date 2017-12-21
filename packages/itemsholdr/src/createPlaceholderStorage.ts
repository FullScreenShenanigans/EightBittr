/**
 * Creates an Object that can be used to create a new LocalStorage
 * replacement, if the JavaScript environment doesn't have one.
 *
 * @returns Placeholder Storage object.
 */
export const createPlaceholderStorage = (): Storage => {
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
