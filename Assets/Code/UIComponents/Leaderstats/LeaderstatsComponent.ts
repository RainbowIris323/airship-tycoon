import { Game } from "@Easy/Core/Shared/Game";
import { Network } from "Code/CoreComponents/Network";
import PlayerStatsComponent from "./PlayerStatsComponent";

export default class LeaderstatsComponent extends AirshipBehaviour {
    public playerstatsPrefab: GameObject;
    public playerstatsContainer: GameObject;
    public updateFrequency: number = 1;
    private timeSinceLastUpdate: number = 0;
    private updated: boolean = false;
    private displayFunctions: Map<string, (value: number) => string> = new Map<string, (value: number) => string>();
    private leaderstats: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

    private playerstats: Map<string, PlayerStatsComponent> = new Map<string, PlayerStatsComponent>();

    protected Start(): void {
        if (!Game.IsClient()) return;
        Network.ServerToClient.LeaderStatsUpdate.client.OnServerEvent((leaderstats) => this.UpdateClient(leaderstats))
    }

    public SetLeaderstat(player: string, rawStats: Map<string, number>): void {
        if (!Game.IsServer) return;
        const stats: Map<string, string> = new Map<string, string>();
        rawStats?.forEach((value, key) => {
            const func = this.displayFunctions.get(key);
            if (func === undefined) {
                stats.set(key, `${value}`);
                return;
            }
            stats.set(key, func(value));
        });
        this.leaderstats.set(player, stats);
        this.updated = true;
    }

    public RemoveLeaderstat(player: string): void {
        if (!Game.IsServer) return;
        this.leaderstats.delete(player);
        this.updated = true;
    }

    public SetDisplayFunction(stat: string, func: (value: number) => string): void {
        if (!Game.IsServer) return;
        this.displayFunctions.set(stat, func);
    }

    protected Update(dt: number): void {
        if (!Game.IsServer()) return;
        this.timeSinceLastUpdate += dt;
        if (!this.updated || this.timeSinceLastUpdate < this.updateFrequency) return;
        this.updated = false;
        Network.ServerToClient.LeaderStatsUpdate.server.FireAllClients(this.leaderstats);
    }

    public UpdateClient(leaderstats: Map<string, Map<string, string>>): void {
        if (!Game.IsClient()) return;
        leaderstats.forEach((playerstats, player) => {
            let playerstat = this.playerstats.get(player);
            if (playerstat === undefined) {
                const prefab = Instantiate(this.playerstatsPrefab, this.playerstatsContainer.transform);
                playerstat = prefab.GetAirshipComponent<PlayerStatsComponent>()!;
                playerstat.DoStart(player)
                this.playerstats.set(player, playerstat);
            }
            playerstat.DoUpdate(playerstats);
        });
    }
}