/**
 * Transforms names between cases.
 */
export interface INameTransformer {
    /**
     * Transforms a dashed-case name to camelCase.
     *
     * @param name   A dashed-case name.
     * @returns The name as camelCase.
     */
    toCamelCase(name: string): string;

    /**
     * Transforms a dashed-case name to PamelCase.
     *
     * @param name   A dashed-case name.
     * @returns The name as PascalCase.
     */
    toPascalCase(name: string): string;
}

/**
 * Transforms names between cases.
 */
export class NameTransformer implements INameTransformer {
    /**
     * Transforms a dashed-case name to camelCase.
     *
     * @param name   A dashed-case name.
     * @returns The name as camelCase.
     */
    public toCamelCase(name: string): string {
        const split: string[] = name.split("-");

        return split[0].toLowerCase() + split
            .slice(1)
            .map((part: string): string =>
                part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase())
            .join("");
    }

    /**
     * Transforms a dashed-case name to PamelCase.
     *
     * @param name   A dashed-case name.
     * @returns The name as PascalCase.
     */
    public toPascalCase(name: string): string {
        return name.split("-")
            .map((part: string): string =>
                part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase())
            .join("");
    }

    /**
     * Transforms a camelCase name to dashed-case.
     */
    public toDashedCase(name: string): string {
        let output = "";
        let lastAdded = 0;

        for (let i = 0; i < name.length; i += 1) {
            if (name[i].toUpperCase() === name[i]) {
                output += `${name.substring(lastAdded, i).toLowerCase()}-`;
                lastAdded = i;
            }
        }

        output += name.substring(lastAdded).toLowerCase();

        if (output[output.length - 1] === "-") {
            output = output.substring(0, output.length - 1);
        }

        return output;
    }
}
