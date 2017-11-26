import { observer } from "mobx-react";
import * as React from "react";

import { IBasicSchema } from "./OptionSchemas";
import { OptionStore } from "./OptionStore";

export const UnknownOption = observer(({ store }: { store: OptionStore<IBasicSchema> }) => (
    <div className={store.classNames.option} style={store.styles.option as React.CSSProperties}>
        <em>(unknown option type for "{store.schema.title}": <strong>{store.schema.type}</strong>)</em>
    </div>
));
