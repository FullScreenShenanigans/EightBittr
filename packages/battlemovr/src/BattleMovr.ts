import { IThing } from "gamestartr/lib/IGameStartr";
import { IMenu } from "menugraphr/lib/IMenuGraphr";

import {
    IBattleInfo, IBattleInfoDefaults, IBattleMovr, IBattleMovrSettings,
    IBattleOption, IBattler, IGameStartr, IMenuNames, IPosition, IPositions,
    IThingsContainer
} from "./IBattleMovr";

/**
 * A driver for RPG-like battles between two collections of actors.
 */
export class BattleMovr implements IBattleMovr {
    /**
     * The IGameStartr providing Thing and actor information.
     */
    protected GameStarter: IGameStartr;

    /**
     * Names of known MenuGraphr menus.
     */
    protected menuNames: IMenuNames;

    /**
     * Option menus the player may select during battle.
     */
    protected battleOptions: IBattleOption[];

    /**
     * Default settings for running battles.
     */
    protected defaults: IBattleInfoDefaults;

    /**
     * Default positions of in-battle Things.
     */
    protected positions: IPositions;

    /**
     * Current settings for a running battle.
     */
    protected battleInfo: IBattleInfo;

    /**
     * All in-battle Things.
     */
    protected things: IThingsContainer;

    /**
     * The type of Thing to create and use as a background.
     */
    private backgroundType?: string;

    /**
     * The created Thing used as a background.
     */
    private backgroundThing?: IThing;

    /**
     * Whether a battle is currently happening.
     */
    private inBattle: boolean;

    /**
     * Initializes a new instance of the BattleMovr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IBattleMovrSettings) {
        if (typeof settings.GameStarter === "undefined") {
            throw new Error("No GameStarter given to BattleMovr.");
        }
        if (typeof settings.battleOptions === "undefined") {
            throw new Error("No battleOptions given to BattleMovr.");
        }
        if (typeof settings.menuNames === "undefined") {
            throw new Error("No menuNames given to BattleMovr.");
        }

        this.GameStarter = settings.GameStarter;
        this.battleOptions = settings.battleOptions;
        this.menuNames = settings.menuNames;

        this.defaults = settings.defaults || {};
        this.backgroundType = settings.backgroundType;
        this.positions = settings.positions || {};

        this.inBattle = false;
        this.things = {};
    }

    /**
     * @returns The IGameStartr providing Thing and actor information.
     */
    public getGameStarter(): IGameStartr {
        return this.GameStarter;
    }

    /**
     * @returns Names of known MenuGraphr menus.
     */
    public getMenuNames(): IMenuNames {
        return this.menuNames;
    }

    /**
     * @returns Default settings for running battles.
     */
    public getDefaults(): IBattleInfoDefaults {
        return this.defaults;
    }

    /**
     * @returns All in-battle Things.
     */
    public getThings(): IThingsContainer {
        return this.things;
    }

    /**
     * @param name   A name of an in-battle Thing.
     * @returns The named in-battle Thing.
     */
    public getThing(name: string): IThing | undefined {
        return this.things[name];
    }

    /**
     * @returns Current settings for a running battle.
     */
    public getBattleInfo(): IBattleInfo {
        return this.battleInfo;
    }

    /**
     * @returns Whether a battle is currently happening.
     */
    public getInBattle(): boolean {
        return this.inBattle;
    }

    /**
     * @returns The type of Thing to create and use as a background.
     */
    public getBackgroundType(): string | undefined {
        return this.backgroundType;
    }

    /**
     * @returns The created Thing used as a background.
     */
    public getBackgroundThing(): IThing | undefined {
        return this.backgroundThing;
    }

    /**
     * Starts a battle.
     * 
     * @param settings   Settings for running the battle.
     */
    public startBattle(settings: IBattleInfo): void {
        if (this.inBattle) {
            return;
        }

        this.inBattle = true;
        this.battleInfo = this.GameStarter.utilities.proliferate({}, this.defaults);

        // A shallow copy is used here for performance, and so Things in .keptThings
        // don't cause an infinite loop proliferating
        for (const i in settings) {
            if (settings.hasOwnProperty(i)) {
                this.battleInfo[i] = (settings as any)[i];
            }
        }

        this.battleInfo.battlers.player!.selectedActor = this.battleInfo.battlers.player!.actors![0];
        this.battleInfo.battlers.opponent!.selectedActor = this.battleInfo.battlers.opponent!.actors![0];

        this.createBackground();

        this.GameStarter.MenuGrapher.createMenu(this.menuNames.battle, {
            ignoreB: true
        });
        this.GameStarter.MenuGrapher.createMenu(this.menuNames.battleDisplayInitial);

        this.things.menu = this.GameStarter.MenuGrapher.getMenu(this.menuNames.battleDisplayInitial);
        this.setThing("opponent", this.battleInfo.battlers.opponent!.sprite);
        this.setThing("player", this.battleInfo.battlers.player!.sprite);

        this.GameStarter.ScenePlayer.startCutscene(this.menuNames.battle, {
            things: this.things,
            battleInfo: this.battleInfo,
            nextCutscene: settings.nextCutscene,
            nextCutsceneSettings: settings.nextCutsceneSettings
        });
    }

    /**
     * Closes any current battle.
     * 
     * @param callback   A callback to run after the battle is closed.
     * @remarks The callback will run after deleting menus but before the next cutscene.
     */
    public closeBattle(callback?: () => void): void {
        if (!this.inBattle) {
            return;
        }

        this.inBattle = false;

        for (const i in this.things) {
            if (this.things.hasOwnProperty(i)) {
                this.GameStarter.physics.killNormal(this.things[i]!);
            }
        }

        this.deleteBackground();

        this.GameStarter.MenuGrapher.deleteMenu(this.menuNames.battle);
        this.GameStarter.MenuGrapher.deleteMenu(this.menuNames.generalText);
        this.GameStarter.MenuGrapher.deleteMenu(this.menuNames.player);

        if (callback) {
            callback();
        }

        this.GameStarter.ScenePlayer.playRoutine("Complete");

        if (this.battleInfo.nextCutscene) {
            this.GameStarter.ScenePlayer.startCutscene(
                this.battleInfo.nextCutscene, this.battleInfo.nextCutsceneSettings);
        } else if (this.battleInfo.nextRoutine) {
            this.GameStarter.ScenePlayer.playRoutine(
                this.battleInfo.nextRoutine, this.battleInfo.nextRoutineSettings);
        } else {
            this.GameStarter.ScenePlayer.stopCutscene();
        }
    }

    /**
     * Shows the player menu.
     */
    public showPlayerMenu(): void {
        this.GameStarter.MenuGrapher.createMenu(this.menuNames.player, {
            ignoreB: true
        });

        this.GameStarter.MenuGrapher.addMenuList(this.menuNames.player, {
            options: this.battleOptions
        });

        this.GameStarter.MenuGrapher.setActiveMenu(this.menuNames.player);
    }

    /**
     * Creates and displays an in-battle Thing.
     * 
     * @param name   The storage name of the Thing.
     * @param title   The Thing's in-game type.
     * @param settings   Any additional settings to create the Thing.
     * @returns The created Thing.
     */
    public setThing(name: string, title: string, settings?: any): IThing {
        const position: IPosition = this.positions[name] || {};
        const battleMenu: IMenu = this.GameStarter.MenuGrapher.getMenu(this.menuNames.battle);
        let thing: IThing | undefined = this.things[name];

        if (thing) {
            this.GameStarter.physics.killNormal(thing);
        }

        thing = this.things[name] = this.GameStarter.ObjectMaker.make(title, settings) as IThing;

        this.GameStarter.things.add(
            thing,
            battleMenu.left + (position.left || 0) * this.GameStarter.unitsize,
            battleMenu.top + (position.top || 0) * this.GameStarter.unitsize);

        this.GameStarter.GroupHolder.switchMemberGroup(thing, thing.groupType, "Text");

        return thing;
    }

    /**
     * Starts a round of battle with a player's move.
     * 
     * @param choisePlayer   The player's move choice.
     */
    public playMove(choicePlayer: string): void {
        const choiceOpponent: string = this.GameStarter.MathDecider.compute(
            "opponentMove",
            this.battleInfo.battlers.player,
            this.battleInfo.battlers.opponent);

        const playerMovesFirst: boolean = this.GameStarter.MathDecider.compute(
            "playerMovesFirst",
            this.battleInfo.battlers.player,
            choicePlayer,
            this.battleInfo.battlers.opponent,
            choiceOpponent);

        if (playerMovesFirst) {
            this.GameStarter.ScenePlayer.playRoutine("MovePlayer", {
                extRoutine: "MoveOpponent",
                choicePlayer: choicePlayer,
                choiceOpponent: choiceOpponent
            });
        } else {
            this.GameStarter.ScenePlayer.playRoutine("MoveOpponent", {
                nextRoutine: "MovePlayer",
                choicePlayer: choicePlayer,
                choiceOpponent: choiceOpponent
            });
        }
    }

    /**
     * Switches a battler's actor.
     * 
     * @param battlerName   The name of the battler.
     */
    public switchActor(battlerName: "player" | "opponent", i: number): void {
        const battler: IBattler = this.battleInfo.battlers[battlerName]!;

        if (battler.selectedIndex === i) {
            this.GameStarter.ScenePlayer.playRoutine("PlayerSwitchesSamePokemon");
            return;
        }

        battler.selectedIndex = i;
        battler.selectedActor = battler.actors![i];

        this.GameStarter.ScenePlayer.playRoutine((battlerName === "player" ? "Player" : "Opponent") + "SendOut");
    }

    /**
     * Creates the battle background.
     * 
     * @param type   A type of background, if not the default.
     */
    public createBackground(type: string = this.backgroundType!): void {
        this.backgroundThing = this.GameStarter.things.add(type);

        this.GameStarter.physics.setWidth(
            this.backgroundThing,
            this.GameStarter.MapScreener.width / 4);

        this.GameStarter.physics.setHeight(
            this.backgroundThing,
            this.GameStarter.MapScreener.height / 4);

        this.GameStarter.GroupHolder.switchMemberGroup(
            this.backgroundThing,
            this.backgroundThing.groupType,
            "Text");
    }

    /**
     * Deletes the battle background.
     */
    public deleteBackground(): void {
        if (this.backgroundThing) {
            this.GameStarter.physics.killNormal(this.backgroundThing);
        }
    }
}
