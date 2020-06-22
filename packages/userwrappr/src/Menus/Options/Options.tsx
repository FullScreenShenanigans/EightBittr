import { observer } from "mobx-react";
import * as React from "react";

import { MenuTitle } from "../MenuTitle";

import { ActionOption } from "./ActionOption";
import { BooleanOption } from "./BooleanOption";
import { MultiSelectOption } from "./MultiSelectOption";
import { NumberOption } from "./NumberOption";
import { OptionType } from "./OptionSchemas";
import { OptionsStore } from "./OptionsStore";
import { OptionStore } from "./OptionStore";
import { SelectOption } from "./SelectOption";
import { StringOption } from "./StringOption";
import { UnknownOption } from "./UnknownOption";

type IOptionRenderer =
    | React.ComponentClass
    | (({ store }: { store: OptionStore }) => JSX.Element);

const storeRenderers = new Map<OptionType, IOptionRenderer>([
    [OptionType.Action, ActionOption],
    [OptionType.Boolean, BooleanOption],
    [OptionType.MultiSelect, MultiSelectOption],
    [OptionType.Number, NumberOption],
    [OptionType.Select, SelectOption],
    [OptionType.String, StringOption],
] as [OptionType, IOptionRenderer][]);

const renderOptionStore = (store: OptionStore) => {
    let Renderer = storeRenderers.get(store.schema.type);
    if (Renderer === undefined) {
        Renderer = UnknownOption;
    }

    return <Renderer store={store} key={store.schema.title} />;
};

export const Options = observer(({ store }: { store: OptionsStore }) => {
    const optionsListStyle = {
        ...store.styles.optionsList,
        maxHeight: store.containerSize.height,
    } as React.CSSProperties;

    return (
        <div
            className={store.classNames.options}
            onMouseLeave={store.onMouseLeave}
            style={store.styles.options as React.CSSProperties}
        >
            <div
                className={store.classNames.optionsList}
                style={optionsListStyle}
            >
                {store.children.map(renderOptionStore)}
            </div>
            <MenuTitle store={store.titleStore} />
        </div>
    );
});
