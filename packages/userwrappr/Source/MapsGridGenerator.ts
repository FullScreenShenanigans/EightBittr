module UserWrappr.UISchemas {
    "use strict";

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
     * directly int IGameStartr::createElement.
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
        generate(schema: IOptionsMapGridSchema): HTMLDivElement {
            var output: HTMLDivElement = document.createElement("div");

            output.className = "select-options select-options-maps-grid";

            if (schema.rangeX && schema.rangeY) {
                output.appendChild(this.generateRangedTable(schema));
            }

            if (schema.extras) {
                this.appendExtras(output, schema);
            }

            return output;
        }

        /**
         * Generates a table of map selection buttons from x- and y- ranges.
         * 
         * @param schema   The overall description of the editor control.
         * @returns An HTMLTableElement with a grid of map selection buttons.
         */
        generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement {
            var scope: MapsGridGenerator = this,
                table: HTMLTableElement = document.createElement("table"),
                rangeX: number[] = schema.rangeX,
                rangeY: number[] = schema.rangeY,
                row: HTMLTableRowElement,
                cell: HTMLTableCellElement,
                i: number,
                j: number;

            for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";

                for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    cell = document.createElement("td");
                    cell.className = "select-option maps-grid-option maps-grid-option-range";
                    cell.textContent = i + "-" + j;
                    cell.onclick = (function (callback: () => any): void {
                        if (scope.getParentControlElement(cell).getAttribute("active") === "on") {
                            callback();
                        }
                    }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, cell));
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
        appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void {
            var element: HTMLDivElement,
                extra: IOptionsMapGridExtra,
                i: number,
                j: number;

            for (i = 0; i < schema.extras.length; i += 1) {
                extra = schema.extras[i];
                element = document.createElement("div");

                element.className = "select-option maps-grid-option maps-grid-option-extra";
                element.textContent = extra.title;
                element.setAttribute("value", extra.title);
                element.onclick = extra.callback.bind(this, this.GameStarter, schema, element);
                output.appendChild(element);

                if (extra.extraElements) {
                    for (j = 0; j < extra.extraElements.length; j += 1) {
                        output.appendChild(this.GameStarter.createElement(
                            extra.extraElements[j].tag,
                            extra.extraElements[j].options));
                    }
                }
            }
        }
    }
}
