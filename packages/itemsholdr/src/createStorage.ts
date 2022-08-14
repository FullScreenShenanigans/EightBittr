/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Creates a basic mock implementation of the Storage API.
 *
 * @returns Basic mocked Storage object.
 */
export const createStorage = () => {
    const items = new Map();
    const storage: Storage = {
        clear: () => items.clear(),
        getItem: (key) => items.get(key),
        key: (index: number): string => storage.keys[index],
        get keys(): string[] {
            return Array.from(items.keys());
        },
        get length(): number {
            return storage.keys.length;
        },
        removeItem: (key) => items.delete(key),
        setItem: (key, value) => items.set(key, value),
    };

    return storage;
};
