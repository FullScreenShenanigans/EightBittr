import { LabeledOption } from "./LabeledOption";
import { StringSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const StringOption: OptionComponent<StringSchema> = ({ option }) => {
    const [value, setValue] = useOptionState(option);

    return (
        <LabeledOption title={option.title}>
            <input
                onChange={(event) => setValue((event.target as HTMLInputElement).value)}
                type="string"
                value={value}
            />
        </LabeledOption>
    );
};
