import { useVisualContext } from "../../VisualContext";
import { ButtonSchema } from "./ButtonSchemas";

export interface ButtonProps {
    button: ButtonSchema;
}

export const Button = ({ button }: ButtonProps) => {
    const { classNames, styles } = useVisualContext();
    const [extraClassName, extraStyle] =
        button.variant === "round"
            ? [classNames.buttonRound, styles.buttonRound]
            : [classNames.buttonSquare, styles.buttonSquare];

    return (
        <button
            aria-label={button.label}
            className={[classNames.button, extraClassName].join(" ")}
            {...button.events}
            style={{ ...styles.button, ...extraStyle, ...button.position }}
        >
            {button.title}
        </button>
    );
};
