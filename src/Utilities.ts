/// <reference path="../typings/EightBittr.d.ts" />

import { GameStartr } from "./GameStartr";
import { IPageStyles, IThing } from "./IGameStartr";

/**
 * Miscellaneous utility functions used by GameStartr instances.
 */
export class Utilities<TIEightBittr extends GameStartr> extends EightBittr.Utilities<TIEightBittr> {
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
        const link: HTMLLinkElement = this.EightBitter.utilities.createElement("a", {
            download: name + "." + format.split("/")[1],
            href: this.EightBitter.canvas.toDataURL(format).replace(format, "image/octet-stream")
        }) as HTMLLinkElement;

        link.click();
    }

    /**
     * Adds a set of CSS styles to the page.
     * 
     * @param styles   CSS styles represented as JSON.
     */
    public addPageStyles(styles: IPageStyles): void {
        const sheet: HTMLStyleElement = this.EightBitter.utilities.createElement("style", {
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

        document.querySelector("head").appendChild(sheet);
    }
}
