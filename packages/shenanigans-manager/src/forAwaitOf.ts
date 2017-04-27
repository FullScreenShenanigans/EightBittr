/**
 * @todo Remove this when TypeScript 2.3 is released!
 */
export async function forAwaitOf<T>(keys: Iterable<string>, action: (key: string) => Promise<T>): Promise<T[]> {
    const results: T[] = [];

    for (const key of keys) {
        results.push(await action(key));
    }

    return results;
}
