import { Airship } from "@Easy/Core/Shared/Airship";
import TycoonComponent from "./TycoonComponent";
import { Player } from "@Easy/Core/Shared/Player/Player";
import LeaderstatsComponent from "Code/UIComponents/Leaderstats/LeaderstatsComponent";
import { Game } from "@Easy/Core/Shared/Game";
import Character from "@Easy/Core/Shared/Character/Character";

export default class TycoonManagerComponent extends AirshipBehaviour {
    public tycoons: Array<TycoonComponent> = new Array<TycoonComponent>();
    public leaderstats: LeaderstatsComponent;

    protected Start(): void {
        if (!Game.IsServer()) return;
        this.leaderstats.SetDisplayFunction("money", (value) => `$${value}`);
        Airship.Players.onPlayerJoined.Connect((player: Player) => this.OnPlayerJoined(player));
        Airship.Players.onPlayerDisconnected.Connect((player: Player) => this.OnPlayerDisconnected(player));

        Airship.Players.ObservePlayers((player) => {
            while (this.FindPlayerTycoon(player.userId) === undefined) task.wait(0.1);
            const tycoon = this.FindPlayerTycoon(player.userId)!;
            player.SpawnCharacter(tycoon.gameObject.transform.position, {
                lookDirection: this.transform.forward,
            });
        });

        // Respawn characters when they die
        Airship.Damage.onDeath.Connect((damageInfo) => {
            const character = damageInfo.gameObject.GetAirshipComponent<Character>();
            character?.Despawn();
            if (character?.player) {
                while (this.FindPlayerTycoon(character?.player.userId) === undefined) task.wait(0.1);
                const tycoon = this.FindPlayerTycoon(character?.player.userId)!;
                character?.player.SpawnCharacter(tycoon.gameObject.transform.position, {
                    lookDirection: this.transform.forward,
                });
            }
        });
    }

    private OnPlayerJoined(player: Player): void {
        if (!Game.IsServer()) return;
        // Find the first unowned tycoon.
        let tycoon: TycoonComponent | undefined = undefined;
        for (let i = 0; i < this.tycoons.size(); i++) {
            if (this.tycoons[i].owner !== undefined) continue;
            tycoon = this.tycoons[i];
            break;
        }
        // Load tycoon or kick.
        if (tycoon !== undefined) {
            this.LoadTycoon(player, tycoon);
            return;
        }
        player.Kick("No Available Tycoon!");
    }

    private OnPlayerDisconnected(player: Player): void {
        if (!Game.IsServer()) return;
        // Find player tycoon and unload.
        const tycoon = this.FindPlayerTycoon(player.userId);
        if (tycoon) this.LoadTycoon(undefined, tycoon);
        this.leaderstats.RemoveLeaderstat(player.userId);
    }

    private LoadTycoon(player: Player | undefined, tycoon: TycoonComponent): void {
        if (!Game.IsServer()) return;
        if (player === undefined) {
            if (tycoon.connectionId !== undefined) tycoon.money.Disconnect(tycoon.connectionId);
            tycoon.owner = undefined;
            print(`Unloaded tycoon #${tycoon.id}. | TycoonManagerComponent.LoadTycoon`);
            return;
        }
        tycoon.owner = player.userId;
        this.UpdateOwnerStats(player.userId, 0);
        tycoon.connectionId = tycoon.money.Connect((money) => this.UpdateOwnerStats(player.userId, money));
        print(`Loaded tycoon #${tycoon.id} for ${player.username} | TycoonManagerComponent.LoadTycoon`);
    }

    /**
     * Returns the players assigned tycoon from there userId.
     */
    public FindPlayerTycoon(userId: string): TycoonComponent | undefined {
        if (!Game.IsServer()) return;
        let tycoon: TycoonComponent | undefined = undefined
        this.tycoons.forEach((tycoonComponent: TycoonComponent) => {
            if (tycoonComponent.owner === userId) tycoon = tycoonComponent;
        });
        return tycoon;
    }

    public UpdateOwnerStats(player: string, money: number): void {
        if (!Game.IsServer()) return;
        this.leaderstats.SetLeaderstat(player, new Map<string, number>([
            ["money", money],
        ]));
    }
};