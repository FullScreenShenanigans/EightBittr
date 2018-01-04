/**
 * Object with a name.
 */
export interface IObjectWithName {
    /**
     * Name of the object.
     */
    name: string;
}

/**
 * Gets the friendly name of a class or function.
 *
 * @param method   Class or function which may have a name.
 * @returns Friendly name of the class or function.
 */
export const getFunctionName = (method: IObjectWithName | Function): string => {
    if ((method as IObjectWithName).name !== undefined) {
        return (method as IObjectWithName).name;
    }

    const stringified = method.toString();
    const typeDescriptorMatch = stringified.match(/class|function/)!;
    const indexOfNameSpace = typeDescriptorMatch.index! + typeDescriptorMatch[0].length;
    const indexOfNameAfterSpace = stringified.search(/\(|\{/);

    return stringified.substring(indexOfNameSpace, indexOfNameAfterSpace).trim();
};
