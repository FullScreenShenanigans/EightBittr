import { IOptionsGenerator } from "../IUserWrappr";
import { ISchema } from "../UISchemas";
import { IOptionsMapGridSchema, IMapSelectionCallback } from "./MapsGridGenerator";
import { OptionsGenerator } from "./OptionsGenerator";

/**
 * Description of a user control for a level editor.
 */
export interface IOptionsEditorSchema extends ISchema {
    /**
     * Map names the user may load into the editor.
     */
    maps: IOptionsMapGridSchema;

    /**
     * Loads a built-in map into the editor after the user has clicked a button.
     */
    callback: IMapSelectionCallback;
}

/**
 * Options generator for a LevelEditr dialog.
 */
export class LevelEditorGenerator extends OptionsGenerator implements IOptionsGenerator {
    /**
     * Generates a control for a level editor based on the provided schema.
     * 
     * @param schema   The overall description of the editor control.
     * @returns An HTML element representing the schema.
     */
    public generate(schema: IOptionsEditorSchema): HTMLDivElement {
        const output: HTMLDivElement = document.createElement("div");
        const starter: HTMLDivElement = document.createElement("div");
        const betweenOne: HTMLDivElement = document.createElement("div");
        const betweenTwo: HTMLDivElement = document.createElement("div");
        const uploader: HTMLDivElement = this.createUploaderDiv();
        const mapper: HTMLDivElement = this.createMapSelectorDiv(schema);

        output.className = "select-options select-options-level-editor";

        starter.className = "select-option select-option-large options-button-option";
        starter.innerHTML = "Start the <br /> Level Editor!";
        starter.onclick = (): void => this.GameStarter.LevelEditor.enable();

        betweenOne.className = betweenTwo.className = "select-option-title";
        betweenOne.innerHTML = betweenTwo.innerHTML = "<em>- or -</em><br />";

        output.appendChild(starter);
        output.appendChild(betweenOne);
        output.appendChild(uploader);
        output.appendChild(betweenTwo);
        output.appendChild(mapper);

        return output;
    }

    /**
     * Creates an HTML element that can be clicked or dragged on to upload a JSON file
     * into the level editor.
     * 
     * @returns An element containing the uploader div.
     */
    protected createUploaderDiv(): HTMLDivElement {
        const uploader: HTMLDivElement = document.createElement("div");
        const input: HTMLInputElement = document.createElement("input");

        uploader.className = "select-option select-option-large options-button-option";
        uploader.innerHTML = "Continue an<br />editor file!";
        uploader.setAttribute("textOld", uploader.textContent);

        input.type = "file";
        input.className = "select-upload-input";
        input.onchange = this.handleFileDrop.bind(this, input, uploader);

        uploader.ondragenter = this.handleFileDragEnter.bind(this, uploader);
        uploader.ondragover = this.handleFileDragOver.bind(this, uploader);
        uploader.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, uploader);
        uploader.ondrop = this.handleFileDrop.bind(this, input, uploader);
        uploader.onclick = input.click.bind(input);

        uploader.appendChild(input);

        return uploader;
    }

    /**
     * Creates an HTML element that allows a user to choose between maps to load into
     * the level editor.
     * 
     * @param schema   The overall description of the container user control.
     * @returns An element containing the map selector.
     */
    protected createMapSelectorDiv(schema: IOptionsEditorSchema): HTMLDivElement {
        const generatorName: string = "MapsGrid";
        const container: HTMLDivElement = this.GameStarter.utilities.createElement("div", {
            className: "select-options-group select-options-editor-maps-selector"
        });
        const toggler: HTMLDivElement = this.GameStarter.utilities.createElement("div", {
            className: "select-option select-option-large options-button-option"
        });
        const mapsOut: HTMLDivElement = this.GameStarter.utilities.createElement("div", {
            className: "select-options-holder select-options-editor-maps-holder"
        });
        const mapsIn: HTMLDivElement = this.UserWrapper.getGenerators()[generatorName].generate(
            this.GameStarter.utilities.proliferate(
                {
                    callback: schema.callback
                },
                schema.maps));
        let expanded: boolean = true;

        toggler.onclick = (event?: Event): void => {
            expanded = !expanded;

            if (expanded) {
                toggler.textContent = "(cancel)";
                mapsOut.style.position = "";
                mapsIn.style.height = "";
            } else {
                toggler.innerHTML = "Edit a <br />built-in map!";
                mapsOut.style.position = "absolute";
                mapsIn.style.height = "0";
            }

            if (!container.parentElement) {
                return;
            }

            [].slice.call(container.parentElement.children)
                .forEach(function (element: HTMLElement): void {
                    if (element !== container) {
                        element.style.display = (expanded ? "none" : "block");
                    }
                });
        };

        toggler.onclick(null);

        mapsOut.appendChild(mapsIn);
        container.appendChild(toggler);
        container.appendChild(mapsOut);

        return container;
    }

    /**
     * Handles a dragged file entering a map selector. Visual styles are updated.
     * 
     * @param uploader   The element being dragged onto.
     * @param event   The event caused by the dragging.
     */
    protected handleFileDragEnter(uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
        }

        uploader.className += " hovering";
    }

    /**
     * Handles a dragged file moving over a map selector.
     * 
     * @param uploader   The element being dragged onto.
     * @param event   The event caused by the dragging.
     */
    protected handleFileDragOver(uploader: HTMLElement, event: MouseEvent): boolean {
        event.preventDefault();
        return false;
    }

    /**
     * Handles a dragged file leaving a map selector. Visual styles are updated.
     * 
     * @param uploader   The element being dragged onto.
     * @param event   The event caused by the dragging.
     */
    protected handleFileDragLeave(uploader: HTMLElement, event: LevelEditr.IDataMouseEvent): void {
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "none";
        }

        uploader.className = uploader.className.replace(" hovering", "");
    }

    /**
     * Handles a dragged file being dropped onto a map selector. The file is read, and
     * events attached to its progress.
     * 
     * @param input   The HTMLInputElement triggering the file event.
     * @param uploader   The element being dragged onto.
     * @param event   The event caused by the dragging.
     */
    protected handleFileDrop(input: HTMLInputElement, uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
        const files: FileList = input.files || event.dataTransfer.files;
        const reader: FileReader = new FileReader();

        this.handleFileDragLeave(input, event);
        event.preventDefault();
        event.stopPropagation();

        reader.onprogress = this.handleFileUploadProgress.bind(this, files[0], uploader);
        reader.onloadend = this.handleFileUploadCompletion.bind(this, files[0], uploader);

        reader.readAsText(files[0]);
    }

    /**
     * Handles a file upload reporting some amount of progress.
     * 
     * @param file   The file being uploaded.
     * @param uploader   The element the file was being dragged onto.
     * @param event   The event caused by the progress.
     */
    protected handleFileUploadProgress(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
        if (!event.lengthComputable) {
            return;
        }

        let percent: number = Math.max(Math.round((event.loaded / event.total) * 100), 100);

        uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
    }

    /**
     * Handles a file upload completing. The file's contents are loaded into
     * the level editor.
     * 
     * @param file   The file being uploaded.
     * @param uploader   The element the file was being dragged onto.
     * @param event   The event caused by the upload completing.
     */
    protected handleFileUploadCompletion(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
        this.GameStarter.LevelEditor.handleUploadCompletion(event);
        uploader.innerText = uploader.getAttribute("textOld");
    }
}
