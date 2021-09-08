import { observer } from "mobx-react";
import * as React from "react";

import { StringSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class StringOption extends React.Component<{
    store: SaveableStore<StringSchema>;
}> {
    public render(): JSX.Element {
        const { store } = this.props;
        return (
            <div
                className={store.classNames.option}
                style={store.styles.option as React.CSSProperties}
            >
                <div
                    className={store.classNames.optionLeft}
                    style={store.styles.optionLeft as React.CSSProperties}
                >
                    {store.schema.title}
                </div>
                <div
                    className={store.classNames.optionRight}
                    style={store.styles.optionRight as React.CSSProperties}
                >
                    <input onChange={this.changeValue} type="string" />
                </div>
            </div>
        );
    }

    private readonly changeValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.store.setValue(event.target.value);
    };
}
