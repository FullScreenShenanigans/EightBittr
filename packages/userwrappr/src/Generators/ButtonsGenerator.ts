import { IGameStartr, IOptionsGenerator } from "../IUserWrappr";
import { IOption, IOptionSource, ISchema } from "../UISchemas";
import { OptionsGenerator } from "./OptionsGenerator";

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
    callback: (GameStarter: IGameStartr, ...args: any[]) => void;

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
    callback?: (GameStarter: IGameStartr, ...args: any[]) => void;

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
    public generate(schema: IOptionsButtonsSchema): HTMLDivElement {
        const output: HTMLDivElement = document.createElement("div");
        const options: IOptionsButtonSchema[] = schema.options instanceof Function
            ? (schema.options as IOptionSource).call(self, this.GameStarter)
            : schema.options;

        output.className = "select-options select-options-buttons";

        for (const option of options) {
            const element = document.createElement("div");
            element.className = "select-option options-button-option";
            element.textContent = option.title;

            element.onclick = this.generateOptionElementClick(schema, element);
            this.ensureLocalStorageButtonValue(element, option, schema);

            if ((option as any)[schema.keyActive || "active"]) {
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
     * @param details   Details for the button to be created.
     * @param schema   The overall schema for the button.
     */
    protected ensureLocalStorageButtonValue(child: HTMLDivElement, details: IOptionsButtonSchema, schema: IOptionsButtonsSchema): void {
        const key: string = schema.title + "::" + details.title;
        const valueDefault: string = details.source.call(this, this.GameStarter).toString();

        child.setAttribute("localStorageKey", key);

        this.GameStarter.ItemsHolder.addItem(key, {
            "storeLocally": true,
            "valueDefault": valueDefault
        });

        const value: string = this.GameStarter.ItemsHolder.getItem(key);
        if (value.toString().toLowerCase() === "true") {
            (details as any)[schema.keyActive || "active"] = true;
            schema.callback.call(this, this.GameStarter, schema, child);
        }
    }

    /**
     * Generates an onclick callback for a button.
     * 
     * @param schema   The button's schema description.
     * @param element   The button's generated HTML element.
     * @returns An onclick callback for the button.
     */
    private generateOptionElementClick(schema: IOptionsButtonsSchema, element: HTMLDivElement): () => void {
        return (): void => {
            if (this.getParentControlElement(element).getAttribute("active") !== "on") {
                return;
            }
            schema.callback.call(this, this.GameStarter, schema, element);

            if (element.getAttribute("option-enabled") === "true") {
                element.setAttribute("option-enabled", "false");
                element.className = "select-option options-button-option option-disabled";
            } else {
                element.setAttribute("option-enabled", "true");
                element.className = "select-option options-button-option option-enabled";
            }
        };
    }
}
