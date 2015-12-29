module UserWrappr.UISchemas {
    "use strict";

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
        action: (GameStarter: IGameStartr) => void;
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
        disable: (GameStarter: IGameStartr) => void;

        /**
         * Callback for when the value becomes true.
         * 
         * @param GameStarter   The GameStarter this option is controlling.
         */
        enable: (GameStarter: IGameStartr) => void;

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
        callback: (GameStarter: IGameStartr) => void;

        /**
         * A source for the allowed keys in the option.
         * 
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string[];
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
        update: (GameStarter: IGameStartr) => void;
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
        options: (GameStarter: IGameStartr) => string[];

        /**
         * A source for the initially selected value.
         * 
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string;

        /**
         * Callback for when the value changes.
         * 
         * @param GameStarter   The GameStarter this option is controlling.
         * @param value   A new value, if this is triggered via a code callback.
         */
        update: (GameStarter: IGameStartr, value?: any) => void;
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
        options: (GameStarter: IGameStartr) => string[];

        /**
         * A source for the initially selected value.
         * 
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string;

        /**
         * Callback for when the value changes.
         * 
         * @param GameStarter   The GameStarter this option is controlling.
         * @param value   The newly selected size information.
         */
        update: (GameStarter: IGameStartr, value: ISizeSummary) => void;
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
            "Boolean": TableGenerator.prototype.setBooleanInput,
            "Keys": TableGenerator.prototype.setKeyInput,
            "Number": TableGenerator.prototype.setNumberInput,
            "Select": TableGenerator.prototype.setSelectInput,
            "ScreenSize": TableGenerator.prototype.setScreenSizeInput
        };

        /**
         * Generates a control element with tabular information based on the provided schema.
         * 
         * @param schema   A description of the tabular data to represent.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsTableSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div"),
                table: HTMLTableElement = document.createElement("table"),
                option: IOptionsTableOption,
                action: IOptionsTableAction,
                row: HTMLTableRowElement | HTMLDivElement,
                label: HTMLTableDataCellElement,
                input: HTMLTableDataCellElement,
                child: IInputElement | ISelectElement,
                i: number;

            output.className = "select-options select-options-table";

            if (schema.options) {
                for (i = 0; i < schema.options.length; i += 1) {
                    row = document.createElement("tr");
                    label = document.createElement("td");
                    input = document.createElement("td");

                    option = schema.options[i];

                    label.className = "options-label-" + option.type;
                    label.textContent = option.title;

                    input.className = "options-cell-" + option.type;

                    row.appendChild(label);
                    row.appendChild(input);

                    child = TableGenerator.optionTypes[schema.options[i].type].call(this, input, option, schema);
                    if (option.storeLocally) {
                        this.ensureLocalStorageInputValue(child, option, schema);
                    }

                    table.appendChild(row);
                }
            }

            output.appendChild(table);

            if (schema.actions) {
                for (i = 0; i < schema.actions.length; i += 1) {
                    row = document.createElement("div");

                    action = schema.actions[i];

                    row.className = "select-option options-button-option";
                    row.textContent = action.title;
                    row.onclick = action.action.bind(this, this.GameStarter);

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
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption, schema: ISchema): IInputElement {
            var status: boolean = details.source.call(this, this.GameStarter),
                statusClass: string = status ? "enabled" : "disabled",
                scope: TableGenerator = this;

            input.className = "select-option options-button-option option-" + statusClass;
            input.textContent = status ? "on" : "off";

            input.onclick = function (): void {
                input.setValue(input.textContent === "off");
            };

            input.setValue = function (newStatus: string | boolean): void {
                if (newStatus.constructor === String) {
                    if (newStatus === "false" || newStatus === "off") {
                        newStatus = false;
                    } else if (newStatus === "true" || newStatus === "on") {
                        newStatus = true;
                    }
                }

                if (newStatus) {
                    details.enable.call(scope, scope.GameStarter);
                    input.textContent = "on";
                    input.className = input.className.replace("disabled", "enabled");
                } else {
                    details.disable.call(scope, scope.GameStarter);
                    input.textContent = "off";
                    input.className = input.className.replace("enabled", "disabled");
                }

                if (details.storeLocally) {
                    scope.storeLocalStorageValue(input, newStatus.toString());
                }
            };

            return input;
        }

        /**
         * Initializes an input for a keyboard key value.
         * 
         * @param input   An input that will contain a keyboard key value.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption, schema: ISchema): ISelectElement[] {
            var values: string = details.source.call(this, this.GameStarter),
                possibleKeys: string[] = this.UserWrapper.getAllPossibleKeys(),
                children: ISelectElement[] = [],
                child: ISelectElement,
                scope: TableGenerator = this,
                valueLower: string,
                i: number,
                j: number;

            for (i = 0; i < values.length; i += 1) {
                valueLower = values[i].toLowerCase();

                child = <ISelectElement>document.createElement("select");
                child.className = "options-key-option";
                child.value = child.valueOld = valueLower;

                for (j = 0; j < possibleKeys.length; j += 1) {
                    child.appendChild(new Option(possibleKeys[j]));

                    // Setting child.value won't work in IE or Edge...
                    if (possibleKeys[j] === valueLower) {
                        child.selectedIndex = j;
                    }
                }

                child.onchange = (function (child: ISelectElement): void {
                    details.callback.call(scope, scope.GameStarter, child.valueOld, child.value);
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                }).bind(undefined, child);

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
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption, schema: ISchema): IInputElement {
            var child: IInputElement = <UISchemas.IInputElement>document.createElement("input"),
                scope: TableGenerator = this;

            child.type = "number";
            child.value = Number(details.source.call(scope, scope.GameStarter)).toString();
            child.min = (details.minimum || 0).toString();
            child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();

            child.onchange = child.oninput = function (): void {
                if (child.checkValidity()) {
                    details.update.call(scope, scope.GameStarter, child.value);
                }
                if (details.storeLocally) {
                    scope.storeLocalStorageValue(child, child.value);
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
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption, schema: ISchema): ISelectElement {
            var child: ISelectElement = <ISelectElement>document.createElement("select"),
                options: string[] = details.options(this.GameStarter),
                scope: TableGenerator = this,
                i: number;

            for (i = 0; i < options.length; i += 1) {
                child.appendChild(new Option(options[i]));
            }

            child.value = details.source.call(scope, scope.GameStarter);

            child.onchange = function (): void {
                details.update.call(scope, scope.GameStarter, child.value);
                child.blur();

                if (details.storeLocally) {
                    scope.storeLocalStorageValue(child, child.value);
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
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption, schema: ISchema): ISelectElement {
            var scope: TableGenerator = this,
                child: ISelectElement;

            details.options = function (): string[] {
                return Object.keys(scope.UserWrapper.getSizes());
            };

            details.source = function (): string {
                return scope.UserWrapper.getCurrentSize().name;
            };

            details.update = function (GameStarter: IGameStartr, value: ISizeSummary | string): ISelectElement {
                if (value === scope.UserWrapper.getCurrentSize()) {
                    return undefined;
                }

                scope.UserWrapper.setCurrentSize(value);
            };
            child = scope.setSelectInput(input, details, schema);

            return child;
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
                this.ensureLocalStorageValues(<IInputElement[]>childRaw, details, schema);
                return;
            }

            var child: IInputElement | ISelectElement = <IInputElement | ISelectElement>childRaw,
                key: string = schema.title + "::" + details.title,
                valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                value: string;

            child.setAttribute("localStorageKey", key);
            this.GameStarter.ItemsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": valueDefault
            });

            value = this.GameStarter.ItemsHolder.getItem(key);
            if (value !== "" && value !== child.value) {
                child.value = value;

                if (child.setValue) {
                    child.setValue(value);
                } else if (child.onchange) {
                    child.onchange(undefined);
                } else if (child.onclick) {
                    child.onclick(undefined);
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
            var keyGeneral: string = schema.title + "::" + details.title,
                values: any[] = details.source.call(this, this.GameStarter),
                key: string,
                value: any,
                child: IInputElement | ISelectElement,
                i: number;

            for (i = 0; i < children.length; i += 1) {
                key = keyGeneral + "::" + i;
                child = children[i];
                child.setAttribute("localStorageKey", key);

                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": values[i]
                });

                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;

                    if (child.onchange) {
                        child.onchange(undefined);
                    } else if (child.onclick) {
                        child.onclick(undefined);
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
            var key: string = child.getAttribute("localStorageKey");

            if (key) {
                this.GameStarter.ItemsHolder.setItem(key, value);
                this.GameStarter.ItemsHolder.saveItem(key);
            }
        }
    }
}
