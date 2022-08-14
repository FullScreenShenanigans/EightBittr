/**
 * Copies a slice from one Uint8ClampedArray or number[] to another.
 *
 * @aram source   An Array-like source to copy from.
 * @param destination   An Array-like destination to copy to.
 * @param readLocation   Where to start reading from in the source.
 * @param writeLocation   Where to start writing to in the source.
 * @param writelength   How many members to copy over.
 * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
 * @see http://www.javascripture.com/Uint8ClampedArray
 */
export const memcpyU8 = (
    source: Uint8ClampedArray | number[],
    destination: Uint8ClampedArray | number[],
    readLocation = 0,
    writeLocation = 0,
    writelength = Math.min(source.length, destination.length)
): void => {
    // JIT compilation help
    let lwritelength = writelength + 0;
    let lwriteloc = writeLocation + 0;
    let lreadloc = readLocation + 0;

    while (lwritelength--) {
        destination[lwriteloc++] = source[lreadloc++];
    }
};
