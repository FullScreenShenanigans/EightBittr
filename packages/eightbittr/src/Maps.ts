import { Component } from "eightbittr/lib/Component";
import { IArea, IMap, IPreThingsContainers } from "mapscreatr/lib/IMapsCreatr";
import { ICommand } from "worldseedr/lib/IWorldSeedr";

import { GameStartr } from "./GameStartr";

/**
 * Maps functions used by IGameStartr instances.
 */
export abstract class Maps<TEightBittr extends GameStartr> extends Component<TEightBittr> {
    /**
     * Sets the current location.
     */
    public abstract setLocation(...args: any[]): any;

    /**
     * Sets the current map.
     */
    public abstract setMap(...args: any[]): any;

    /**
     * Spawns all Things within a given area that should be there. 
     * 
     * @param this
     * @param direction   The direction spawning comes from.
     * @param top   A top boundary to spawn within.
     * @param right   A right boundary to spawn within.
     * @param bottom   A bottom boundary to spawn within.
     * @param left   A left boundary to spawn within.
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    public onAreaSpawn(direction: string, top: number, right: number, bottom: number, left: number): void {
        this.EightBitter.AreaSpawner.spawnArea(
            direction,
            (top + this.EightBitter.MapScreener.top) / this.EightBitter.unitsize,
            (right + this.EightBitter.MapScreener.left) / this.EightBitter.unitsize,
            (bottom + this.EightBitter.MapScreener.top) / this.EightBitter.unitsize,
            (left + this.EightBitter.MapScreener.left) / this.EightBitter.unitsize
        );
    }

    /**
     * "Unspawns" all Things within a given area that should be gone by marking
     * their PreThings as not in game.
     * 
     * @param this
     * @param direction   The direction spawning comes from.
     * @param top   A top boundary to spawn within.
     * @param right   A right boundary to spawn within.
     * @param bottom   A bottom boundary to spawn within.
     * @param left   A left boundary to spawn within.
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    public onAreaUnspawn(direction: string, top: number, right: number, bottom: number, left: number): void {
        this.EightBitter.AreaSpawner.unspawnArea(
            direction,
            (top + this.EightBitter.MapScreener.top) / this.EightBitter.unitsize,
            (right + this.EightBitter.MapScreener.left) / this.EightBitter.unitsize,
            (bottom + this.EightBitter.MapScreener.top) / this.EightBitter.unitsize,
            (left + this.EightBitter.MapScreener.left) / this.EightBitter.unitsize
        );
    }

    /**
     * Runs through commands generated by a WorldSeedr and evaluates all of 
     * to create PreThings via MapsCreator.analyzePreSwitch. 
     * 
     * @param this
     * @param generatedCommands   Commands generated by WorldSeedr.generateFull.
     */
    public placeRandomCommands(generatedCommands: ICommand[]): void {
        const prethings: IPreThingsContainers = this.EightBitter.AreaSpawner.getPreThings();
        const area: IArea = this.EightBitter.AreaSpawner.getArea();
        const map: IMap = this.EightBitter.AreaSpawner.getMap();

        for (const command of generatedCommands) {
            const output: any = {
                thing: command.title,
                x: command.left,
                y: command.top
            };

            if (command.arguments) {
                this.EightBitter.utilities.proliferateHard(output, command.arguments, true);
            }

            this.EightBitter.MapsCreator.analyzePreSwitch(output, prethings, area, map);
        }
    }
}
