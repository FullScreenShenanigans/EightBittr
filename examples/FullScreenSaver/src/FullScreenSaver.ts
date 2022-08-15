import { factory, member } from "autofieldr";
import { Actor, EightBittr, EightBittrConstructorSettings } from "eightbittr";
import { GroupHoldr } from "groupholdr";
import { ItemsHoldr } from "itemsholdr";
import { MenuGraphr } from "menugraphr";

import { createMenuGrapher } from "./creators/createMenuGrapher";
import { Collisions } from "./sections/Collisions";
import { Graphics } from "./sections/Graphics";
import { Groups } from "./sections/Groups";
import { Inputs } from "./sections/Inputs";
import { Maintenance } from "./sections/Maintenance";
import { Objects } from "./sections/Objects";
import { Players } from "./sections/Players";
import { Quadrants } from "./sections/Quadrants";
import { Scoring } from "./sections/Scoring";
import { Squares } from "./sections/Squares";

/**
 * Example game with EightBittr tooling
 */
export class FullScreenSaver extends EightBittr {
    /**
     * Text-based menu and dialog management system.
     */
    @factory(createMenuGrapher)
    public readonly menuGrapher: MenuGraphr;

    /**
     * Checkers and callbacks for Actor collisions.
     */
    @member(Collisions)
    public readonly collisions: Collisions<this>;

    /**
     * Stores the visual appearance of Actors.
     */
    @member(Graphics)
    public readonly graphics: Graphics<this>;

    /**
     * Collection settings for Actor group names.
     */
    @member(Groups)
    public readonly groups: Groups<this>;

    /**
     * General storage abstraction for keyed containers of items.
     */
    public readonly groupHolder: GroupHoldr<{
        Squares: Actor;
        Players: Actor;
        Text: Actor;
    }>;

    /**
     * Cache-based wrapper around localStorage.
     */
    public readonly itemsHolder: ItemsHoldr<{
        highScore: number;
        score: number;
    }>;

    /**
     * User input filtering and handling.
     */
    @member(Inputs)
    public readonly inputs: Inputs<this>;

    /**
     * Update logic for Actors in game ticks.
     */
    @member(Maintenance)
    public readonly maintenance: Maintenance<this>;

    /**
     * Raw ObjectMakr factory settings.
     */
    @member(Objects)
    public readonly objects: Objects<this>;

    /**
     * Creates and updates player Actors.
     */
    @member(Players)
    public readonly players: Players;

    /**
     * Arranges game physics quadrants.
     */
    @member(Quadrants)
    public readonly quadrants: Quadrants<this>;

    /**
     * Keeps track of points and high scores.
     */
    @member(Scoring)
    public readonly scoring: Scoring;

    /**
     * Creates square Actors in the game.
     */
    @member(Squares)
    public readonly squares: Squares;

    /**
     * Initializes a new instance of the FullScreenSaver class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: EightBittrConstructorSettings) {
        super(settings);

        this.quadsKeeper.resetQuadrants();

        this.squares.addSquare(this.mapScreener.width / 2, this.mapScreener.height / 2, 2, -2);
    }
}
