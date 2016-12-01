/**
 * Transforms dashed-case names to cases.
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
 * Transforms dashed-case names to cases.
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
            .map((part: string): string => {
                return part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase();
            })
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
            .map((part: string): string => {
                return part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase();
            })
            .join("");
    }
}
