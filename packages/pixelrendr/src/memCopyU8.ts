/**
 * Copies a slice from one Uint8ClampedArray or number[] to another.
 *
 * @aram source   An Array-like source to copy from.
 * @param destination   An Array-like destination to copy to.
 * @param readLocation   Where to start reading from in the source.
 * @param writeLocation   Where to start writing to in the source.
 * @param writeLength   How many members to copy over.
 * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
 * @see http://www.javascripture.com/Uint8ClampedArray
 */
export const memCopyU8 = (
    source: Uint8ClampedArray | number[],
    destination: Uint8ClampedArray | number[],
    readLocation = 0,
    writeLocation = 0,
    writeLength = Math.min(source.length, destination.length)
): void => {
    // JIT compilation help
    let lWriteLength = writeLength + 0;
    let lWriteLocation = writeLocation + 0;
    let lReadLocation = readLocation + 0;

    while (lWriteLength--) {
        destination[lWriteLocation++] = source[lReadLocation++];
    }
};
