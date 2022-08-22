import { JSX } from "preact";

import { CSSLikeStyles } from "../../Bootstrapping/Styles";

type MembersStartingWith<T, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K];
};

/**
 * Schema describing a touchscreen button to display.
 */
export interface ButtonSchema {
    /**
     * Event handlers to forward to the button.
     */
    events: MembersStartingWith<JSX.HTMLAttributes<HTMLButtonElement>, "on">;

    /**
     * aria-label to put on the button, if the title isn't informative.
     */
    label?: string;

    /**
     * CSS styles to describe the button's position.
     */
    position: Pick<CSSLikeStyles, "bottom" | "left" | "transform" | "right" | "top">;

    /**
     * Text to be displayed in the center of the button.
     */
    title: string;

    /**
     * Visual variant to render as.
     */
    variant: "round" | "square";
}
