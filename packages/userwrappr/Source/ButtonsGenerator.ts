module UserWrappr.UISchemas {
    "use strict";

    /**
     * Description of a user control for a listing of buttons.
     */
    export interface IOptionsButtonsSchema extends ISchema {
        /**
         * Descriptions of the options to be displayed as buttons.
         */
        options: IOptionSource | IOptionsButtonSchema[];

        /**
         * A general, default callback for when a button is clicked.
         */
        callback: (GameStarter: IGameStartr) => void;

        /**
         * A key to add to buttons when they're active.
         */
        keyActive?: string;

        /**
         * Whether buttons should be assumed to be inactive visually.
         */
        assumeInactive?: boolean;
    }

    /**
     * Description for a single button in a buttons schema.
     */
    export interface IOptionsButtonSchema extends IOption {
        /**
         * A callback for when this specific button is pressed.
         */
        callback: (GameStarter: IGameStartr) => void;

        /**
         * A source for the button's initial value.
         */
        source: IOptionSource;

        /**
         * Whether the button's value should be stored locally between sessions.
         */
        storeLocally?: boolean;

        /**
         * What type of button this is, as keyed in the generator.
         */
        type: string;
    }

    /**
     * A buttons generator for an options section that contains any number
     * of general buttons.
     */
    export class ButtonsGenerator extends OptionsGenerator implements IOptionsGenerator {
        /**
         * Generates a control element with buttons described in the schema.
         * 
         * @param schema   A description of the element to create.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsButtonsSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div"),
                options: IOptionsButtonSchema[] = schema.options instanceof Function
                    ? (<IOptionSource>schema.options).call(self, this.GameStarter)
                    : schema.options,
                optionKeys: string[] = Object.keys(options),
                keyActive: string = schema.keyActive || "active",
                classNameStart: string = "select-option options-button-option",
                scope: ButtonsGenerator = this,
                option: IOptionsButtonSchema,
                element: HTMLDivElement,
                i: number;

            output.className = "select-options select-options-buttons";

            for (i = 0; i < optionKeys.length; i += 1) {
                option = options[optionKeys[i]];

                element = document.createElement("div");
                element.className = classNameStart;
                element.textContent = optionKeys[i];

                element.onclick = function (schema: IOptionsButtonSchema, element: HTMLDivElement): void {
                    if (scope.getParentControlElement(element).getAttribute("active") !== "on") {
                        return;
                    }
                    schema.callback.call(scope, scope.GameStarter, schema, element);

                    if (element.getAttribute("option-enabled") === "true") {
                        element.setAttribute("option-enabled", "false");
                        element.className = classNameStart + " option-disabled";
                    } else {
                        element.setAttribute("option-enabled", "true");
                        element.className = classNameStart + " option-enabled";
                    }
                }.bind(this, schema, element);

                this.ensureLocalStorageButtonValue(element, option, schema);

                if (option[keyActive]) {
                    element.className += " option-enabled";
                    element.setAttribute("option-enabled", "true");
                } else if (schema.assumeInactive) {
                    element.className += " option-disabled";
                    element.setAttribute("option-enabled", "false");
                } else {
                    element.setAttribute("option-enabled", "true");
                }

                output.appendChild(element);
            }

            return output;
        }

        /**
         * Ensures a value exists in localStorage, and has the given settings. If
         * it doesn't have a value, the schema's callback is used to provide one.
         * 
         * @param child   The value's representational HTML element.
         * @param details   Details 
         * @param schema   
         */
        protected ensureLocalStorageButtonValue(child: HTMLDivElement, details: IOptionsButtonSchema, schema: IOptionsButtonsSchema): void {
            var key: string = schema.title + "::" + details.title,
                valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                value: string;

            child.setAttribute("localStorageKey", key);

            this.GameStarter.ItemsHolder.addItem(key, {
                "storeLocally": true,
                "valueDefault": valueDefault
            });

            value = this.GameStarter.ItemsHolder.getItem(key);
            if (value.toString().toLowerCase() === "true") {
                details[schema.keyActive || "active"] = true;
                schema.callback.call(this, this.GameStarter, schema, child);
            }
        }
    }
}
