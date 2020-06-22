import { EightBittr } from "../../EightBittr";
import { IThing } from "../../IEightBittr";
import { GeneralComponent } from "../GeneralComponent";

/**
 * Changes the opacity of Things.
 */
export class Opacity<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * Sets the opacity of the Thing and marks its appearance as changed.
     *
     * @param thing
     * @param opacity   A number in [0,1].
     */
    public setOpacity(thing: IThing, opacity: number): void {
        thing.opacity = opacity;
        thing.changed = true;
    }
}
