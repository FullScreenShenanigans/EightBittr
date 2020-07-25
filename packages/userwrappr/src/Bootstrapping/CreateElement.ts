/**
 * Properties that can be added to an HTML element upon creation.
 */
export interface ElementProperties {
    /**
     * Child elements, if no text content.
     */
    children?: HTMLElement[];

    /**
     * Any class name(s) for the element.
     */
    className?: string;

    /**
     * Any styles to add to the element.
     */
    style?: Partial<CSSStyleDeclaration>;

    /**
     * Text content, if no children.
     */
    textContent?: string;
}

/**
 * Creates a new HTML element.
 *
 * @param tagName   Type of the element.
 * @param properties   Any properties to add to the element.
 * @returns A new HTML element.
 */
export const createElement = (
    tagName: string,
    properties: ElementProperties = {}
): HTMLElement => {
    const element = document.createElement(tagName);

    if (properties.className !== undefined) {
        element.className = properties.className;
    }

    if (properties.children !== undefined) {
        for (const child of properties.children) {
            element.appendChild(child);
        }
    } else if (properties.textContent !== undefined) {
        element.textContent = properties.textContent;
    }

    if (properties.style !== undefined) {
        for (const key in properties.style as any) {
            (element.style as any)[key] = (properties.style as any)[key];
        }
    }

    return element;
};

/**
 * Creates a new HTML element.
 *
 * @param tagName   Type of the element.
 * @param properties   Any properties to add to the element.
 * @returns A new HTML element.
 */
export type CreateElement = typeof createElement;
