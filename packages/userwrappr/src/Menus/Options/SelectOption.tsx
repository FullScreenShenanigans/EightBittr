import { observer } from "mobx-react";
import * as React from "react";

import { SelectSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class SelectOption extends React.Component<{
    store: SaveableStore<SelectSchema>;
}> {
    public render(): JSX.Element {
        const { store } = this.props;
        const selectStyle = {
            ...store.styles.input,
            ...store.styles.inputSelect,
        } as React.CSSProperties;

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
                    <select
                        onChange={this.changeValue}
                        style={selectStyle}
                        value={this.props.store.value}
                    >
                        {this.props.store.schema.options.map(this.renderOption)}
                    </select>
                </div>
            </div>
        );
    }

    private readonly renderOption = (option: string): JSX.Element => (
        <option key={option} value={option}>
            {option}
        </option>
    );

    private readonly changeValue = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.store.setValue(event.target.value);
    };
}
