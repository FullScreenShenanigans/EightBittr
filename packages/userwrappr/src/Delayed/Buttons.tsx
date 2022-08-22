import { useVisualContext } from "../VisualContext";
import { Button } from "./Buttons/Button";
import { ButtonSchema } from "./Buttons/ButtonSchemas";

export interface ButtonsProps {
    buttons: ButtonSchema[];
}

export const Buttons = ({ buttons }: ButtonsProps) => {
    const { classNames, containerSize, styles } = useVisualContext();

    return (
        <div
            className={classNames.buttonsArea}
            style={{
                ...styles.buttonsArea,
                width: `${containerSize.width}px`,
            }}
        >
            {buttons.map((button) => (
                <Button key={button.title} button={button} />
            ))}
        </div>
    );
};
