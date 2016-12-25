import { Utilities as EightBittrUtilities } from "eightbittr/lib/components/Utilities";

import { IGameStartrProcessedSettings, IGameStartrSettings, IThing } from "../IGameStartr";

/**
 * Extra CSS styles that may be added to a page.
 */
export interface IPageStyles {
    [i: string]: {
        [j: string]: string | number;
    };
}

/**
 * Miscellaneous utility functions used by GameStartr instances.
 */
export class Utilities extends EightBittrUtilities {
    /**
     * Game canvas element being manipulated.
     */
    private readonly canvas: HTMLCanvasElement;

    /**
     * Processes raw instantiation settings for sizing.
     * 
     * @param settings   Raw instantiation settings.
     * @returns Initialization settings with filled out, finite sizes.
     */
    public static processSettings(settings: IGameStartrSettings): IGameStartrProcessedSettings {
        return EightBittrUtilities.prototype.proliferate(
            {
                height: Utilities.processSizeSetting(settings.height, innerHeight - 117),
                width: Utilities.processSizeSetting(settings.width, innerWidth)
            },
            settings);
    }

    /**
     * Processes a size number for instantiation settings.
     * 
     * @param size   A raw size measure for instantiation settings.
     * @param stretched   The default amount for the size.
     * @returns A processed size number for instantiation settings.
     */
    public static processSizeSetting(size: number | undefined, stretched: number): number {
        if (size && isFinite(size)) {
            return size;
        }

        return stretched;
    }

    /**
     * Initializes a new instance of the Utilities class.
     * 
     * @param canvas   Game canvas element being manipulated.
     */
    public constructor(canvas: HTMLCanvasElement) {
        super();

        this.canvas = canvas;
    }

    /**
     * Removes a Thing from an Array using Array.splice. If the thing has an 
     * onDelete, that is called.
     * 
     * @param thing
     * @param array   The group containing the thing.
     * @param location   The index of the Thing in the Array, for speed's
     *                   sake (by default, it is found using Array.indexOf).
     */
    public arrayDeleteThing(thing: IThing, array: IThing[], location: number = array.indexOf(thing)): void {
        if (location === -1) {
            return;
        }

        array.splice(location, 1);

        if (typeof thing.onDelete === "function") {
            thing.onDelete(thing);
        }
    }

    /**
     * Takes a snapshot of the current screen canvas by simulating a click event
     * on a dummy link.
     * 
     * @param name   A name for the image to be saved as.
     * @param format   A format for the image to be saved as (by default, png).
     * @remarks For security concerns, browsers won't allow this unless it's
     *          called within a callback of a genuine user-triggered event.
     */
    public takeScreenshot(name: string, format: string = "image/png"): void {
        const link: HTMLLinkElement = this.createElement("a", {
            download: name + "." + format.split("/")[1],
            href: this.canvas.toDataURL(format).replace(format, "image/octet-stream")
        }) as HTMLLinkElement;

        link.click();
    }

    /**
     * Adds a set of CSS styles to the page.
     * 
     * @param styles   CSS styles represented as JSON.
     */
    public addPageStyles(styles: IPageStyles): void {
        const sheet: HTMLStyleElement = this.createElement("style", {
            type: "text/css"
        }) as HTMLStyleElement;
        let compiled: string = "";

        for (const i in styles) {
            if (!styles.hasOwnProperty(i)) {
                continue;
            }

            compiled += i + " { \r\n";
            for (const j in styles[i]) {
                if (styles[i].hasOwnProperty(j)) {
                    compiled += "  " + j + ": " + styles[i][j] + ";\r\n";
                }
            }
            compiled += "}\r\n";
        }

        if ((sheet as any).styleSheet) {
            (sheet as any).style.cssText = compiled;
        } else {
            sheet.appendChild(document.createTextNode(compiled));
        }

        document.querySelector("head")!.appendChild(sheet);
    }
}
