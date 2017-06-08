import { Utilities as EightBittrUtilities } from "eightbittr/lib/components/Utilities";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

/**
 * Miscellaneous utility functions used by GameStartr instances.
 */
export class Utilities<TGameStartr extends GameStartr> extends EightBittrUtilities<TGameStartr> {
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
            href: this.gameStarter.canvas.toDataURL(format).replace(format, "image/octet-stream")
        }) as HTMLLinkElement;

        link.click();
    }
}
