import * as Preact from "preact";

import { OptionSchema } from "./OptionSchemas";

export interface OptionComponentProps<Schema extends OptionSchema> {
    option: Schema;
}

export type OptionComponent<Schema extends OptionSchema = OptionSchema> = Preact.ComponentType<
    OptionComponentProps<Schema>
>;
