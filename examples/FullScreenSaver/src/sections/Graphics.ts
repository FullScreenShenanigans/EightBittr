import { Graphics as EightBittrGraphics } from "eightbittr";
import { Palette } from "pixelrendr";

import { FullScreenSaver } from "../FullScreenSaver";

export class Graphics<Game extends FullScreenSaver> extends EightBittrGraphics<Game> {
    public readonly background = "black";

    public readonly library = {
        CharA: "x011,1x06,101x05,101000010001000x15,001x05,101x05,10",
        CharB: "x08,x15,0001000010010000100x16,001x05,101x05,10x16,00",
        CharC: "x010,111100010000101x07,1x07,1x08,100001000111100",
        CharD: "x08,x15,000100001001x05,101x05,101x05,1010000100x15,000",
        CharE: "x08,x17,01x07,1x07,x16,001x07,1x07,x17,0",
        CharF: "x08,x17,01x07,1x07,x16,001x07,1x07,1",
        CharG: "x010,111100010000101x07,100111101x05,100100001000111100",
        CharH: "x08,1x05,101x05,101x05,10x17,01x05,101x05,101x05,10",
        CharI: "x09,x15,x05,1x07,1x07,1x07,1x07,1x05,x15,00",
        CharJ: "x09,x16,x05,1x07,1x07,1000100010001000100001110000",
        CharK: "x08,1000010010001000100100001011000011001000100001001x05,10",
        CharL: "x08,1x07,1x07,1x07,1x07,1x07,1x07,x17,0",
        CharM: "x08,1x05,101100011010101010100100101x05,101x05,101x05,10",
        CharN: "x08,1x05,1011000010101000101001001010001010100001101x05,10",
        CharO: "x010,111000010001001x05,101x05,101x05,100100010000111000",
        CharP: "x08,x16,001x05,101x05,10x16,001x07,1x07,1",
        CharQ: "x010,111000010001001x05,101x05,10100010100100010000111010",
        CharR: "x08,x16,001x05,101x05,10x16,0010001000100001001x05,10",
        CharS: "x09,1111000100001001x08,x15,x08,101x05,100x15,00",
        CharT: "x08,x17,00001x07,1x07,1x07,1x07,1x07,10000",
        CharU: "x08,1x05,101x05,101x05,101x05,101x05,100100001000x15,0",
        CharV: "x08,1x05,101x05,10010001000100010000101x05,101x06,10000",
        CharW: "x08,1x05,1010010010101010101010101011000110110001101x05,10",
        CharX: "x08,110001100100010000101x06,1x06,1010000100010011000110",
        CharY: "x08,1x05,100100010000101x06,1x07,1x07,1x07,10000",
        CharZ: "x08,x17,x06,1x06,1x06,1x06,1x06,1x06,x17,0",
        Char0: "x018,1110000100110011000110110001100110010000111000",
        Char1: "x018,11x05,111x06,11x06,11x06,110000x16,00",
        Char2: "x017,x15,001100011x05,111001111000111x05,x17,0",
        Char3: "x017,x16,x05,110000111x08,110110001100x15,00",
        Char4: "x019,11100001111000110110011001100x17,x05,1100",
        Char5: "x016,x16,0011x06,x16,x07,110110001100x15,00",
        Char6: "x017,x15,0011x06,x16,0011000110110001100x15,00",
        Char7: "x016,x17,01100011x05,11x05,11x05,11x06,110000",
        Char8: "x017,x15,00110001100x15,0011000110110001100x15,00",
        Char9: "x017,x15,0011000110110001100x16,x06,1100x15,00",
        Player: "x21024,",
        Square: "x14096,",
    };

    public readonly paletteDefault: Palette = [
        [0, 0, 0, 0],
        [255, 255, 255, 255],
        [35, 255, 70, 255],
    ];
}
