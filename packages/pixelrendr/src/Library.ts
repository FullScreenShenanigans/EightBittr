import { ILibraryRaws, IRender, IRenderLibrary } from "./IPixelRendr";
import { Render } from "./Render";

/**
 * A base container for storing raw sprites and their renders.
 */
export class Library {
    /**
     * The original sources for the sprites.
     */
    public readonly raws: ILibraryRaws;

    /**
     * Rendered sprites from the raw sources.
     */
    public readonly sprites: IRenderLibrary;

    /**
     * Initializes a new instance of the Library class.
     *
     * @param raws   Original sources for the sprites.
     */
    public constructor(raws: ILibraryRaws) {
        this.raws = raws;
        this.sprites = this.parse(raws);
    }

    /**
     * Parses raw sprite sources into rendered sprites.
     *
     * @param raws   Raw sources for sprites.
     * @returns Rendered sprites from the raw sources.
     */
    private parse(raws: ILibraryRaws): IRenderLibrary {
        const setNew: IRenderLibrary = {};

        for (const i in raws) {
            const source: any = raws[i];

            switch (source.constructor) {
                case String:
                    setNew[i] = new Render(source);
                    break;

                case Array:
                    setNew[i] = new Render(source, source[1]);
                    break;

                default:
                    setNew[i] = this.parse(source);
                    break;
            }

            if (setNew[i].constructor === Render) {
                (setNew[i] as IRender).containers.push({
                    container: setNew,
                    key: i
                });
            }
        }

        return setNew;
    }
}
