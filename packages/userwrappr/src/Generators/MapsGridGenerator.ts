import { GameStartr } from "gamestartr/lib/GameStartr";

import { IOptionsGenerator } from "../IUserWrappr";
import { ISchema } from "../UISchemas";
import { OptionsGenerator } from "./OptionsGenerator";

/**
 * Handler for a map being selected.
 * 
 * @param GameStarter   The GameStarter whose level is being edited.
 * @param schema   The overall description of the editor control.
 * @param button   The button that was just clicked.
 * @param event   The event associated with the user clicking the button.
 */
export interface IMapSelectionCallback {
    (gameStarter: GameStartr, schema: IOptionsMapGridSchema, button: HTMLElement, event: Event): void;
}

/**
 * Description of a user control for a map selector.
 */
export interface IOptionsMapGridSchema extends ISchema {
    /**
     * Handler for a map being selected.
     */
    callback: IMapSelectionCallback;

    /**
     * If there is a table of maps, the start and end x-values.
     */
    rangeX?: [number, number];

    /**
     * If there is a table of maps, the start and end y-values.
     */
    rangeY?: [number, number];

    /**
     * Extra options to be displayed.
     */
    extras?: IOptionsMapGridExtra[];
}

/**
 * An extra option to be displayed in a maps grid.
 */
export interface IOptionsMapGridExtra {
    /**
     * The visible label of the extra's button.
     */
    title: string;

    /**
     * Handler for when this extra's button is triggered.
     */
    callback: IMapSelectionCallback;

    /**
     * Descriptions of any extra elements to be displayed.
     */
    extraElements: IOptionsMapGridExtraElement[];
}

/**
 * A description of an extra element to place after a maps grid extra, to be piped
 * directly int GameStartr::createElement.
 */
export interface IOptionsMapGridExtraElement {
    /**
     * The tag name of the element.
     */
    tag: string;

    /**
     * Options for the element, such as className or value.
     */
    options: any;
}

/**
 * Options generator for a grid of maps.
 */
export class MapsGridGenerator extends OptionsGenerator implements IOptionsGenerator {
    /**
     * Generates the HTML element for the maps.
     * 
     * @param schema   The overall description of the editor control.
     * @returns An HTML element representing the schema.
     */
    public generate(schema: IOptionsMapGridSchema): HTMLDivElement {
        const output: HTMLDivElement = document.createElement("div");

        output.className = "select-options select-options-maps-grid";

        if (schema.rangeX && schema.rangeY) {
            output.appendChild(this.generateRangedTable(schema));
        }

        this.appendExtras(output, schema);

        return output;
    }

    /**
     * Generates a table of map selection buttons from x- and y- ranges.
     * 
     * @param schema   The overall description of the editor control.
     * @returns An HTMLTableElement with a grid of map selection buttons.
     */
    public generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement {
        if (!schema.rangeX || !schema.rangeY) {
            throw new Error("Invalid schema for a ranged table.");
        }

        const table: HTMLTableElement = document.createElement("table");

        for (let i: number = schema.rangeY[0]; i <= schema.rangeY[1]; i += 1) {
            const row: HTMLTableRowElement = document.createElement("tr");
            row.className = "maps-grid-row";

            for (let j: number = schema.rangeX[0]; j <= schema.rangeX[1]; j += 1) {
                const cell: HTMLTableCellElement = document.createElement("td");
                cell.className = "select-option maps-grid-option maps-grid-option-range";
                cell.textContent = i + "-" + j;
                cell.onclick = ((callback: () => any): void => {
                    if (this.getParentControlElement(cell).getAttribute("active") === "on") {
                        callback();
                    }
                }).bind(this, schema.callback.bind(this, this.userWrapper.getGameStarter(), schema, cell));
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        return table;
    }

    /**
     * Adds any specified extra elements to this control's element.
     * 
     * @param output   The element created by this generator.
     * @param schema   The overall discription of the editor control.
     */
    public appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void {
        if (!schema.extras) {
            return;
        }

        for (const extra of schema.extras) {
            const element: HTMLDivElement = document.createElement("div");

            element.className = "select-option maps-grid-option maps-grid-option-extra";
            element.textContent = extra.title;
            element.setAttribute("value", extra.title);
            element.onclick = extra.callback.bind(this, this.userWrapper.getGameStarter(), schema, element);
            output.appendChild(element);

            if (extra.extraElements) {
                for (const extraElement of extra.extraElements) {
                    output.appendChild(
                        this.userWrapper.getGameStarter().utilities.createElement(
                            extraElement.tag,
                            extraElement.options));
                }
            }
        }
    }
}
