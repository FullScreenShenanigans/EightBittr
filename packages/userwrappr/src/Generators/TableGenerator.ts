import { IGameStartr, IOptionsGenerator, ISizeSummary } from "../IUserWrappr";
import { IChoiceElement, IInputElement, IOption, ISchema, ISelectElement } from "../UISchemas";
import { OptionsGenerator } from "./OptionsGenerator";

/**
 * Description of a user control for a table of options.
 */
export interface IOptionsTableSchema extends ISchema {
    /**
     * Descriptions of action buttons that should be appended to the options.
     */
    actions?: IOptionsTableAction[];

    /**
     * Descriptions of the options to be displayed in the table.
     */
    options: IOptionsTableOption[];
}

/**
 * Description of an action button in the control.
 */
export interface IOptionsTableAction {
    /**
     * The button's label, displayed to the user.
     */
    title: string;

    /**
     * Callback for when the button is triggered.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     */
    action: (gameStarter: IGameStartr) => void;
}

/**
 * Desription of an option to be displayed in a table control.
 */
export interface IOptionsTableOption extends IOption {
    /**
     * The key for the type of option, such as "Button".
     */
    type: string;

    /**
     * Whether the button's value should be stored locally between sessions.
     */
    storeLocally?: boolean;
}

/**
 * Description of an option with a boolean value.
 */
export interface IOptionsTableBooleanOption extends IOptionsTableOption {
    /**
     * Callback for when the value becomes false.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     */
    disable: (gameStarter: IGameStartr) => void;

    /**
     * Callback for when the value becomes true.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     */
    enable: (gameStarter: IGameStartr) => void;

    /**
     * A key to add to the button's className when the value is true.
     */
    keyActive?: string;

    /**
     * Whether the button's value is assumed to be false visually.
     */
    assumeInactive?: boolean;
}

/**
 * Description of an option for keyboard keys.
 */
export interface IOptionsTableKeysOption extends IOptionsTableOption {
    /**
     * Callback for when the value changes.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     */
    callback: (gameStarter: IGameStartr) => void;

    /**
     * A source for the allowed keys in the option.
     * 
     * @returns The allowed keys in the option.
     */
    source: (gameStarter: IGameStartr) => string[];
}

/**
 * Description of an option with a numeric value.
 */
export interface IOptionsTableNumberOption extends IOptionsTableOption {
    /**
     * A minimum value.
     */
    minimum?: number;

    /**
     * A maximum value.
     */
    maximum?: number;

    /**
     * Callback for when the value changes.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     */
    update: (gameStarter: IGameStartr) => void;
}

/**
 * Description of an option with multiple preset values.
 */
export interface IOptionsTableSelectOption extends IOptionsTableOption {
    /**
     * A source for the allowed keys in the option.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     * @returns The allowed keys in the option.
     */
    options: (gameStarter: IGameStartr) => string[];

    /**
     * A source for the initially selected value.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     * @returns The allowed keys in the option.
     */
    source: (gameStarter: IGameStartr) => string;

    /**
     * Callback for when the value changes.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     * @param value   A new value, if this is triggered via a code callback.
     */
    update: (gameStarter: IGameStartr, value?: any) => void;
}

/**
 * Description of an option for setting the GameStartr's screen size.
 */
export interface IOptionsTableScreenSizeOption extends IOptionsTableOption {
    /**
     * A source for names of the allowed screen sizes.
     * 
     * @param GameStarter   The GameStarter this option is controlling. 
     * @returns Names of the allowed screen sizes.
     */
    options: (gameStarter: IGameStartr) => string[];

    /**
     * A source for the initially selected value.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     * @returns The allowed keys in the option.
     */
    source: (gameStarter: IGameStartr) => string;

    /**
     * Callback for when the value changes.
     * 
     * @param GameStarter   The GameStarter this option is controlling.
     * @param value   The newly selected size information.
     */
    update: (gameStarter: IGameStartr, value: ISizeSummary) => void;
}

/**
 * Container of table option descriptions, keyed by name.
 */
export interface IOptionsTableTypes {
    [i: string]: (input: IInputElement | ISelectElement, details: IOptionsTableOption, schema: ISchema) => any;
}

/**
 * An options generator for a table of options. Each table contains a (left) label cell
 * and a (right) value cell with some sort of input.
 */
export class TableGenerator extends OptionsGenerator implements IOptionsGenerator {
    /**
     * Generators for the value cells within table rows.
     */
    protected static optionTypes: IOptionsTableTypes = {
        Boolean: TableGenerator.prototype.setBooleanInput,
        Keys: TableGenerator.prototype.setKeyInput,
        Number: TableGenerator.prototype.setNumberInput,
        Select: TableGenerator.prototype.setSelectInput,
        ScreenSize: TableGenerator.prototype.setScreenSizeInput
    };

    /**
     * Generates a control element with tabular information based on the provided schema.
     * 
     * @param schema   A description of the tabular data to represent.
     * @returns An HTML element representing the schema.
     */
    public generate(schema: IOptionsTableSchema): HTMLDivElement {
        const output: HTMLDivElement = document.createElement("div");
        const table: HTMLTableElement = document.createElement("table");

        output.className = "select-options select-options-table";

        if (schema.options) {
            for (const option of schema.options) {
                const row: HTMLTableRowElement = document.createElement("tr");
                const label: HTMLTableCellElement = document.createElement("td");
                const input: HTMLTableCellElement = document.createElement("td");

                label.className = "options-label-" + option.type;
                label.textContent = option.title;

                input.className = "options-cell-" + option.type;

                row.appendChild(label);
                row.appendChild(input);

                const child: IInputElement | ISelectElement = TableGenerator.optionTypes[option.type].call(this, input, option, schema);
                if (option.storeLocally) {
                    this.ensureLocalStorageInputValue(child, option, schema);
                }

                table.appendChild(row);
            }
        }

        output.appendChild(table);

        if (schema.actions) {
            for (const action of schema.actions) {
                const row: HTMLDivElement = document.createElement("div");

                row.className = "select-option options-button-option";
                row.textContent = action.title;
                row.onclick = action.action.bind(this, this.gameStarter);

                output.appendChild(row);
            }
        }

        return output;
    }

    /**
     * Initializes an input for a boolean value.
     * 
     * @param input   An input that will contain a boolean value.
     * @param details   Details for this individual value.
     * @returns An HTML element containing the input.
     */
    protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption): IInputElement {
        const status: boolean = details.source.call(this, this.gameStarter);
        const statusClass: string = status ? "enabled" : "disabled";

        input.className = "select-option options-button-option option-" + statusClass;
        input.textContent = status ? "on" : "off";

        input.onclick = (): void => input.setValue(input.textContent === "off");

        input.setValue = (newStatus: string | boolean): void => {
            if (newStatus.constructor === String) {
                if (newStatus === "false" || newStatus === "off") {
                    newStatus = false;
                } else if (newStatus === "true" || newStatus === "on") {
                    newStatus = true;
                }
            }

            if (newStatus) {
                details.enable.call(this, this.gameStarter);
                input.textContent = "on";
                input.className = input.className.replace("disabled", "enabled");
            } else {
                details.disable.call(this, this.gameStarter);
                input.textContent = "off";
                input.className = input.className.replace("enabled", "disabled");
            }

            if (details.storeLocally) {
                this.storeLocalStorageValue(input, newStatus.toString());
            }
        };

        return input;
    }

    /**
     * Initializes an input for a keyboard key value.
     * 
     * @param input   An input that will contain a keyboard key value.
     * @param details   Details for this individual value.
     * @returns An HTML element containing the input.
     */
    protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption): ISelectElement[] {
        const values: string[] = details.source.call(this, this.gameStarter);
        const possibleKeys: string[] = this.userWrapper.getAllPossibleKeys();
        const children: ISelectElement[] = [];

        for (const value of values) {
            const valueLower: string = value.toLowerCase();

            const child: ISelectElement = document.createElement("select") as ISelectElement;
            child.className = "options-key-option";
            child.value = child.valueOld = valueLower;

            for (let j: number = 0; j < possibleKeys.length; j += 1) {
                child.appendChild(new Option(possibleKeys[j]));

                // Setting child.value won't work in IE or Edge...
                if (possibleKeys[j] === valueLower) {
                    child.selectedIndex = j;
                }
            }

            child.onchange = ((child: ISelectElement): void => {
                details.callback.call(this, this.gameStarter, child.valueOld, child.value);
                if (details.storeLocally) {
                    this.storeLocalStorageValue(child, child.value);
                }
            }).bind(this, child);

            children.push(child);
            input.appendChild(child);
        }

        return children;
    }

    /**
     * Initializes an input for a numeric value.
     * 
     * @param input   An input that will contain a numeric value.
     * @param details   Details for this individual value.
     * @returns An HTML element containing the input.
     */
    protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption): IInputElement {
        const child: IInputElement = document.createElement("input") as IInputElement;

        child.type = "number";
        child.value = parseFloat(details.source.call(this, this.gameStarter)).toString();
        child.min = (details.minimum || 0).toString();
        child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();

        child.onchange = child.oninput = (): void => {
            if (child.checkValidity()) {
                details.update.call(this, this.gameStarter, child.value);
            }
            if (details.storeLocally) {
                this.storeLocalStorageValue(child, child.value);
            }
        };

        input.appendChild(child);

        return child;
    }

    /**
     * Initializes an input for a value with multiple preset options.
     * 
     * @param input   An input that will contain a value with multiple present options.
     * @param details   Details for this individual value.
     * @returns An HTML element containing the input.
     */
    protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption): ISelectElement {
        const child: ISelectElement = document.createElement("select") as ISelectElement;
        const options: string[] = details.options(this.gameStarter);

        for (const option of options) {
            child.appendChild(new Option(option));
        }

        child.value = details.source.call(this, this.gameStarter);

        child.onchange = (): void => {
            details.update.call(this, this.gameStarter, child.value);
            child.blur();

            if (details.storeLocally) {
                this.storeLocalStorageValue(child, child.value);
            }
        };

        input.appendChild(child);

        return child;
    }

    /**
     * Initializes an input for setting the GameStartr's screen size.
     * 
     * @param input   An input that will set a GameStartr's screen size.
     * @param details   Details for this individual value.
     * @returns An HTML element containing the input.
     */
    protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption): ISelectElement {
        details.options = (): string[] => Object.keys(this.userWrapper.getSizes());

        details.source = (): string => this.userWrapper.getCurrentSize().name!;

        details.update = (_gameStarter: IGameStartr, value: ISizeSummary | string): void => {
            if (value !== this.userWrapper.getCurrentSize()) {
                this.userWrapper.setCurrentSize(value);
            }
        };

        return this.setSelectInput(input, details);
    }

    /**
     * Ensures an input's required local storage value is being stored,
     * and adds it to the internal GameStarter.ItemsHolder if not. If it
     * is, and the child's value isn't equal to it, the value is set.
     * 
     * @param childRaw   An input or select element, or an Array thereof. 
     * @param details   Details containing the title of the item and the 
     *                  source Function to get its value.
     * @param schema   The container schema this child is within.
     */
    protected ensureLocalStorageInputValue(childRaw: IChoiceElement | IChoiceElement[], details: IOption, schema: ISchema): void {
        if (childRaw.constructor === Array) {
            this.ensureLocalStorageValues(childRaw as IInputElement[], details, schema);
            return;
        }

        const child: IInputElement | ISelectElement = childRaw as IInputElement | ISelectElement;
        const key: string = schema.title + "::" + details.title;
        const valueDefault: string = details.source.call(this, this.gameStarter).toString();

        child.setAttribute("localStorageKey", key);
        this.gameStarter.ItemsHolder.addItem(key, {
            "storeLocally": true,
            "valueDefault": valueDefault
        });

        const value: string = this.gameStarter.ItemsHolder.getItem(key);
        if (value !== "" && value !== child.value) {
            child.value = value;

            if (child.setValue) {
                child.setValue(value);
            } else if (child.onchange) {
                child.onchange(undefined!);
            } else if (child.onclick) {
                child.onclick(undefined!);
            }
        }
    }

    /**
     * Ensures a collection of items all exist in localStorage. If their values
     * don't exist, their schema's .callback is used to provide them.
     * 
     * @param childRaw   An Array of input or select elements.
     * @param details   Details containing the title of the item and the source 
     *                  Function to get its value.
     * @param schema   The container schema this child is within.
     */
    protected ensureLocalStorageValues(children: (IInputElement | ISelectElement)[], details: IOption, schema: ISchema): void {
        const keyGeneral: string = schema.title + "::" + details.title;
        const values: any[] = details.source.call(this, this.gameStarter);

        for (let i: number = 0; i < children.length; i += 1) {
            const key: string = keyGeneral + "::" + i;
            const child: IInputElement | ISelectElement = children[i];
            child.setAttribute("localStorageKey", key);

            this.gameStarter.ItemsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": values[i]
            });

            const value: string = this.gameStarter.ItemsHolder.getItem(key);
            if (value !== "" && value !== child.value) {
                child.value = value;

                if (child.onchange) {
                    child.onchange(undefined!);
                } else if (child.onclick) {
                    child.onclick(undefined!);
                }
            }
        }
    }

    /**
     * Stores an element's value in the internal GameStarter.ItemsHolder,
     * if it has the "localStorageKey" attribute.
     * 
     * @param {HTMLElement} child   An element with a value to store.
     * @param {Mixed} value   What value is to be stored under the key.
     */
    protected storeLocalStorageValue(child: IInputElement | ISelectElement, value: any): void {
        const key: string | null = child.getAttribute("localStorageKey");

        if (key) {
            this.gameStarter.ItemsHolder.setItem(key, value);
            this.gameStarter.ItemsHolder.saveItem(key);
        }
    }
}
