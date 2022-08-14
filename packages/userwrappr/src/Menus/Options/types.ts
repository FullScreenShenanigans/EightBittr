import { OptionSchema } from "./OptionSchemas";

export interface OptionComponentProps<Schema extends OptionSchema> {
    option: Schema;
}

export type OptionComponent<Schema extends OptionSchema = OptionSchema> = React.ComponentType<
    OptionComponentProps<Schema>
>;
