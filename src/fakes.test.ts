import { GameStartr } from "./GameStartr";
import { IThing } from "./IGameStartr";

export const stubHeight = 480;

export const stubWidth = 320;

export const stubGameStartr = () =>
    new GameStartr({
        height: stubHeight,
        width: stubWidth,
    });

/**
 *
 */
export const stubThing = (): IThing => ({
    alive: true,
    bottom: 28,
    className: "Stub solid",
    changed: true,
    cycles: {},
    groupType: "solid",
    height: 14,
    hidden: false,
    right: 42,
    top: 14,
    left: 35,
    maxquads: 1,
    numQuadrants: 0,
    opacity: 1,
    quadrants: [],
    spriteheight: 1,
    spritewidth: 1,
    title: "Stub",
    width: 7,
    xvel: 0,
    yvel: 0,
});
