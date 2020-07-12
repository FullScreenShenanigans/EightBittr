import { observer } from "mobx-react";
import * as React from "react";

import { IBooleanSchema } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

@observer
export class BooleanOption extends React.Component<{
    store: SaveableStore<IBooleanSchema>;
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
                    {this.renderButton()}
                </div>
            </div>
        );
    }

    private renderButton() {
        const descriptor = this.props.store.value ? "on" : "off";

        const style: React.CSSProperties = {
            ...this.props.store.styles.inputButton,
            ...this.props.store.styles.inputButtonBoolean,
            ...(this.props.store.value
                ? this.props.store.styles.inputButtonOn
                : this.props.store.styles.inputButtonOff),
        } as React.CSSProperties;

        return (
            <button name={this.props.store.schema.title} onClick={this.toggleValue} style={style}>
                {descriptor}
            </button>
        );
    }

    private readonly toggleValue = (): void => {
        this.props.store.setValue(!this.props.store.value);
    };
}
